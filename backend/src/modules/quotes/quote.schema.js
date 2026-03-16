import { z } from 'zod';

export const quoteItemSchema = z.object({
  item_type: z.enum([
    'product',
    'service',
    'software_project',
    'hosting',
    'web_maintenance'
  ]),
  reference_id: z.string().uuid().optional().nullable(),
  description: z.string().trim().min(1).max(1000),
  quantity: z.number().positive(),
  unit_price: z.number().min(0),
  metadata: z.record(z.string(), z.any()).optional().nullable()
});

export const createQuoteSchema = z.object({
  client_id: z.string().uuid(),
  expiration_date: z.string().date().optional().nullable(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  notes: z.string().trim().max(2000).optional().nullable(),
  items: z.array(quoteItemSchema).min(1)
});

export const updateQuoteStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'expired'])
});