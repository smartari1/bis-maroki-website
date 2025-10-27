/**
 * Menu Validation Schemas (Zod)
 * Hebrew-localized validation for Menu model
 */

import { z } from 'zod';

/**
 * Menu Scope Enum
 */
export const menuScopeEnum = z.enum(['HOME', 'RESTAURANT', 'CATERING', 'EVENTS', 'CUSTOM']);

/**
 * Menu Item Kind Enum
 */
export const menuItemKindEnum = z.enum(['DISH', 'BUNDLE']);

/**
 * Menu Item Schema
 */
export const menuItemSchema = z.object({
  kind: menuItemKindEnum,
  refId: z.string({ message: 'מזהה הפניה נדרש' }).regex(/^[0-9a-fA-F]{24}$/, 'מזהה לא תקין'),
  label: z.string().trim().optional(),
  priceOverride: z.number().nonnegative('דריסת מחיר לא יכולה להיות שלילית').optional(),
});

/**
 * Create Menu Schema
 */
export const createMenuSchema = z.object({
  title: z.string({ message: 'כותרת התפריט נדרשת' }).trim().min(1, 'כותרת התפריט לא יכולה להיות ריקה'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'מזהה ייחודי יכול להכיל אותיות לטיניות קטנות, מספרים ומקפים בלבד')
    .optional(),
  scope: menuScopeEnum,
  items: z.array(menuItemSchema).default([]),
});

/**
 * Update Menu Schema
 */
export const updateMenuSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'מזהה לא תקין'),
  title: z.string().trim().min(1, 'כותרת התפריט לא יכולה להיות ריקה').optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'מזהה ייחודי יכול להכיל אותיות לטיניות קטנות, מספרים ומקפים בלבד')
    .optional(),
  scope: menuScopeEnum.optional(),
  items: z.array(menuItemSchema).optional(),
});

/**
 * List Menus Query Schema
 */
export const listMenusQuerySchema = z.object({
  scope: menuScopeEnum.optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['title', 'scope', 'createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type ListMenusQuery = z.infer<typeof listMenusQuerySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
