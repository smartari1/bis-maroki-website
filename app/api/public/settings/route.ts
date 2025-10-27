/**
 * Public Settings API Route
 *
 * GET /api/public/settings
 * Returns site settings (singleton)
 * Cached at edge (10 min SWR)
 * All responses in Hebrew (RTL-first)
 */

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Settings from '@/lib/db/models/Settings';
import { successResponse, handleApiError } from '@/lib/api/responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Enable SWR caching (longer for settings)
export const revalidate = 600; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get settings (singleton)
    let settings = await Settings.findOne().populate('brand.logoId').lean();

    // If no settings exist, return default values
    if (!settings) {
      settings = {
        brand: {
          name_he: 'ביס מרוקאי',
        },
        contact: {
          phone: '',
          whatsapp: '',
          email: '',
        },
        location: {
          address_he: '',
        },
        ui: {
          rtl: true,
        },
      } as any; // Type assertion for default values
    }

    return successResponse(settings, undefined, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
