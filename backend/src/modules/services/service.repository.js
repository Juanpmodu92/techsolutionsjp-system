import { db } from '../../config/db.js';

export async function createService(data) {
  const query = `
    INSERT INTO services (
      name,
      description,
      category,
      base_price
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    data.name,
    data.description ?? null,
    data.category,
    data.base_price
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getAllServices(search = '') {
  const normalizedSearch = search.trim();

  const query = `
    SELECT *
    FROM services
    WHERE (
      $1 = ''
      OR COALESCE(name, '') ILIKE '%' || $1 || '%'
    )
    ORDER BY created_at DESC
  `;

  const result = await db.query(query, [normalizedSearch]);
  return result.rows;
}

export async function getServiceById(id) {
  const query = `
    SELECT *
    FROM services
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function updateService(id, data) {
  const query = `
    UPDATE services
    SET
      name = $2,
      description = $3,
      category = $4,
      base_price = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    data.name,
    data.description ?? null,
    data.category,
    data.base_price
  ];

  const result = await db.query(query, values);
  return result.rows[0] ?? null;
}

export async function deactivateService(id) {
  const query = `
    UPDATE services
    SET
      is_active = FALSE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}