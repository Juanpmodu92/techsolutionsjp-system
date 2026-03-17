import { z } from 'zod';

export const createTechnicalServiceSchema = z.object({
  client_id: z.string().uuid(),
  assigned_user_id: z.string().uuid().optional().nullable(),
  related_product_id: z.string().uuid().optional().nullable(),
  service_type: z.enum([
    'maintenance',
    'diagnostic',
    'installation',
    'repair',
    'upgrade',
    'network'
  ]),
  device_type: z.string().trim().min(1).max(50),
  device_brand: z.string().trim().max(100).optional().nullable(),
  device_model: z.string().trim().max(100).optional().nullable(),
  serial_number: z.string().trim().max(100).optional().nullable(),
  problem_description: z.string().trim().min(1).max(3000),
  estimated_delivery_date: z.string().date().optional().nullable(),
  service_cost: z.number().min(0).default(0),
  notes: z.string().trim().max(2000).optional().nullable()
});

export const updateTechnicalServiceStatusSchema = z.object({
  status: z.enum([
    'received',
    'diagnosis',
    'in_progress',
    'waiting_parts',
    'completed',
    'delivered',
    'cancelled'
  ])
});