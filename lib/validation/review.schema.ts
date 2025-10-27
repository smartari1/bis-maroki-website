import { z } from 'zod';

/**
 * Review/Testimonial Validation Schema
 * Used for validating review data from admin forms
 */

export const reviewSchema = z.object({
  customerName: z
    .string()
    .min(2, 'שם הלקוח חייב להיות לפחות 2 תווים')
    .max(100, 'שם הלקוח לא יכול להיות יותר מ-100 תווים')
    .trim(),

  customerInitials: z
    .string()
    .max(3, 'ראשי תיבות לא יכולים להיות יותר מ-3 תווים')
    .trim()
    .optional(),

  rating: z
    .number()
    .int('הדירוג חייב להיות מספר שלם')
    .min(1, 'הדירוג המינימלי הוא 1')
    .max(5, 'הדירוג המקסימלי הוא 5'),

  testimonialText: z
    .string()
    .min(10, 'ההמלצה חייבת להיות לפחות 10 תווים')
    .max(500, 'ההמלצה לא יכולה להיות יותר מ-500 תווים')
    .trim(),

  isFeatured: z
    .boolean()
    .default(false),

  status: z
    .enum(['DRAFT', 'PUBLISHED'])
    .default('DRAFT'),

  order: z
    .number()
    .int('הסדר חייב להיות מספר שלם')
    .min(0, 'הסדר לא יכול להיות שלילי')
    .default(0),
});

// Type inference
export type ReviewInput = z.infer<typeof reviewSchema>;

// Partial schema for updates (all fields optional)
export const reviewUpdateSchema = reviewSchema.partial();

// Schema for creating reviews (same as base schema)
export const reviewCreateSchema = reviewSchema;

// Public review type (what we return to the frontend)
export type PublicReview = {
  _id: string;
  customerName: string;
  customerInitials?: string;
  rating: number;
  testimonialText: string;
  isFeatured: boolean;
  createdAt: string;
};
