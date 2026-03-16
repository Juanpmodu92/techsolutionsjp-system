import { db } from '../../config/db.js';

export async function createProductCategory(data) {
  const query = `
    INSERT INTO product_categories (
      name,
      description
    )
    VALUES ($1, $2)
    RETURNING *
  `;

  const values = [data.name, data.description ?? null];
  const result = await db.query(query, values);

  return result.rows[0];
}

export async function getAllProductCategories() {
  const query = `
    SELECT *
    FROM product_categories
    ORDER BY name ASC
  `;

  const result = await db.query(query);
  return result.rows;
}

export async function getProductCategoryById(id) {
  const query = `
    SELECT *
    FROM product_categories
    WHERE id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function createProduct(data) {
  const query = `
    INSERT INTO products (
      category_id,
      sku,
      name,
      description,
      cost,
      price,
      stock_quantity,
      minimum_stock
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    data.category_id ?? null,
    data.sku ?? null,
    data.name,
    data.description ?? null,
    data.cost,
    data.price,
    data.stock_quantity,
    data.minimum_stock
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getAllProducts(search = '') {
  const normalizedSearch = search.trim();

  const query = `
    SELECT
      p.*,
      pc.name AS category_name
    FROM products p
    LEFT JOIN product_categories pc ON pc.id = p.category_id
    WHERE (
      $1 = ''
      OR COALESCE(p.name, '') ILIKE '%' || $1 || '%'
      OR COALESCE(p.sku, '') ILIKE '%' || $1 || '%'
    )
    ORDER BY p.created_at DESC
  `;

  const result = await db.query(query, [normalizedSearch]);
  return result.rows;
}

export async function getProductById(id) {
  const query = `
    SELECT
      p.*,
      pc.name AS category_name
    FROM products p
    LEFT JOIN product_categories pc ON pc.id = p.category_id
    WHERE p.id = $1
    LIMIT 1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function updateProduct(id, data) {
  const query = `
    UPDATE products
    SET
      category_id = $2,
      sku = $3,
      name = $4,
      description = $5,
      cost = $6,
      price = $7,
      stock_quantity = $8,
      minimum_stock = $9,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    data.category_id ?? null,
    data.sku ?? null,
    data.name,
    data.description ?? null,
    data.cost,
    data.price,
    data.stock_quantity,
    data.minimum_stock
  ];

  const result = await db.query(query, values);
  return result.rows[0] ?? null;
}

export async function deactivateProduct(id) {
  const query = `
    UPDATE products
    SET
      is_active = FALSE,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] ?? null;
}