import { ZodError } from 'zod';
import { handleDatabaseError } from '../../shared/utils/db-error.js';
import { createInventoryMovementSchema } from './inventory.schema.js';
import {
  createInventoryMovement,
  getInventoryMovements
} from './inventory.repository.js';

export async function createInventoryMovementHandler(req, res) {
  try {
    const payload = createInventoryMovementSchema.parse(req.body);

    const result = await createInventoryMovement({
      productId: payload.product_id,
      movementType: payload.movement_type,
      quantity: payload.quantity,
      reason: payload.reason ?? null,
      createdByUserId: req.user.id
    });

    if (result?.error === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      });
    }

    if (result?.error === 'PRODUCT_INACTIVE') {
      return res.status(400).json({
        ok: false,
        message: 'Cannot move inventory for an inactive product'
      });
    }

    if (result?.error === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({
        ok: false,
        message: 'Insufficient stock for this movement'
      });
    }

    return res.status(201).json({
      ok: true,
      data: result
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

export async function getInventoryMovementsHandler(req, res) {
  try {
    const productId = req.query.product_id ?? '';
    const movements = await getInventoryMovements(productId);

    return res.status(200).json({
      ok: true,
      data: movements
    });
  } catch (error) {
    const dbError = handleDatabaseError(error);

    return res.status(dbError.status).json({
      ok: false,
      message: dbError.message
    });
  }
}