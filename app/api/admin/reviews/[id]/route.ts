import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';
import { reviewUpdateSchema } from '@/lib/validation/review.schema';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

type Params = Promise<{ id: string }>;

/**
 * Admin API: Get Single Review
 * GET /api/admin/reviews/[id]
 */
export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'מזהה המלצה לא תקין',
        },
        { status: 400 }
      );
    }

    const review = await Review.findById(id).lean();

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: 'המלצה לא נמצאה',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...review,
        _id: review._id.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'שגיאה בטעינת המלצה',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Admin API: Update Review
 * PUT/PATCH /api/admin/reviews/[id]
 */
export async function PUT(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'מזהה המלצה לא תקין',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = reviewUpdateSchema.parse(body);

    // Update review
    const review = await Review.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: 'המלצה לא נמצאה',
        },
        { status: 404 }
      );
    }

    // Revalidate home page
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'המלצה עודכנה בהצלחה',
      data: {
        ...review.toObject(),
        _id: review._id.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error updating review:', error);

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
        message: 'שגיאה בעדכון המלצה',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Support PATCH as well
export const PATCH = PUT;

/**
 * Admin API: Delete Review
 * DELETE /api/admin/reviews/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'מזהה המלצה לא תקין',
        },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: 'המלצה לא נמצאה',
        },
        { status: 404 }
      );
    }

    // Revalidate home page
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'המלצה נמחקה בהצלחה',
    });

  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'שגיאה במחיקת המלצה',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
