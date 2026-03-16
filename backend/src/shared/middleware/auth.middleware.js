import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      message: 'Authentication token is required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired token'
    });
  }
}