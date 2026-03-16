import { db } from '../../config/db.js';

export async function createClient(data) {
  const query = `
    INSERT INTO clients (
      client_type,
      first_name,
      last_name,
      company_name,
      document_number,
      tax_id,
      phone,
      email,
      address,
      city,
      notes
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    RETURNING *
  `;

  const values = [
    data.client_type,
    data.first_name ?? null,
    data.last_name ?? null,
    data.company_name ?? null,
    data.document_number ?? null,
    data.tax_id ?? null,
    data.phone ?? null,
    data.email ?? null,
    data.address ?? null,
    data.city ?? null,
    data.notes ?? null
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getAllClients(search = '') {
  const hasSearch = search.trim().length > 0;

  const query = `
    SELECT *
    FROM clients
    WHERE (
      $1 = ''
      OR COALESCE(first_name, '') ILIKE '%' || $1 || '%'
      OR COALESCE(last_name, '') ILIKE '%' || $1 || '%'
      OR COALESCE(company_name, '') ILIKE '%' || $1 || '%'
      OR COALESCE(email, '') ILIKE '%' || $1 || '%'
      OR COALESCE(document_number, '') ILIKE '%' || $1 || '%'
      OR COALESCE(tax_id, '') ILIKE '%' || $1 || '%'
    )
    ORDER BY created_at DESC
  `;

  const result = await db.query(query, [hasSearch ? search.trim() : '']);
  return result.rows;
}

export async function getClientById(id) {
  const query = `
    SELECT *
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function updateClient(id, data) {
  const query = `
    UPDATE clients
    SET
      client_type = $2,
      first_name = $3,
      last_name = $4,
      company_name = $5,
      document_number = $6,
      tax_id = $7,
      phone = $8,
      email = $9,
      address = $10,
      city = $11,
      notes = $12,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    data.client_type,
    data.first_name ?? null,
    data.last_name ?? null,
    data.company_name ?? null,
    data.document_number ?? null,
    data.tax_id ?? null,
    data.phone ?? null,
    data.email ?? null,
    data.address ?? null,
    data.city ?? null,
    data.notes ?? null
  ];

  const result = await db.query(query, values);
  return result.rows[0] ?? null;
}

export async function deactivateClient(id) {
  const query = `
    UPDATE clients
    SET
      is_active = FALSE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function reactivateClient(id) {
  const query = `
    UPDATE clients
    SET
      is_active = TRUE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}