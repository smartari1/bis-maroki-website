import { z } from 'zod';

/**
 * Zod validation schemas for Category API routes
 * All validation messages are in Hebrew (RTL-first)
 */

// Create Category schema
export const createCategorySchema = z.object({
  name_he: z.string().min(1, 'שם הקטגוריה בעברית נדרש').max(50, 'שם הקטגוריה לא יכול לעבור 50 תווים'),
  slug: z
    .string()
    .min(1, 'מזהה ייחודי (slug) נדרש')
    .max(50, 'מזהה ייחודי לא יכול לעבור 50 תווים')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'מזהה ייחודי חייב להכיל רק אותיות אנגליות קטנות, מספרים ומקפים')
    .optional(), // Auto-generated if not provided
  order: z.number().int().min(0, 'סדר הקטגוריה לא יכול להיות שלילי').default(0),
});

// Update Category schema
export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'מזהה הקטגוריה נדרש'),
});

// Query filters for listing categories
export const listCategoriesQuerySchema = z.object({
  sort: z.enum(['order', 'name_he', 'createdAt']).default('order'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// Category slug parameter
export const categorySlugSchema = z.object({
  slug: z.string().min(1, 'מזהה ייחודי (slug) נדרש'),
});

// Category ID parameter
export const categoryIdSchema = z.object({
  id: z.string().min(1, 'מזהה הקטגוריה נדרש'),
});

// Reorder categories schema
export const reorderCategoriesSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().min(1, 'מזהה הקטגוריה נדרש'),
      order: z.number().int().min(0, 'סדר הקטגוריה לא יכול להיות שלילי'),
    })
  ),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
export type CategorySlug = z.infer<typeof categorySlugSchema>;
export type CategoryId = z.infer<typeof categoryIdSchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
