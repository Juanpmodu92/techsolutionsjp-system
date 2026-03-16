import { z } from 'zod';

export const createSoftwareProjectSchema = z.object({
  client_id: z.string().uuid(),
  quote_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1).max(150),
  project_type: z.enum([
    'landing_page',
    'corporate_website',
    'web_system',
    'ecommerce',
    'blog',
    'wordpress'
  ]),
  stack: z.enum(['html_css_js', 'react_node', 'wordpress', 'other']),
  description: z.string().trim().max(3000).optional().nullable(),
  scope: z.string().trim().max(3000).optional().nullable(),
  start_date: z.string().date().optional().nullable(),
  estimated_delivery_date: z.string().date().optional().nullable(),
  total_cost: z.number().min(0),
  notes: z.string().trim().max(2000).optional().nullable()
});

export const updateSoftwareProjectStatusSchema = z.object({
  status: z.enum([
    'quotation',
    'in_development',
    'testing',
    'delivered',
    'finished',
    'cancelled'
  ])
});