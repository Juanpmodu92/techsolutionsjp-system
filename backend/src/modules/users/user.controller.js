import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';
import {
  activateUser,
  createUser,
  deactivateUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser
} from './user.repository.js';

export async function getAllUsersHandler(_req, res) {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      ok: true,
      data: users
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function createUserHandler(req, res) {
  try {
    const payload = createUserSchema.parse(req.body);

    const existingUser = await getUserByEmail(payload.email);

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Email already in use'
      });
    }

    const password_hash = await bcrypt.hash(payload.password, 10);

    const user = await createUser({
      ...payload,
      password_hash
    });

    return res.status(201).json({
      ok: true,
      data: user
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

export async function updateUserHandler(req, res) {
  try {
    const payload = updateUserSchema.parse(req.body);
    const { id } = req.params;

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      });
    }

    const userWithEmail = await getUserByEmail(payload.email);

    if (userWithEmail && userWithEmail.id !== id) {
      return res.status(409).json({
        ok: false,
        message: 'Email already in use'
      });
    }

    const user = await updateUser(id, payload);

    return res.status(200).json({
      ok: true,
      data: user
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

export async function activateUserHandler(req, res) {
  try {
    const user = await activateUser(req.params.id);

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

export async function deactivateUserHandler(req, res) {
  try {
    const user = await deactivateUser(req.params.id);

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