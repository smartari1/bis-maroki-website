/**
 * Public Dishes API Route
 *
 * GET /api/public/dishes
 * Returns published dishes with filtering and pagination
 * Cached at edge (5 min SWR)
 * All responses in Hebrew (RTL-first)
 */

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Dish from '@/lib/db/models/Dish';
import { listDishesQuerySchema } from '@/lib/validation';
import { successResponse, handleApiError } from '@/lib/api/responses';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Enable SWR caching
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = listDishesQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return handleApiError(validation.error);
    }

    const {
      menuId,
      categoryId,
      status,
      availability,
      isVegan,
      isVegetarian,
      isGlutenFree,
      spiceLevel,
      search,
      page,
      limit,
      sort,
      order,
    } = validation.data;

    // Connect to database
    await connectDB();

    // Build query filter
    const filter: any = {
      status: 'PUBLISHED', // Only published dishes for public API
    };

    if (menuId) filter.menuIds = menuId;
    if (categoryId) filter.categoryIds = categoryId;
    if (availability) filter.availability = availability;
    if (isVegan !== undefined) filter.isVegan = isVegan;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian;
    if (isGlutenFree !== undefined) filter.isGlutenFree = isGlutenFree;
    if (spiceLevel !== undefined) filter.spiceLevel = spiceLevel;

    // Text search in title and description
    if (search) {
      filter.$or = [
        { title_he: { $regex: search, $options: 'i' } },
        { 'description_he.blocks.data.text': { $regex: search, $options: 'i' } },
      ];
    }

    // Count total matching documents
    const total = await Dish.countDocuments(filter);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const hasMore = skip + limit < total;

    // Build sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Query dishes
    const dishes = await Dish.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds')
      .lean();

    // Generate signed URLs for all media (1 hour expiry)
    const dishesWithSignedUrls = await Promise.all(
      dishes.map(async (dish: any) => {
        if (dish.mediaIds && dish.mediaIds.length > 0) {
          const mediaWithSignedUrls = await Promise.all(
            dish.mediaIds.map(async (media: any) => {
              try {
                const signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
                return {
                  ...media,
                  url: signedUrl,
                  thumbnailUrl: signedUrl,
                };
              } catch (error) {
                console.warn(`Failed to generate signed URL for ${media.fileKey}:`, error);
                return media; // Return original if signing fails
              }
            })
          );
          return {
            ...dish,
            mediaIds: mediaWithSignedUrls,
          };
        }
        return dish;
      })
    );

    return successResponse(
      dishesWithSignedUrls,
      {
        total,
        page,
        limit,
        hasMore,
      },
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}
