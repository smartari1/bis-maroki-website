/**
 * Public Categories API Route
 *
 * GET /api/public/categories
 * Returns all categories with optional filtering
 * Cached at edge (5 min SWR)
 * All responses in Hebrew (RTL-first)
 */

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import { listCategoriesQuerySchema } from '@/lib/validation';
import { successResponse, handleApiError } from '@/lib/api/responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Enable SWR caching
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = listCategoriesQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return handleApiError(validation.error);
    }

    const { typeScope, sort, order } = validation.data;

    // Connect to database
    await connectDB();

    // Build query filter
    const filter: any = {};
    if (typeScope) filter.typeScope = typeScope;

    // Build sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Query categories
    const categories = await Category.find(filter).sort(sortObj).lean();

    return successResponse(categories, { total: categories.length }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
