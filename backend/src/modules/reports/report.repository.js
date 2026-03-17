import { db } from '../../config/db.js';

function buildDateFilter(columnName, dateFrom, dateTo, startIndex = 1) {
  const conditions = [];
  const values = [];
  let index = startIndex;

  if (dateFrom) {
    conditions.push(`${columnName} >= $${index}`);
    values.push(dateFrom);
    index += 1;
  }

  if (dateTo) {
    conditions.push(`${columnName} <= $${index}`);
    values.push(dateTo);
    index += 1;
  }

  return {
    clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values
  };
}

export async function getSalesSummary({ dateFrom = '', dateTo = '' }) {
  const filter = buildDateFilter('sale_date', dateFrom, dateTo);

  const [totalsResult, byDayResult] = await Promise.all([
    db.query(
      `
        SELECT
          COUNT(*)::int AS total_sales,
          COALESCE(SUM(total), 0)::numeric(12,2) AS total_amount,
          COALESCE(AVG(total), 0)::numeric(12,2) AS average_ticket
        FROM sales
        ${filter.clause}
      `,
      filter.values
    ),
    db.query(
      `
        SELECT
          sale_date,
          COUNT(*)::int AS total_sales,
          COALESCE(SUM(total), 0)::numeric(12,2) AS total_amount
        FROM sales
        ${filter.clause}
        GROUP BY sale_date
        ORDER BY sale_date DESC
      `,
      filter.values
    )
  ]);

  return {
    totals: totalsResult.rows[0],
    by_day: byDayResult.rows
  };
}

export async function getPaymentsSummary({ dateFrom = '', dateTo = '' }) {
  const filter = buildDateFilter('payment_date', dateFrom, dateTo);

  const [totalsResult, byMethodResult] = await Promise.all([
    db.query(
      `
        SELECT
          COUNT(*)::int AS total_payments,
          COALESCE(SUM(amount), 0)::numeric(12,2) AS total_amount
        FROM payments
        ${filter.clause}
      `,
      filter.values
    ),
    db.query(
      `
        SELECT
          payment_method,
          COUNT(*)::int AS total_payments,
          COALESCE(SUM(amount), 0)::numeric(12,2) AS total_amount
        FROM payments
        ${filter.clause}
        GROUP BY payment_method
        ORDER BY payment_method ASC
      `,
      filter.values
    )
  ]);

  return {
    totals: totalsResult.rows[0],
    by_method: byMethodResult.rows
  };
}

export async function getInventorySummary() {
  const [productsResult, lowStockResult, recentMovementsResult] = await Promise.all([
    db.query(`
      SELECT
        COUNT(*)::int AS total_products,
        COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active_products
      FROM products
    `),
    db.query(`
      SELECT
        id,
        sku,
        name,
        stock_quantity,
        minimum_stock
      FROM products
      WHERE is_active = TRUE
        AND stock_quantity <= minimum_stock
      ORDER BY stock_quantity ASC, name ASC
    `),
    db.query(`
      SELECT
        im.id,
        im.product_id,
        im.movement_type,
        im.quantity,
        im.previous_stock,
        im.new_stock,
        im.reason,
        im.created_at,
        p.name AS product_name,
        p.sku AS product_sku
      FROM inventory_movements im
      INNER JOIN products p ON p.id = im.product_id
      ORDER BY im.created_at DESC
      LIMIT 20
    `)
  ]);

  return {
    totals: productsResult.rows[0],
    low_stock_products: lowStockResult.rows,
    recent_movements: recentMovementsResult.rows
  };
}

export async function getTechnicalServicesSummary({ dateFrom = '', dateTo = '' }) {
  const filter = buildDateFilter('received_date', dateFrom, dateTo);

  const [totalsResult, byStatusResult] = await Promise.all([
    db.query(
      `
        SELECT
          COUNT(*)::int AS total_technical_services,
          COALESCE(SUM(service_cost), 0)::numeric(12,2) AS total_estimated_amount
        FROM technical_services
        ${filter.clause}
      `,
      filter.values
    ),
    db.query(
      `
        SELECT
          status,
          COUNT(*)::int AS total
        FROM technical_services
        ${filter.clause}
        GROUP BY status
        ORDER BY status ASC
      `,
      filter.values
    )
  ]);

  return {
    totals: totalsResult.rows[0],
    by_status: byStatusResult.rows
  };
}