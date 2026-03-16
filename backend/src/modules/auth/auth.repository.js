import { db } from '../../config/db.js';

export async function findUserByEmail(email) {
  const query = `
    SELECT id, first_name, last_name, email, password_hash, role, is_active
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await db.query(query, [email]);
  return result.rows[0] ?? null;
}

export async function findUserById(id) {
  const query = `
    SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}