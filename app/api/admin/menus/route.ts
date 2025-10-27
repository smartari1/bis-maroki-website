/**
 * Admin Menus API - List and Create
 *
 * GET  /api/admin/menus - List all menus
 * POST /api/admin/menus - Create new menu
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api/responses';
import {
  createMenuSchema,
  listMenusQuerySchema,
} from '@/lib/validation/menu.schema';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models'; // Import all models to register them
import Menu from '@/lib/db/models/Menu';
import { slugify } from '@/lib/utils/slugify';

/**
 * GET /api/admin/menus
 * List all menus with filters
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

    const validation = listMenusQuerySchema.safeParse(queryObject);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { scope, search, page, limit, sort, order } = validation.data;

    // Build query
    const query: any = {};

    if (scope) query.scope = scope;

    // Search in title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [menus, total] = await Promise.all([
      Menu.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Menu.countDocuments(query),
    ]);

    return successResponse(menus, {
      total,
      page,
      limit,
      hasMore: skip + menus.length < total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/menus
 * Create new menu
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
    const validation = createMenuSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = slugify(data.title);
    }

    // Check if slug already exists
    const existingMenu = await Menu.findOne({ slug: data.slug });
    if (existingMenu) {
      return validationErrorResponse({
        name: 'ZodError',
        issues: [{
          path: ['slug'],
          message: 'מזהה ייחודי זה כבר קיים במערכת',
        }],
      } as any);
    }

    // Create menu
    const menu = await Menu.create(data);

    return successResponse(menu, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
