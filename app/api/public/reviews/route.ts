import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';

/**
 * Public API: Get Published Reviews
 * GET /api/public/reviews
 *
 * Returns all published reviews, optionally filtered by isFeatured
 * Used by the home page SocialProof component
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const isFeatured = searchParams.get('isFeatured');

    // Build query
    const query: any = { status: 'PUBLISHED' };

    // Filter by featured status if provided
    if (isFeatured !== null) {
      query.isFeatured = isFeatured === 'true';
    }

    // Fetch reviews
    const reviews = await Review.find(query)
      .sort({ order: 1, createdAt: -1 }) // Sort by order (ascending), then newest first
      .select('customerName customerInitials rating testimonialText isFeatured createdAt')
      .lean();

    // Return reviews
    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews.map(review => ({
        ...review,
        _id: review._id.toString(),
      })),
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache
      },
    });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'שגיאה בטעינת ההמלצות',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
