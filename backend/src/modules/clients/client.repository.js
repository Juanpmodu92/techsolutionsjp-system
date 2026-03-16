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

export async function getAllClients() {
  const query = `
    SELECT *
    FROM clients
    ORDER BY created_at DESC
  `;

  const result = await db.query(query);
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