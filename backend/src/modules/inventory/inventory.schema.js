import { z } from 'zod';

export const createInventoryMovementSchema = z.object({
  product_id: z.string().uuid(),
  movement_type: z.enum(['entry', 'exit', 'adjustment']),
  quantity: z.number().int().positive(),
  reason: z.string().trim().max(1000).optional().nullable()
});