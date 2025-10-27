/**
 * Admin Dish Publish API
 *
 * POST /api/admin/dishes/[id]/publish - Publish dish
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  notFoundResponse,
  errorResponse,
} from '@/lib/api/responses';
import { connectDB } from '@/lib/db/mongoose';
import Dish from '@/lib/db/models/Dish';
import { revalidatePath } from 'next/cache';
import { getDishRevalidationPaths } from '@/lib/revalidation/paths';

interface RouteParams {
  params: Promise<{
    id?: string;
    slug?: string;
  }>;
}

/**
 * POST /api/admin/dishes/[id]/publish
 * Publish dish (set status to PUBLISHED and publishAt to now)
 */
export async function POST(request: NextRequest, segmentData: RouteParams) {
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

    // Check if dish is already published
    if (dish.status === 'PUBLISHED') {
      return errorResponse(
        'כבר פורסם',
        'המנה כבר פורסמה',
        400
      );
    }

    // Validate that dish has required fields for publishing
    if (!dish.title_he || !dish.categoryId || dish.price === undefined) {
      return errorResponse(
        'שדות חסרים',
        'לא ניתן לפרסם מנה ללא כותרת, קטגוריה ומחיר',
        400
      );
    }

    // Update status to PUBLISHED
    const publishedDish = await Dish.findByIdAndUpdate(
      params.id,
      {
        $set: {
          status: 'PUBLISHED',
          publishAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name_he slug typeScope')
      .populate('mediaIds', 'url thumbnailUrl alt_he width height')
      .populate('seoId')
      .lean();

    // Trigger ISR revalidation
    const paths = getDishRevalidationPaths(publishedDish);
    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (revalidateError) {
        console.error(`Failed to revalidate path ${path}:`, revalidateError);
      }
    }

    return successResponse(publishedDish, undefined, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
