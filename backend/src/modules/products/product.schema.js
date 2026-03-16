import { z } from 'zod';

export const createProductCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000).optional().nullable()
});

export const createProductSchema = z.object({
  category_id: z.string().uuid().optional().nullable(),
  sku: z.string().trim().min(1).max(50).optional().nullable(),
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().max(2000).optional().nullable(),
  cost: z.number().min(0),
  price: z.number().min(0),
  stock_quantity: z.number().int().min(0),
  minimum_stock: z.number().int().min(0)
});

export const updateProductSchema = createProductSchema;