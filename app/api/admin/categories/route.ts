/**
 * Admin Categories API - List and Create
 *
 * GET  /api/admin/categories - List all categories
 * POST /api/admin/categories - Create new category
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api/responses';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
} from '@/lib/validation/category.schema';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import { slugify } from '@/lib/utils/slugify';

/**
 * GET /api/admin/categories
 * List all categories with filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryObject = Object.fromEntries(searchParams.entries());

    const validation = listCategoriesQuerySchema.safeParse(queryObject);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { sort, order } = validation.data;

    // Execute query
    const sortOrder = order === 'asc' ? 1 : -1;

    const categories = await Category.find({})
      .sort({ [sort]: sortOrder })
      .lean();

    return successResponse(categories, {
      total: categories.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/categories
 * Create new category
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = slugify(data.name_he);
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug: data.slug });
    if (existingCategory) {
      return validationErrorResponse({
        name: 'ZodError',
        issues: [{
          path: ['slug'],
          message: 'מזהה ייחודי זה כבר קיים במערכת',
        }],
      } as any);
    }

    // Create category
    const category = await Category.create(data);

    return successResponse(category, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
