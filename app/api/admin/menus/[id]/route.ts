/**
 * Admin Single Menu API - Get, Update, Delete
 *
 * GET    /api/admin/menus/[id] - Get single menu
 * PUT    /api/admin/menus/[id] - Update menu (alias for PATCH)
 * PATCH  /api/admin/menus/[id] - Update menu
 * DELETE /api/admin/menus/[id] - Delete menu
 */

import { NextRequest } from 'next/server';
import { requireAuth, getAuthErrorResponse } from '@/lib/auth/middleware';
import {
  successResponse,
  handleApiError,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/responses';
import { updateMenuSchema } from '@/lib/validation/menu.schema';
import { connectDB } from '@/lib/db/mongoose';
import Menu from '@/lib/db/models/Menu';
import { slugify } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/menus/[id]
 * Get single menu by ID
 */
export async function GET(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    const { id } = await params;

    const menu = await Menu.findById(id).lean();

    if (!menu) {
      return notFoundResponse('התפריט');
    }

    return successResponse(menu);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/menus/[id]
 * Update menu
 */
export async function PUT(request: NextRequest, segmentData: RouteParams) {
  return PATCH(request, segmentData);
}

/**
 * PATCH /api/admin/menus/[id]
 * Update menu
 */
export async function PATCH(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    const { id } = await params;

    // Check if menu exists
    const existingMenu = await Menu.findById(id);
    if (!existingMenu) {
      return notFoundResponse('התפריט');
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateMenuSchema.safeParse({ ...body, id });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { id: _id, ...updateData } = validation.data;

    // If title changed and no custom slug provided, regenerate slug
    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    }

    // If slug changed, check uniqueness
    if (updateData.slug && updateData.slug !== existingMenu.slug) {
      const duplicateSlug = await Menu.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });

      if (duplicateSlug) {
        return validationErrorResponse({
          name: 'ZodError',
          issues: [{
            path: ['slug'],
            message: 'מזהה ייחודי זה כבר קיים במערכת',
          }],
        } as any);
      }
    }

    // Update menu
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    // Trigger ISR revalidation for menu-related pages
    try {
      revalidatePath(`/menu`);
      revalidatePath(`/restaurant`);
      revalidatePath(`/catering`);
      revalidatePath(`/events`);
    } catch (revalidateError) {
      console.error('Failed to revalidate paths:', revalidateError);
    }

    return successResponse(updatedMenu);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/menus/[id]
 * Delete menu
 */
export async function DELETE(request: NextRequest, segmentData: RouteParams) {
  const params = await segmentData.params;
  try {
    // Verify authentication
    const session = requireAuth(request);
    if (!session) {
      return getAuthErrorResponse();
    }

    await connectDB();

    const { id } = await params;

    // Check if menu exists
    const menu = await Menu.findById(id);
    if (!menu) {
      return notFoundResponse('התפריט');
    }

    // Delete menu
    await Menu.findByIdAndDelete(id);

    // Trigger ISR revalidation for menu-related pages
    try {
      revalidatePath(`/menu`);
      revalidatePath(`/restaurant`);
      revalidatePath(`/catering`);
      revalidatePath(`/events`);
    } catch (revalidateError) {
      console.error('Failed to revalidate paths:', revalidateError);
    }

    return successResponse(
      { id, deleted: true },
      undefined,
      200
    );
  } catch (error) {
    return handleApiError(error);
  }
}
