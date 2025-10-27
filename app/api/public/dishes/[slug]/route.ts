/**
 * Public Single Dish API Route
 *
 * GET /api/public/dishes/[slug]
 * Returns a single published dish by slug
 * Cached at edge (5 min SWR)
 * All responses in Hebrew (RTL-first)
 */

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Dish from '@/lib/db/models/Dish';
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/responses';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Enable SWR caching
export const revalidate = 300; // 5 minutes

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    const { slug } = await params;

    if (!slug) {
      return notFoundResponse('המנה');
    }

    // Connect to database
    await connectDB();

    // Query dish
    const dish = await Dish.findOne({
      slug,
      status: 'PUBLISHED', // Only published dishes
    })
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds')
      .populate('seoId')
      .lean();

    if (!dish) {
      return notFoundResponse('המנה');
    }

    // Generate signed URLs for media (1 hour expiry)
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
      dish.mediaIds = mediaWithSignedUrls;
    }

    return successResponse(dish, undefined, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
