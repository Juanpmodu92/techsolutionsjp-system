import { z } from 'zod';

export const createClientSchema = z
  .object({
    client_type: z.enum(['person', 'company']),
    first_name: z.string().trim().min(1).max(100).optional(),
    last_name: z.string().trim().min(1).max(100).optional(),
    company_name: z.string().trim().min(1).max(150).optional(),
    document_number: z.string().trim().max(50).optional(),
    tax_id: z.string().trim().max(50).optional(),
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().email().max(150).optional(),
    address: z.string().trim().max(500).optional(),
    city: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(1000).optional()
  })
  .superRefine((data, ctx) => {
    if (data.client_type === 'person') {
      if (!data.first_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['first_name'],
          message: 'first_name is required for person clients'
        });
      }

      if (!data.last_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['last_name'],
          message: 'last_name is required for person clients'
        });
      }
    }

    if (data.client_type === 'company' && !data.company_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['company_name'],
        message: 'company_name is required for company clients'
      });
    }
  });

export const updateClientSchema = createClientSchema;