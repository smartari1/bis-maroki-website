import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';
import { reviewCreateSchema } from '@/lib/validation/review.schema';
import { revalidatePath } from 'next/cache';

/**
 * Admin API: Get All Reviews (including drafts)
 * GET /api/admin/reviews
 */
export async function GET() {
  try {
    await connectDB();

    const reviews = await Review.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews.map(review => ({
        ...review,
        _id: review._id.toString(),
      })),
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

/**
 * Admin API: Create New Review
 * POST /api/admin/reviews
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validatedData = reviewCreateSchema.parse(body);

    // Create review
    const review = await Review.create(validatedData);

    // Revalidate home page (SocialProof section)
    revalidatePath('/');

    return NextResponse.json(
      {
        success: true,
        message: 'המלצה נוצרה בהצלחה',
        data: {
          ...review.toObject(),
          _id: review._id.toString(),
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating review:', error);

    // Zod validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'שגיאת אימות',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'שגיאת אימות',
          errors: Object.values(error.errors).map((e: any) => e.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'שגיאה ביצירת המלצה',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
