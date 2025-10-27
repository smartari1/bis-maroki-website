/**
 * Admin Categories Reorder API
 *
 * POST /api/admin/categories/reorder - Update order of multiple categories
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api/responses';
import { reorderCategoriesSchema } from '@/lib/validation/category.schema';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/admin/categories/reorder
 * Update the order of multiple categories in a single request
 * Useful for drag-and-drop reordering in the admin UI
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validation = reorderCategoriesSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { categories } = validation.data;

    // Update all categories in bulk
    const bulkOps = categories.map((cat) => ({
      updateOne: {
        filter: { _id: cat.id },
        update: { $set: { order: cat.order } },
      },
    }));

    await Category.bulkWrite(bulkOps);

    // Get updated categories
    const updatedCategories = await Category.find({
      _id: { $in: categories.map((c) => c.id) },
    })
      .sort({ order: 1 })
      .lean();

    // Trigger ISR revalidation for all category-related pages
    const pathsToRevalidate = [
      '/api/public/categories',
      '/api/public/dishes',
      '/menu',
      '/catering',
      '/events',
    ];

    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(updatedCategories);
  } catch (error) {
    return handleApiError(error);
  }
}
