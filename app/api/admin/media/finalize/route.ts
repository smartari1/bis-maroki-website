import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Media from '@/lib/db/models/Media';
import { getImageDimensions } from '@/lib/r2/image-utils';

export const runtime = 'nodejs';

/**
 * POST /api/admin/media/finalize
 * Save media metadata to database after successful R2 upload
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, url, kind, alt_he } = body;

    if (!key || !url || !kind) {
      return NextResponse.json(
        { error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get image dimensions if it's an image
    let width, height;
    if (kind === 'IMAGE') {
      try {
        const dimensions = await getImageDimensions(key);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.warn('Failed to get dimensions, using defaults:', error);
        width = 800;
        height = 600;
      }
    }

    // Create media document
    const media = await Media.create({
      kind,
      fileKey: key,
      url,
      width,
      height,
      alt_he: alt_he || '',
      focalPoint: {
        x: 0.5,
        y: 0.5,
      },
    });

    return NextResponse.json({
      success: true,
      media: {
        _id: String(media._id),
        kind: media.kind,
        fileKey: media.fileKey,
        url: media.url,
        width: media.width,
        height: media.height,
        alt_he: media.alt_he,
      },
    });
  } catch (error: any) {
    console.error('Media finalize error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בשמירת המדיה' },
      { status: 500 }
    );
  }
}
