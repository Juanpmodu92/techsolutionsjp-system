import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { loginSchema } from './auth.schema.js';
import { findUserByEmail, findUserById } from './auth.repository.js';
import { handleDatabaseError } from '../../shared/utils/db-error.js';

export async function loginHandler(req, res) {
  try {
    const payload = loginSchema.parse(req.body);

    const user = await findUserByEmail(payload.email);

    if (!user || !user.is_active) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      env.jwtSecret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      ok: true,
      data: {
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          is_active: user.is_active
        }
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: error.flatten()
      });
    }

    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function meHandler(req, res) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: user
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}