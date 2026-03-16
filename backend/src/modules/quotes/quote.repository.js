import { db } from '../../config/db.js';
import { buildNextQuoteNumber } from './quote.utils.js';

export async function getClientByIdForQuote(clientId) {
  const query = `
    SELECT id, is_active
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [clientId]);
  return result.rows[0] ?? null;
}

export async function getActiveProductById(id) {
  const query = `
    SELECT id, name, price, is_active
    FROM products
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function getActiveServiceById(id) {
  const query = `
    SELECT id, name, base_price, is_active
    FROM services
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function getLastQuoteNumber(client) {
  const query = `
    SELECT quote_number
    FROM quotes
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await client.query(query);
  return result.rows[0]?.quote_number ?? null;
}

export async function createQuoteWithItems(data) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const lastQuoteNumber = await getLastQuoteNumber(client);
    const quoteNumber = buildNextQuoteNumber(lastQuoteNumber);

    const insertQuoteQuery = `
      INSERT INTO quotes (
        quote_number,
        client_id,
        user_id,
        expiration_date,
        status,
        subtotal,
        discount,
        tax,
        total,
        notes
      )
      VALUES ($1, $2, $3, $4, 'draft', $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const quoteValues = [
      quoteNumber,
      data.client_id,
      data.user_id,
      data.expiration_date ?? null,
      data.subtotal,
      data.discount,
      data.tax,
      data.total,
      data.notes ?? null
    ];

    const quoteResult = await client.query(insertQuoteQuery, quoteValues);
    const quote = quoteResult.rows[0];

    for (const item of data.items) {
      const insertItemQuery = `
        INSERT INTO quote_items (
          quote_id,
          item_type,
          reference_id,
          description,
          quantity,
          unit_price,
          line_total,
          metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      const itemValues = [
        quote.id,
        item.item_type,
        item.reference_id ?? null,
        item.description,
        item.quantity,
        item.unit_price,
        item.line_total,
        item.metadata ?? null
      ];

      await client.query(insertItemQuery, itemValues);
    }

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
        'quote_created',
        'quote',
        quote.id,
        `Quote ${quote.quote_number} was created`
      ]
    );

    const itemsResult = await client.query(
      `
        SELECT *
        FROM quote_items
        WHERE quote_id = $1
        ORDER BY created_at ASC
      `,
      [quote.id]
    );

    await client.query('COMMIT');

    return {
      ...quote,
      items: itemsResult.rows
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllQuotes() {
  const query = `
    SELECT
      q.id,
      q.quote_number,
      q.client_id,
      q.user_id,
      q.issue_date,
      q.expiration_date,
      q.status,
      q.subtotal,
      q.discount,
      q.tax,
      q.total,
      q.notes,
      q.created_at,
      q.updated_at,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email
    FROM quotes q
    INNER JOIN clients c ON c.id = q.client_id
    ORDER BY q.created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

export async function getQuoteById(id) {
  const quoteQuery = `
    SELECT
      q.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email,
      u.first_name AS created_by_first_name,
      u.last_name AS created_by_last_name,
      u.email AS created_by_email
    FROM quotes q
    INNER JOIN clients c ON c.id = q.client_id
    INNER JOIN users u ON u.id = q.user_id
    WHERE q.id = $1
    LIMIT 1
  `;

  const quoteResult = await db.query(quoteQuery, [id]);
  const quote = quoteResult.rows[0] ?? null;

  if (!quote) {
    return null;
  }

  const itemsQuery = `
    SELECT *
    FROM quote_items
    WHERE quote_id = $1
    ORDER BY created_at ASC
  `;

  const itemsResult = await db.query(itemsQuery, [id]);

  return {
    ...quote,
    items: itemsResult.rows
  };
}

export async function updateQuoteStatus({ quoteId, status, changedByUserId }) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const currentQuoteResult = await client.query(
      `
        SELECT id, quote_number, client_id, status
        FROM quotes
        WHERE id = $1
        LIMIT 1
      `,
      [quoteId]
    );

    const currentQuote = currentQuoteResult.rows[0] ?? null;

    if (!currentQuote) {
      await client.query('ROLLBACK');
      return null;
    }

    const updateResult = await client.query(
      `
        UPDATE quotes
        SET
          status = $2,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [quoteId, status]
    );

    const updatedQuote = updateResult.rows[0];

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
        currentQuote.client_id,
        'quote_status_changed',
        'quote',
        currentQuote.id,
        `Quote ${currentQuote.quote_number} status changed from ${currentQuote.status} to ${status} by user ${changedByUserId}`
      ]
    );

    await client.query('COMMIT');

    return {
      previousStatus: currentQuote.status,
      quote: updatedQuote
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}