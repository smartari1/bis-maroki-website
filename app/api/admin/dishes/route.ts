/**
 * Admin Dishes API - List and Create
 *
 * GET  /api/admin/dishes - List all dishes (including drafts)
 * POST /api/admin/dishes - Create new dish
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse
} from '@/lib/api/responses';
import {
  createDishSchema,
  listDishesQuerySchema
} from '@/lib/validation/dish.schema';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models'; // Import all models to register them
import Dish from '@/lib/db/models/Dish';
import { slugify } from '@/lib/utils/slugify';

/**
 * GET /api/admin/dishes
 * List all dishes with filters (admin view - includes drafts)
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

    const validation = listDishesQuerySchema.safeParse(queryObject);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
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

    // Build query
    const query: any = {};

    if (menuId) query.menuIds = menuId;
    if (categoryId) query.categoryIds = categoryId;
    if (status) query.status = status;
    if (availability) query.availability = availability;
    if (isVegan !== undefined) query.isVegan = isVegan;
    if (isVegetarian !== undefined) query.isVegetarian = isVegetarian;
    if (isGlutenFree !== undefined) query.isGlutenFree = isGlutenFree;
    if (spiceLevel !== undefined) query.spiceLevel = spiceLevel;

    // Search in title
    if (search) {
      query.title_he = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [dishes, total] = await Promise.all([
      Dish.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('categoryIds', 'name_he slug')
        .populate('menuIds', 'title slug')
        .populate('mediaIds', 'url thumbnailUrl alt_he')
        .lean(),
      Dish.countDocuments(query),
    ]);

    return successResponse(dishes, {
      total,
      page,
      limit,
      hasMore: skip + dishes.length < total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/dishes
 * Create new dish
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
    const validation = createDishSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = slugify(data.title_he);
    }

    // Check if slug already exists
    const existingDish = await Dish.findOne({ slug: data.slug });
    if (existingDish) {
      return validationErrorResponse({
        name: 'ZodError',
        issues: [{
          path: ['slug'],
          message: 'מזהה ייחודי זה כבר קיים במערכת',
        }],
      } as any);
    }

    // Create dish
    const dish = await Dish.create(data);

    // Populate references for response
    const populatedDish = await Dish.findById(dish._id)
      .populate('categoryIds', 'name_he slug')
      .populate('menuIds', 'title slug')
      .populate('mediaIds', 'url thumbnailUrl alt_he')
      .lean();

    return successResponse(populatedDish, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
