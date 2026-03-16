import { z } from 'zod';

const serviceCategoryEnum = z.enum([
  'maintenance',
  'installation',
  'diagnostic',
  'network',
  'software',
  'infrastructure'
]);

export const createServiceSchema = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().max(2000).optional().nullable(),
  category: serviceCategoryEnum,
  base_price: z.number().min(0)
});

export const updateServiceSchema = createServiceSchema;