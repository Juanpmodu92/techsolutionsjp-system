import { db } from '../../config/db.js';

export async function getProductForInventory(productId, client = db) {
  const query = `
    SELECT id, name, stock_quantity, is_active
    FROM products
    WHERE id = $1
    LIMIT 1
  `;

  const result = await client.query(query, [productId]);
  return result.rows[0] ?? null;
}

export async function createInventoryMovement({
  productId,
  movementType,
  quantity,
  reason,
  createdByUserId
}) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const product = await getProductForInventory(productId, client);

    if (!product) {
      await client.query('ROLLBACK');
      return { error: 'PRODUCT_NOT_FOUND' };
    }

    if (!product.is_active) {
      await client.query('ROLLBACK');
      return { error: 'PRODUCT_INACTIVE' };
    }

    const previousStock = product.stock_quantity;
    let newStock = previousStock;

    if (movementType === 'entry') {
      newStock = previousStock + quantity;
    }

    if (movementType === 'exit') {
      newStock = previousStock - quantity;
    }

    if (movementType === 'adjustment') {
      newStock = quantity;
    }

    if (newStock < 0) {
      await client.query('ROLLBACK');
      return { error: 'INSUFFICIENT_STOCK' };
    }

    const updateProductResult = await client.query(
      `
        UPDATE products
        SET
          stock_quantity = $2,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [productId, newStock]
    );

    const movementResult = await client.query(
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        productId,
        movementType,
        quantity,
        previousStock,
        newStock,
        reason ?? null,
        createdByUserId
      ]
    );

    await client.query('COMMIT');

    return {
      product: updateProductResult.rows[0],
      movement: movementResult.rows[0]
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getInventoryMovements(productId = '') {
  const normalizedProductId = String(productId || '').trim();

  const query = `
    SELECT
      im.*,
      p.name AS product_name,
      p.sku AS product_sku,
      u.first_name AS created_by_first_name,
      u.last_name AS created_by_last_name,
      u.email AS created_by_email
    FROM inventory_movements im
    INNER JOIN products p ON p.id = im.product_id
    LEFT JOIN users u ON u.id = im.created_by_user_id
    WHERE (
      $1 = ''
      OR im.product_id = CAST($1 AS UUID)
    )
    ORDER BY im.created_at DESC
  `;

  const result = await db.query(query, [normalizedProductId]);
  return result.rows;
}