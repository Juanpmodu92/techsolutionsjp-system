import { db } from '../../config/db.js';
import { buildNextSaleNumber } from './sale.utils.js';

export async function getClientByIdForSale(clientId) {
  const query = `
    SELECT id, is_active
    FROM clients
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [clientId]);
  return result.rows[0] ?? null;
}

export async function getActiveProductByIdForSale(id, client = db) {
  const query = `
    SELECT id, name, price, stock_quantity, is_active
    FROM products
    WHERE id = $1
    LIMIT 1
  `;

  const result = await client.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function getActiveServiceByIdForSale(id) {
  const query = `
    SELECT id, name, base_price, is_active
    FROM services
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

async function getLastSaleNumber(client) {
  const query = `
    SELECT sale_number
    FROM sales
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await client.query(query);
  return result.rows[0]?.sale_number ?? null;
}

export async function createSaleWithItems(data) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const lastSaleNumber = await getLastSaleNumber(client);
    const saleNumber = buildNextSaleNumber(lastSaleNumber);

    const saleResult = await client.query(
      `
        INSERT INTO sales (
          sale_number,
          client_id,
          user_id,
          quote_id,
          status,
          subtotal,
          discount,
          tax,
          total,
          notes
        )
        VALUES ($1, $2, $3, $4, 'completed', $5, $6, $7, $8, $9)
        RETURNING *
      `,
      [
        saleNumber,
        data.client_id,
        data.user_id,
        data.quote_id ?? null,
        data.subtotal,
        data.discount,
        data.tax,
        data.total,
        data.notes ?? null
      ]
    );

    const sale = saleResult.rows[0];

    for (const item of data.items) {
      if (item.item_type === 'product') {
        const product = await getActiveProductByIdForSale(item.reference_id, client);

        if (!product) {
          await client.query('ROLLBACK');
          return { error: 'PRODUCT_NOT_FOUND', referenceId: item.reference_id };
        }

        if (!product.is_active) {
          await client.query('ROLLBACK');
          return { error: 'PRODUCT_INACTIVE', referenceId: item.reference_id };
        }

        if (product.stock_quantity < item.quantity) {
          await client.query('ROLLBACK');
          return {
            error: 'INSUFFICIENT_STOCK',
            referenceId: item.reference_id,
            productName: product.name
          };
        }

        const newStock = product.stock_quantity - item.quantity;

        await client.query(
          `
            UPDATE products
            SET
              stock_quantity = $2,
              updated_at = NOW()
            WHERE id = $1
          `,
          [item.reference_id, newStock]
        );

        await client.query(
          `
            INSERT INTO inventory_movements (
              product_id,
              movement_type,
              quantity,
              previous_stock,
              new_stock,
              reason,
              created_by_user_id
            )
            VALUES ($1, 'exit', $2, $3, $4, $5, $6)
          `,
          [
            item.reference_id,
            item.quantity,
            product.stock_quantity,
            newStock,
            `Sale ${saleNumber}`,
            data.user_id
          ]
        );
      }

      await client.query(
        `
          INSERT INTO sale_items (
            sale_id,
            item_type,
            reference_id,
            description,
            quantity,
            unit_price,
            line_total,
            metadata
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          sale.id,
          item.item_type,
          item.reference_id ?? null,
          item.description,
          item.quantity,
          item.unit_price,
          item.line_total,
          item.metadata ?? null
        ]
      );
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
        'sale_created',
        'sale',
        sale.id,
        `Sale ${saleNumber} was created`
      ]
    );

    const itemsResult = await client.query(
      `
        SELECT *
        FROM sale_items
        WHERE sale_id = $1
        ORDER BY created_at ASC
      `,
      [sale.id]
    );

    await client.query('COMMIT');

    return {
      ...sale,
      items: itemsResult.rows
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllSales() {
  const query = `
    SELECT
      s.*,
      c.client_type,
      c.first_name,
      c.last_name,
      c.company_name,
      c.email AS client_email
    FROM sales s
    INNER JOIN clients c ON c.id = s.client_id
    ORDER BY s.created_at DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

export async function getSaleById(id) {
  const saleResult = await db.query(
    `
      SELECT
        s.*,
        c.client_type,
        c.first_name,
        c.last_name,
        c.company_name,
        c.email AS client_email,
        u.first_name AS created_by_first_name,
        u.last_name AS created_by_last_name,
        u.email AS created_by_email
      FROM sales s
      INNER JOIN clients c ON c.id = s.client_id
      INNER JOIN users u ON u.id = s.user_id
      WHERE s.id = $1
      LIMIT 1
    `,
    [id]
  );

  const sale = saleResult.rows[0] ?? null;

  if (!sale) {
    return null;
  }

  const itemsResult = await db.query(
    `
      SELECT *
      FROM sale_items
      WHERE sale_id = $1
      ORDER BY created_at ASC
    `,
    [id]
  );

  return {
    ...sale,
    items: itemsResult.rows
  };
}