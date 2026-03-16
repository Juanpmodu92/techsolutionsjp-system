import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { createSaleSchema } from './sale.schema.js';
import { calculateSaleTotals } from './sale.utils.js';
import {
  createSaleWithItems,
  getActiveProductByIdForSale,
  getActiveServiceByIdForSale,
  getAllSales,
  getClientByIdForSale,
  getSaleById
} from './sale.repository.js';

export async function createSaleHandler(req, res) {
  try {
    const payload = createSaleSchema.parse(req.body);

    const client = await getClientByIdForSale(payload.client_id);

    if (!client) {
      return res.status(404).json({
        ok: false,
        message: 'Client not found'
      });
    }

    if (!client.is_active) {
      return res.status(400).json({
        ok: false,
        message: 'Cannot create sale for an inactive client'
      });
    }

    for (const item of payload.items) {
      if (item.item_type === 'product') {
        const product = await getActiveProductByIdForSale(item.reference_id);

        if (!product) {
          return res.status(404).json({
            ok: false,
            message: `Referenced product not found: ${item.reference_id}`
          });
        }

        if (!product.is_active) {
          return res.status(400).json({
            ok: false,
            message: `Referenced product is inactive: ${item.reference_id}`
          });
        }
      }

      if (item.item_type === 'service') {
        const service = await getActiveServiceByIdForSale(item.reference_id);

        if (!service) {
          return res.status(404).json({
            ok: false,
            message: `Referenced service not found: ${item.reference_id}`
          });
        }

        if (!service.is_active) {
          return res.status(400).json({
            ok: false,
            message: `Referenced service is inactive: ${item.reference_id}`
          });
        }
      }
    }

    const totals = calculateSaleTotals(
      payload.items,
      payload.discount,
      payload.tax
    );

    const sale = await createSaleWithItems({
      client_id: payload.client_id,
      user_id: req.user.id,
      quote_id: payload.quote_id ?? null,
      notes: payload.notes ?? null,
      ...totals
    });

    if (sale?.error === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({
        ok: false,
        message: `Referenced product not found: ${sale.referenceId}`
      });
    }

    if (sale?.error === 'PRODUCT_INACTIVE') {
      return res.status(400).json({
        ok: false,
        message: `Referenced product is inactive: ${sale.referenceId}`
      });
    }

    if (sale?.error === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({
        ok: false,
        message: `Insufficient stock for product ${sale.productName}`
      });
    }

    return res.status(201).json({
      ok: true,
      data: sale
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

export async function getAllSalesHandler(_req, res) {
  try {
    const sales = await getAllSales();

    return res.status(200).json({
      ok: true,
      data: sales
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}

export async function getSaleByIdHandler(req, res) {
  try {
    const sale = await getSaleById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        ok: false,
        message: 'Sale not found'
      });
    }

    return res.status(200).json({
      ok: true,
      data: sale
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}