import { z } from 'zod';

/**
 * Zod validation schemas for Dish API routes
 * All validation messages are in Hebrew (RTL-first)
 */

// Rich text block schema
export const richTextBlockSchema = z.object({
  type: z.string(),
  data: z.record(z.string(), z.any()),
});

export const richTextSchema = z.object({
  blocks: z.array(richTextBlockSchema),
});

// Nutrition schema
export const nutritionSchema = z.object({
  calories: z.number().min(0, 'קלוריות לא יכולות להיות שליליות').optional(),
  protein: z.number().min(0, 'חלבון לא יכול להיות שלילי').optional(),
  carbs: z.number().min(0, 'פחמימות לא יכולות להיות שליליות').optional(),
  fat: z.number().min(0, 'שומן לא יכול להיות שלילי').optional(),
  fiber: z.number().min(0, 'סיבים תזונתיים לא יכולים להיות שליליים').optional(),
});

// Dish options schema
export const dishOptionsSchema = z.object({
  allowCustomization: z.boolean().optional(),
  addons: z
    .array(
      z.object({
        name_he: z.string().min(1, 'שם התוספת בעברית נדרש'),
        price: z.number().min(0, 'מחיר התוספת לא יכול להיות שלילי'),
      })
    )
    .optional(),
  veganOption: z.boolean().optional(),
  servings: z.number().int().min(1, 'מספר מנות חייב להיות לפחות 1').optional(),
  minimumOrder: z.number().int().min(1, 'הזמנה מינימלית חייבת להיות לפחות 1').optional(),
});

// Create Dish schema
export const createDishSchema = z.object({
  title_he: z.string().min(1, 'כותרת המנה בעברית נדרשת').max(100, 'כותרת המנה לא יכולה לעבור 100 תווים'),
  slug: z
    .string()
    .min(1, 'מזהה ייחודי (slug) נדרש')
    .max(100, 'מזהה ייחודי לא יכול לעבור 100 תווים')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'מזהה ייחודי חייב להכיל רק אותיות אנגליות קטנות, מספרים ומקפים')
    .optional(), // Auto-generated if not provided
  menuIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).min(1, 'לפחות קטגוריה אחת נדרשת').default([]),
  description_he: richTextSchema.optional(),
  price: z.number().min(0, 'מחיר לא יכול להיות שלילי'),
  currency: z.string().length(3, 'קוד מטבע חייב להיות בן 3 תווים').default('ILS'),
  spiceLevel: z.number().int().min(0, 'רמת חריפות מינימלית היא 0').max(3, 'רמת חריפות מקסימלית היא 3').default(0),
  isVegan: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  allergens: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
  badges: z.array(z.string()).default([]),
  availability: z
    .enum(['AVAILABLE', 'OUT_OF_STOCK', 'SEASONAL'])
    .default('AVAILABLE'),
  nutrition: nutritionSchema.optional(),
  options: dishOptionsSchema.optional(),
  seoId: z.string().optional(),
  status: z
    .enum(['DRAFT', 'PUBLISHED', 'SCHEDULED'])
    .default('DRAFT'),
  publishAt: z.string().datetime('תאריך פרסום חייב להיות בפורמט ISO 8601').optional(),
});

// Update Dish schema (all fields optional except ID)
export const updateDishSchema = createDishSchema.partial().extend({
  id: z.string().min(1, 'מזהה המנה נדרש'),
});

// Query filters for listing dishes
export const listDishesQuerySchema = z.object({
  menuId: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  availability: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'SEASONAL']).optional(),
  isVegan: z.string().optional().transform(val => val === 'true'),
  isVegetarian: z.string().optional().transform(val => val === 'true'),
  isGlutenFree: z.string().optional().transform(val => val === 'true'),
  spiceLevel: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  search: z.string().optional(), // Search in title and description
  page: z.string().default('1').transform(val => parseInt(val)),
  limit: z.string().default('20').transform(val => parseInt(val)),
  sort: z.enum(['createdAt', 'updatedAt', 'price', 'title_he']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Dish slug parameter
export const dishSlugSchema = z.object({
  slug: z.string().min(1, 'מזהה ייחודי (slug) נדרש'),
});

// Dish ID parameter
export const dishIdSchema = z.object({
  id: z.string().min(1, 'מזהה המנה נדרש'),
});

// Publish dish schema
export const publishDishSchema = z.object({
  id: z.string().min(1, 'מזהה המנה נדרש'),
  publishAt: z.string().datetime('תאריך פרסום חייב להיות בפורמט ISO 8601').optional(),
});

// Type exports
export type CreateDishInput = z.infer<typeof createDishSchema>;
export type UpdateDishInput = z.infer<typeof updateDishSchema>;
export type ListDishesQuery = z.infer<typeof listDishesQuerySchema>;
export type DishSlug = z.infer<typeof dishSlugSchema>;
export type DishId = z.infer<typeof dishIdSchema>;
export type PublishDishInput = z.infer<typeof publishDishSchema>;
