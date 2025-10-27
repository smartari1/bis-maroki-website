import { z } from 'zod';

/**
 * Zod validation schemas for Admin Authentication
 * All validation messages are in Hebrew (RTL-first)
 */

// Admin login schema
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'סיסמה נדרשת'),
});

// Admin session verification schema
export const verifySessionSchema = z.object({
  token: z.string().min(1, 'טוקן הפעלה נדרש'),
});

// Type exports
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type VerifySessionInput = z.infer<typeof verifySessionSchema>;
