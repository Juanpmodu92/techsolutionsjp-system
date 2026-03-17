import { z } from 'zod';

export const createPaymentSchema = z
  .object({
    client_id: z.string().uuid(),
    sale_id: z.string().uuid().optional().nullable(),
    technical_service_id: z.string().uuid().optional().nullable(),
    payment_method: z.enum([
      'cash',
      'bank_transfer',
      'card',
      'nequi',
      'daviplata',
      'other'
    ]),
    amount: z.number().positive(),
    reference: z.string().trim().max(100).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable()
  })
  .superRefine((data, ctx) => {
    const hasSale = Boolean(data.sale_id);
    const hasTechnicalService = Boolean(data.technical_service_id);

    if ((hasSale && hasTechnicalService) || (!hasSale && !hasTechnicalService)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sale_id'],
        message:
          'A payment must be associated with exactly one target: sale or technical service'
      });
    }
  });