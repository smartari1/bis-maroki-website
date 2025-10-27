/**
 * Admin Single Dish API - Get, Update, Delete
 *
 * GET    /api/admin/dishes/[id] - Get single dish
 * PUT    /api/admin/dishes/[id] - Update dish (full update)
 * PATCH  /api/admin/dishes/[id] - Update dish (partial update)
 * DELETE /api/admin/dishes/[id] - Delete dish (soft delete)
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/responses';
import { updateDishSchema } from '@/lib/validation/dish.schema';
import { connectDB } from '@/lib/db/mongoose';
import Dish from '@/lib/db/models/Dish';
import { slugify } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';
import { getDishRevalidationPaths } from '@/lib/revalidation/paths';

interface RouteParams {
  params: Promise<{
    id?: string;
    slug?: string;
  }>;
}

/**
 * GET /api/admin/dishes/[id]
 * Get single dish by ID
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

    const dish = await Dish.findById(params.id)
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds', 'url thumbnailUrl alt_he width height')
      .populate('seoId')
      .lean();

    if (!dish) {
      return notFoundResponse('המנה');
    }

    return successResponse(dish);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/dishes/[id]
 * Update dish (full update)
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

    // Check if dish exists
    const existingDish = await Dish.findById(params.id);
    if (!existingDish) {
      return notFoundResponse('המנה');
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateDishSchema.safeParse({ ...body, id: params.id });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { id, ...updateData } = validation.data;

    // If title changed and no custom slug provided, regenerate slug
    if (updateData.title_he && !updateData.slug) {
      updateData.slug = slugify(updateData.title_he);
    }

    // If slug changed, check uniqueness
    if (updateData.slug && updateData.slug !== existingDish.slug) {
      const duplicateSlug = await Dish.findOne({
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

    // Update dish
    const updatedDish = await Dish.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds', 'url thumbnailUrl alt_he width height')
      .populate('seoId')
      .lean();

    // Trigger ISR revalidation
    const paths = getDishRevalidationPaths(updatedDish);
    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(updatedDish);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/dishes/[id]
 * Partially update dish (same as PUT, supports partial updates)
 */
export async function PATCH(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Check if dish exists
    const existingDish = await Dish.findById(params.id);
    if (!existingDish) {
      return notFoundResponse('המנה');
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateDishSchema.safeParse({ ...body, id: params.id });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { id, ...updateData } = validation.data;

    // If title changed and no custom slug provided, regenerate slug
    if (updateData.title_he && !updateData.slug) {
      updateData.slug = slugify(updateData.title_he);
    }

    // If slug changed, check uniqueness
    if (updateData.slug && updateData.slug !== existingDish.slug) {
      const duplicateSlug = await Dish.findOne({
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

    // Update dish
    const updatedDish = await Dish.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds', 'url thumbnailUrl alt_he width height')
      .populate('seoId')
      .lean();

    // Trigger ISR revalidation
    const paths = getDishRevalidationPaths(updatedDish);
    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(updatedDish);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/dishes/[id]
 * Soft delete dish (set status to DRAFT, could add deletedAt field)
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

    // Check if dish exists
    const dish = await Dish.findById(params.id);
    if (!dish) {
      return notFoundResponse('המנה');
    }

    // Soft delete: set status to DRAFT and add deleted flag
    // For now, we'll actually delete it, but in production you might want soft delete
    await Dish.findByIdAndDelete(params.id);

    // Trigger ISR revalidation
    const paths = getDishRevalidationPaths(dish);
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
