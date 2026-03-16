import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import {
  createProductCategorySchema,
  createProductSchema,
  updateProductSchema
} from './product.schema.js';
import {
  createProduct,
  createProductCategory,
  getAllProductCategories,
  getAllProducts,
  getProductById,
  updateProduct,
  deactivateProduct,
  getProductCategoryById
} from './product.repository.js';

export async function createProductCategoryHandler(req, res) {
  try {
    const payload = createProductCategorySchema.parse(req.body);
    const category = await createProductCategory(payload);

    return res.status(201).json({
      ok: true,
      data: category
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: error.flatten()
      });
    }

    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getAllProductCategoriesHandler(_req, res) {
  try {
    const categories = await getAllProductCategories();

    return res.status(200).json({
      ok: true,
      data: categories
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function createProductHandler(req, res) {
  try {
    const payload = createProductSchema.parse(req.body);

    if (payload.category_id) {
      const category = await getProductCategoryById(payload.category_id);

      if (!category) {
        return res.status(404).json({
          ok: false,
          message: 'Product category not found'
        });
      }
    }

    const product = await createProduct(payload);

    return res.status(201).json({
      ok: true,
      data: product
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: error.flatten()
      });
    }

    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getAllProductsHandler(req, res) {
  try {
    const search = req.query.search ?? '';
    const products = await getAllProducts(search);

    return res.status(200).json({
      ok: true,
      data: products
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getProductByIdHandler(req, res) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: product
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function updateProductHandler(req, res) {
  try {
    const payload = updateProductSchema.parse(req.body);

    if (payload.category_id) {
      const category = await getProductCategoryById(payload.category_id);

      if (!category) {
        return res.status(404).json({
          ok: false,
          message: 'Product category not found'
        });
      }
    }

    const product = await updateProduct(req.params.id, payload);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: product
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: 'Validation error',
        errors: error.flatten()
      });
    }

    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function deactivateProductHandler(req, res) {
  try {
    const product = await deactivateProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: product
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}