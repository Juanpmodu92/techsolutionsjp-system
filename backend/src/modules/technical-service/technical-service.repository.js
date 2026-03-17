import { db } from '../../config/db.js';

async function getLastTechnicalServiceTicketNumber(client) {
  const query = `
    SELECT ticket_number
    FROM technical_services
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await client.query(query);
  return result.rows[0]?.ticket_number ?? null;
}

function buildNextTechnicalServiceTicketNumber(lastTicketNumber) {
  if (!lastTicketNumber) {
    return 'TS-000001';
  }

  const numericPart = Number(lastTicketNumber.split('-')[1] || 0);
  const nextNumber = numericPart + 1;

  return `TS-${String(nextNumber).padStart(6, '0')}`;
}

export async function getClientByIdForTechnicalService(clientId) {
  const query = `
    SELECT id, is_active
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [clientId]);
  return result.rows[0] ?? null;
}

export async function getProductByIdForTechnicalService(productId) {
  const query = `
    SELECT id, is_active, name
    FROM products
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [productId]);
  return result.rows[0] ?? null;
}

export async function getUserByIdForTechnicalService(userId) {
  const query = `
    SELECT id, is_active
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [userId]);
  return result.rows[0] ?? null;
}

export async function createTechnicalService(data) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const lastTicketNumber = await getLastTechnicalServiceTicketNumber(client);
    const ticketNumber = buildNextTechnicalServiceTicketNumber(lastTicketNumber);

    const result = await client.query(
      `
        INSERT INTO technical_services (
          client_id,
          received_by_user_id,
          assigned_user_id,
          related_product_id,
          ticket_number,
          service_type,
          device_type,
          device_brand,
          device_model,
          serial_number,
          problem_description,
          estimated_delivery_date,
          service_cost,
          status,
          notes
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'received', $14
        )
        RETURNING *
      `,
      [
        data.client_id,
        data.received_by_user_id,
        data.assigned_user_id ?? null,
        data.related_product_id ?? null,
        ticketNumber,
        data.service_type,
        data.device_type,
        data.device_brand ?? null,
        data.device_model ?? null,
        data.serial_number ?? null,
        data.problem_description,
        data.estimated_delivery_date ?? null,
        data.service_cost,
        data.notes ?? null
      ]
    );

    const technicalService = result.rows[0];

    await client.query(
      `
        INSERT INTO client_history (
          client_id,
          event_type,
          reference_type,
          reference_id,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        data.client_id,
        'technical_service_created',
        'technical_service',
        technicalService.id,
        `Technical service ${technicalService.ticket_number} was created`
      ]
    );

    await client.query('COMMIT');
    return technicalService;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllTechnicalServices() {
  const query = `
    SELECT
      ts.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email,
      p.name AS related_product_name
    FROM technical_services ts
    INNER JOIN clients c ON c.id = ts.client_id
    LEFT JOIN products p ON p.id = ts.related_product_id
    ORDER BY ts.created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

export async function getTechnicalServiceById(id) {
  const query = `
    SELECT
      ts.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email,
      p.name AS related_product_name
    FROM technical_services ts
    INNER JOIN clients c ON c.id = ts.client_id
    LEFT JOIN products p ON p.id = ts.related_product_id
    WHERE ts.id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function updateTechnicalServiceStatus({
  technicalServiceId,
  status,
  changedByUserId
}) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      `
        SELECT id, client_id, ticket_number, status
        FROM technical_services
        WHERE id = $1
        LIMIT 1
      `,
      [technicalServiceId]
    );

    const currentTechnicalService = currentResult.rows[0] ?? null;

    if (!currentTechnicalService) {
      await client.query('ROLLBACK');
      return null;
    }

    const updateQuery =
      status === 'delivered'
        ? `
          UPDATE technical_services
          SET
            status = $2,
            delivered_date = CURRENT_DATE,
            updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `
        : `
          UPDATE technical_services
          SET
            status = $2,
            updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `;

    const updateResult = await client.query(updateQuery, [
      technicalServiceId,
      status
    ]);

    const updatedTechnicalService = updateResult.rows[0];

    await client.query(
      `
        INSERT INTO client_history (
          client_id,
          event_type,
          reference_type,
          reference_id,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        currentTechnicalService.client_id,
        'technical_service_status_changed',
        'technical_service',
        currentTechnicalService.id,
        `Technical service ${currentTechnicalService.ticket_number} status changed from ${currentTechnicalService.status} to ${status} by user ${changedByUserId}`
      ]
    );

    await client.query('COMMIT');

    return {
      previousStatus: currentTechnicalService.status,
      technicalService: updatedTechnicalService
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}