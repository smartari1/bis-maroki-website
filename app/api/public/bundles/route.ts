import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Bundle from '@/lib/db/models/Bundle';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

/**
 * GET /api/public/bundles
 * Fetch all published catering bundles
 * Query params:
 * - limit: number of bundles to return (default: all)
 * - featured: boolean to filter featured bundles
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured') === 'true';

    // Build query
    const query: any = {
      status: 'PUBLISHED',
    };

    // Optional: Add featured filter if we have a featured badge system
    // For now, we'll return all published bundles

    // Fetch bundles
    let bundlesQuery = Bundle.find(query)
      .populate('mediaIds', 'url thumbnailUrl alt_he fileKey')
      .populate('allowedDishIds', 'title_he slug price mediaIds')
      .sort({ createdAt: -1 });

    if (limit) {
      bundlesQuery = bundlesQuery.limit(parseInt(limit));
    }

    const bundles = await bundlesQuery.lean();

    // Generate signed URLs for all media (1 hour expiry)
    const bundlesWithSignedUrls = await Promise.all(
      bundles.map(async (bundle: any) => {
        // Sign bundle media
        if (bundle.mediaIds && bundle.mediaIds.length > 0) {
          const mediaWithSignedUrls = await Promise.all(
            bundle.mediaIds.map(async (media: any) => {
              try {
                const signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
                return {
                  ...media,
                  url: signedUrl,
                  thumbnailUrl: signedUrl,
                };
              } catch (error) {
                console.warn(`Failed to generate signed URL for ${media.fileKey}:`, error);
                return media;
              }
            })
          );
          bundle.mediaIds = mediaWithSignedUrls;
        }

        // Sign dish media (if populated)
        if (bundle.allowedDishIds && bundle.allowedDishIds.length > 0) {
          bundle.allowedDishIds = await Promise.all(
            bundle.allowedDishIds.map(async (dish: any) => {
              if (dish.mediaIds && dish.mediaIds.length > 0) {
                const dishMediaWithSignedUrls = await Promise.all(
                  dish.mediaIds.map(async (media: any) => {
                    try {
                      const signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
                      return {
                        ...media,
                        url: signedUrl,
                        thumbnailUrl: signedUrl,
                      };
                    } catch (error) {
                      return media;
                    }
                  })
                );
                return {
                  ...dish,
                  mediaIds: dishMediaWithSignedUrls,
                };
              }
              return dish;
            })
          );
        }

        return bundle;
      })
    );

    // Transform data for response
    const formattedBundles = bundlesWithSignedUrls.map((bundle: any) => ({
      _id: bundle._id.toString(),
      title_he: bundle.title_he,
      slug: bundle.slug,
      description_he: bundle.description_he,
      basePricePerPerson: bundle.basePricePerPerson,
      minPersons: bundle.minPersons,
      maxPersons: bundle.maxPersons,
      includes: bundle.includes,
      allowedDishIds: bundle.allowedDishIds?.map((dish: any) => ({
        _id: dish._id.toString(),
        title_he: dish.title_he,
        slug: dish.slug,
        price: dish.price,
        mediaIds: dish.mediaIds?.map((m: any) => ({
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
          alt_he: m.alt_he,
        })) || [],
      })) || [],
      mediaIds: bundle.mediaIds?.map((m: any) => ({
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        alt_he: m.alt_he,
      })) || [],
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedBundles,
        count: formattedBundles.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בטעינת מגשי האירוח',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
