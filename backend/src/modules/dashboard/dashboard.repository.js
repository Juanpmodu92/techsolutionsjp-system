import { db } from '../../config/db.js';

export async function getDashboardMetrics() {
  const [
    clientsResult,
    activeClientsResult,
    activeProductsResult,
    activeServicesResult,
    quotesResult,
    salesResult,
    softwareProjectsResult,
    totalSalesAmountResult,
    quotesByStatusResult,
    projectsByStatusResult,
    lowStockProductsResult
  ] = await Promise.all([
    db.query(`
      SELECT COUNT(*)::int AS total_clients
      FROM clients
    `),

    db.query(`
      SELECT COUNT(*)::int AS active_clients
      FROM clients
      WHERE is_active = TRUE
    `),

    db.query(`
      SELECT COUNT(*)::int AS active_products
      FROM products
      WHERE is_active = TRUE
    `),

    db.query(`
      SELECT COUNT(*)::int AS active_services
      FROM services
      WHERE is_active = TRUE
    `),

    db.query(`
      SELECT COUNT(*)::int AS total_quotes
      FROM quotes
    `),

    db.query(`
      SELECT COUNT(*)::int AS total_sales
      FROM sales
    `),

    db.query(`
      SELECT COUNT(*)::int AS total_software_projects
      FROM software_projects
    `),

    db.query(`
      SELECT COALESCE(SUM(total), 0)::numeric(12,2) AS total_sales_amount
      FROM sales
      WHERE status = 'completed'
    `),

    db.query(`
      SELECT status, COUNT(*)::int AS total
      FROM quotes
      GROUP BY status
      ORDER BY status ASC
    `),

    db.query(`
      SELECT status, COUNT(*)::int AS total
      FROM software_projects
      GROUP BY status
      ORDER BY status ASC
    `),

    db.query(`
      SELECT
        id,
        sku,
        name,
        stock_quantity,
        minimum_stock,
        is_active
      FROM products
      WHERE is_active = TRUE
        AND stock_quantity <= minimum_stock
      ORDER BY stock_quantity ASC, name ASC
    `)
  ]);

  return {
    totals: {
      clients: clientsResult.rows[0].total_clients,
      active_clients: activeClientsResult.rows[0].active_clients,
      active_products: activeProductsResult.rows[0].active_products,
      active_services: activeServicesResult.rows[0].active_services,
      quotes: quotesResult.rows[0].total_quotes,
      sales: salesResult.rows[0].total_sales,
      software_projects: softwareProjectsResult.rows[0].total_software_projects,
      sales_amount: totalSalesAmountResult.rows[0].total_sales_amount
    },
    quotes_by_status: quotesByStatusResult.rows,
    software_projects_by_status: projectsByStatusResult.rows,
    low_stock_products: lowStockProductsResult.rows
  };
}