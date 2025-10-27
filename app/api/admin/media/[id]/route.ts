import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Media from '@/lib/db/models/Media';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, getR2Config } from '@/lib/r2/client';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

export const runtime = 'nodejs';

/**
 * GET /api/admin/media/[id]
 * Get single media by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const media = await Media.findById(id).lean();

    if (!media) {
      return NextResponse.json(
        { error: 'מדיה לא נמצאה' },
        { status: 404 }
      );
    }

    // Generate signed URL for viewing
    let signedUrl = media.url;
    try {
      signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
    } catch (error) {
      console.warn(`Failed to generate signed URL for ${media.fileKey}:`, error);
    }

    return NextResponse.json({
      media: {
        _id: media._id.toString(),
        kind: media.kind,
        fileKey: media.fileKey,
        url: signedUrl,
        width: media.width,
        height: media.height,
        alt_he: media.alt_he,
        thumbnailUrl: signedUrl,
        focalPoint: media.focalPoint,
        createdAt: media.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Media get error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת המדיה' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete media from database and R2
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Find media
    const media = await Media.findById(id);

    if (!media) {
      return NextResponse.json(
        { error: 'מדיה לא נמצאה' },
        { status: 404 }
      );
    }

    // Delete from R2
    try {
      const r2Client = getR2Client();
      const config = getR2Config();

      const command = new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: media.fileKey,
      });

      await r2Client.send(command);
    } catch (r2Error) {
      console.warn('R2 delete failed (file may not exist):', r2Error);
      // Continue to delete from database even if R2 delete fails
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'המדיה נמחקה בהצלחה',
    });
  } catch (error: any) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה במחיקת המדיה' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/media/[id]
 * Update media metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { alt_he, focalPoint } = body;

    await connectDB();

    const media = await Media.findById(id);

    if (!media) {
      return NextResponse.json(
        { error: 'מדיה לא נמצאה' },
        { status: 404 }
      );
    }

    // Update fields
    if (alt_he !== undefined) {
      media.alt_he = alt_he;
    }

    if (focalPoint) {
      media.focalPoint = focalPoint;
    }

    await media.save();

    return NextResponse.json({
      success: true,
      media: {
        _id: String(media._id),
        alt_he: media.alt_he,
        focalPoint: media.focalPoint,
      },
    });
  } catch (error: any) {
    console.error('Media update error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בעדכון המדיה' },
      { status: 500 }
    );
  }
}
