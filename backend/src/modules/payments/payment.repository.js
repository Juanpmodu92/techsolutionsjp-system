import { db } from '../../config/db.js';

async function getLastPaymentNumber(client) {
  const query = `
    SELECT payment_number
    FROM payments
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await client.query(query);
  return result.rows[0]?.payment_number ?? null;
}

function buildNextPaymentNumber(lastPaymentNumber) {
  if (!lastPaymentNumber) {
    return 'PAY-000001';
  }

  const numericPart = Number(lastPaymentNumber.split('-')[1] || 0);
  const nextNumber = numericPart + 1;

  return `PAY-${String(nextNumber).padStart(6, '0')}`;
}

export async function getClientByIdForPayment(clientId) {
  const result = await db.query(
    `
      SELECT id, is_active
      FROM clients
      WHERE id = $1
      LIMIT 1
    `,
    [clientId]
  );

  return result.rows[0] ?? null;
}

export async function getSaleByIdForPayment(saleId) {
  const result = await db.query(
    `
      SELECT id, client_id, total, status
      FROM sales
      WHERE id = $1
      LIMIT 1
    `,
    [saleId]
  );

  return result.rows[0] ?? null;
}

export async function getTechnicalServiceByIdForPayment(technicalServiceId) {
  const result = await db.query(
    `
      SELECT id, client_id, service_cost, status
      FROM technical_services
      WHERE id = $1
      LIMIT 1
    `,
    [technicalServiceId]
  );

  return result.rows[0] ?? null;
}

export async function getPaidAmountForSale(saleId) {
  const result = await db.query(
    `
      SELECT COALESCE(SUM(amount), 0)::numeric(12,2) AS paid_amount
      FROM payments
      WHERE sale_id = $1
    `,
    [saleId]
  );

  return Number(result.rows[0].paid_amount);
}

export async function getPaidAmountForTechnicalService(technicalServiceId) {
  const result = await db.query(
    `
      SELECT COALESCE(SUM(amount), 0)::numeric(12,2) AS paid_amount
      FROM payments
      WHERE technical_service_id = $1
    `,
    [technicalServiceId]
  );

  return Number(result.rows[0].paid_amount);
}

export async function createPayment(data) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const lastPaymentNumber = await getLastPaymentNumber(client);
    const paymentNumber = buildNextPaymentNumber(lastPaymentNumber);

    const result = await client.query(
      `
        INSERT INTO payments (
          payment_number,
          client_id,
          sale_id,
          technical_service_id,
          received_by_user_id,
          payment_method,
          amount,
          reference,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      [
        paymentNumber,
        data.client_id,
        data.sale_id ?? null,
        data.technical_service_id ?? null,
        data.received_by_user_id,
        data.payment_method,
        data.amount,
        data.reference ?? null,
        data.notes ?? null
      ]
    );

    const payment = result.rows[0];

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
        'payment_created',
        'payment',
        payment.id,
        `Payment ${payment.payment_number} was created`
      ]
    );

    await client.query('COMMIT');
    return payment;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllPayments(filters = {}) {
  const { saleId = '', technicalServiceId = '', clientId = '' } = filters;

  const result = await db.query(
    `
      SELECT
        p.*,
        c.client_type,
        c.first_name,
        c.last_name,
        c.company_name,
        s.sale_number,
        ts.ticket_number,
        u.first_name AS received_by_first_name,
        u.last_name AS received_by_last_name
      FROM payments p
      INNER JOIN clients c ON c.id = p.client_id
      LEFT JOIN sales s ON s.id = p.sale_id
      LEFT JOIN technical_services ts ON ts.id = p.technical_service_id
      LEFT JOIN users u ON u.id = p.received_by_user_id
      WHERE (
        ($1 = '' OR p.sale_id = CAST($1 AS UUID))
        AND ($2 = '' OR p.technical_service_id = CAST($2 AS UUID))
        AND ($3 = '' OR p.client_id = CAST($3 AS UUID))
      )
      ORDER BY p.created_at DESC
    `,
    [saleId, technicalServiceId, clientId]
  );

  return result.rows;
}