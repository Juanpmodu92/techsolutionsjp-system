import { z } from 'zod';

const userRoleSchema = z.enum(['admin', 'seller', 'technician', 'developer']);

export const createUserSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(150),
  password: z.string().min(6).max(100),
  role: userRoleSchema
});

export const updateUserSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(150),
  role: userRoleSchema
});