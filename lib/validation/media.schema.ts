import { z } from 'zod';

/**
 * Zod validation schemas for Media API routes
 * All validation messages are in Hebrew (RTL-first)
 */

// Focal point schema
export const focalPointSchema = z.object({
  x: z.number().min(0, 'נקודת מיקוד X חייבת להיות בין 0 ל-1').max(1, 'נקודת מיקוד X חייבת להיות בין 0 ל-1'),
  y: z.number().min(0, 'נקודת מיקוד Y חייבת להיות בין 0 ל-1').max(1, 'נקודת מיקוד Y חייבת להיות בין 0 ל-1'),
});

// Create signed upload URL schema
export const createSignedUploadSchema = z.object({
  fileName: z.string().min(1, 'שם הקובץ נדרש'),
  fileType: z
    .string()
    .min(1, 'סוג הקובץ נדרש')
    .refine(
      type => type.startsWith('image/') || type.startsWith('video/') || type === 'image/svg+xml',
      'סוג הקובץ חייב להיות תמונה או וידאו'
    ),
  fileSize: z.number().min(1, 'גודל הקובץ נדרש').max(50 * 1024 * 1024, 'גודל הקובץ לא יכול לעבור 50MB'),
});

// Finalize upload schema (after R2 upload completes)
export const finalizeUploadSchema = z.object({
  fileKey: z.string().min(1, 'מפתח הקובץ (R2 key) נדרש'),
  kind: z.enum(['IMAGE', 'VIDEO', 'SVG', 'AUDIO']),
  alt_he: z.string().max(200, 'תיאור חלופי לא יכול לעבור 200 תווים').optional(),
  focalPoint: focalPointSchema.optional(),
});

// Update media metadata schema
export const updateMediaSchema = z.object({
  id: z.string().min(1, 'מזהה המדיה נדרש'),
  alt_he: z.string().max(200, 'תיאור חלופי לא יכול לעבור 200 תווים').optional(),
  focalPoint: focalPointSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

// Query filters for listing media
export const listMediaQuerySchema = z.object({
  kind: z.enum(['IMAGE', 'VIDEO', 'SVG', 'AUDIO']).optional(),
  search: z.string().optional(),
  page: z.string().default('1').transform(val => parseInt(val)),
  limit: z.string().default('50').transform(val => parseInt(val)),
  sort: z.enum(['createdAt', 'updatedAt', 'fileKey']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Media ID parameter
export const mediaIdSchema = z.object({
  id: z.string().min(1, 'מזהה המדיה נדרש'),
});

// Delete media schema
export const deleteMediaSchema = z.object({
  id: z.string().min(1, 'מזהה המדיה נדרש'),
  force: z.boolean().default(false), // Force delete even if referenced
});

// Check media usage schema
export const checkMediaUsageSchema = z.object({
  id: z.string().min(1, 'מזהה המדיה נדרש'),
});

// Type exports
export type CreateSignedUploadInput = z.infer<typeof createSignedUploadSchema>;
export type FinalizeUploadInput = z.infer<typeof finalizeUploadSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
export type ListMediaQuery = z.infer<typeof listMediaQuerySchema>;
export type MediaId = z.infer<typeof mediaIdSchema>;
export type DeleteMediaInput = z.infer<typeof deleteMediaSchema>;
export type CheckMediaUsageInput = z.infer<typeof checkMediaUsageSchema>;
