import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Settings from '@/lib/db/models/Settings';
import '@/lib/db/models';

/**
 * GET /api/admin/settings
 * Fetch the singleton settings document
 */
export async function GET() {
  try {
    await connectDB();

    // Get or create settings singleton
    const settings = await Settings.getSingleton();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'שגיאה בטעינת הגדרות',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT/PATCH /api/admin/settings
 * Update the singleton settings document
 */
export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Get existing settings or create new
    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings with provided data
      settings = await Settings.create(body);
    } else {
      // Update existing settings
      // Merge nested objects properly
      if (body.brand) {
        settings.brand = { ...settings.brand, ...body.brand };
      }
      if (body.contact) {
        settings.contact = {
          ...settings.contact,
          ...body.contact,
          socialLinks: body.contact.socialLinks
            ? { ...settings.contact?.socialLinks, ...body.contact.socialLinks }
            : settings.contact?.socialLinks,
        };
      }
      if (body.location) {
        settings.location = { ...settings.location, ...body.location };
      }
      if (body.hours) {
        settings.hours = { ...settings.hours, ...body.hours };
      }
      if (body.legal) {
        settings.legal = { ...settings.legal, ...body.legal };
      }
      if (body.ui) {
        settings.ui = { ...settings.ui, ...body.ui };
      }
      if (body.plateConfig) {
        settings.plateConfig = { ...settings.plateConfig, ...body.plateConfig };
      }
      if (body.catering) {
        settings.catering = { ...settings.catering, ...body.catering };
      }

      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'ההגדרות עודכנו בהצלחה',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'שגיאה בעדכון הגדרות',
      },
      { status: 500 }
    );
  }
}

// PATCH uses the same logic as PUT
export { PUT as PATCH };
