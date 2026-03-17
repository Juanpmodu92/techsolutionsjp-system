import { db } from '../../config/db.js';

export async function getAllUsers() {
  const result = await db.query(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function getUserById(id) {
  const result = await db.query(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function getUserByEmail(email) {
  const result = await db.query(
    `
      SELECT id, email, is_active
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function createUser(data) {
  const result = await db.query(
    `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        role,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
    `,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.password_hash,
      data.role
    ]
  );

  return result.rows[0];
}

export async function updateUser(id, data) {
  const result = await db.query(
    `
      UPDATE users
      SET
        first_name = $2,
        last_name = $3,
        email = $4,
        role = $5,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
    `,
    [id, data.first_name, data.last_name, data.email, data.role]
  );

  return result.rows[0] ?? null;
}

export async function activateUser(id) {
  const result = await db.query(
    `
      UPDATE users
      SET
        is_active = TRUE,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function deactivateUser(id) {
  const result = await db.query(
    `
      UPDATE users
      SET
        is_active = FALSE,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
    `,
    [id]
  );

  return result.rows[0] ?? null;
}