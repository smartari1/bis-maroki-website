/**
 * Admin Single Category API - Get, Update, Delete
 *
 * GET    /api/admin/categories/[id] - Get single category
 * PUT    /api/admin/categories/[id] - Update category
 * DELETE /api/admin/categories/[id] - Delete category
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
  notFoundResponse,
  errorResponse,
} from '@/lib/api/responses';
import { updateCategorySchema } from '@/lib/validation/category.schema';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import Dish from '@/lib/db/models/Dish';
import { slugify } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';
import { getCategoryRevalidationPaths } from '@/lib/revalidation/paths';

interface RouteParams {
  params: Promise<{
    id?: string;
    slug?: string;
  }>;
}

/**
 * GET /api/admin/categories/[id]
 * Get single category by ID
 */
export async function GET(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    const category = await Category.findById(params.id).lean();

    if (!category) {
      return notFoundResponse('הקטגוריה');
    }

    // Get dish count for this category
    const dishCount = await Dish.countDocuments({ categoryId: params.id });

    return successResponse({
      ...category,
      dishCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/categories/[id]
 * Update category
 */
export async function PUT(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Check if category exists
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return notFoundResponse('הקטגוריה');
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateCategorySchema.safeParse({ ...body, id: params.id });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { id, ...updateData } = validation.data;

    // If name changed and no custom slug provided, regenerate slug
    if (updateData.name_he && !updateData.slug) {
      updateData.slug = slugify(updateData.name_he);
    }

    // If slug changed, check uniqueness
    if (updateData.slug && updateData.slug !== existingCategory.slug) {
      const duplicateSlug = await Category.findOne({
        slug: updateData.slug,
        _id: { $ne: params.id },
      });

      if (duplicateSlug) {
        return validationErrorResponse({
          name: 'ZodError',
          issues: [{
            path: ['slug'],
            message: 'מזהה ייחודי זה כבר קיים במערכת',
          }],
        } as any);
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    // Trigger ISR revalidation
    const paths = getCategoryRevalidationPaths(updatedCategory);
    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(updatedCategory);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete category (only if no dishes are using it)
 */
export async function DELETE(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Check if category exists
    const category = await Category.findById(params.id);
    if (!category) {
      return notFoundResponse('הקטגוריה');
    }

    // Check if any dishes are using this category
    const dishCount = await Dish.countDocuments({ categoryId: params.id });
    if (dishCount > 0) {
      return errorResponse(
        'לא ניתן למחוק',
        `לא ניתן למחוק קטגוריה עם ${dishCount} מנות. יש להעביר את המנות לקטגוריה אחרת תחילה.`,
        400
      );
    }

    // Delete category
    await Category.findByIdAndDelete(params.id);

    // Trigger ISR revalidation
    const paths = getCategoryRevalidationPaths(category);
    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(
      { id: params.id, deleted: true },
      undefined,
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}
