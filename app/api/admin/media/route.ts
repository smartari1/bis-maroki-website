import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Media from '@/lib/db/models/Media';
import { listR2Images } from '@/lib/r2/list';
import { getPublicUrl } from '@/lib/r2/client';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

export const runtime = 'nodejs';

/**
 * GET /api/admin/media
 * List all media from database with optional bucket sync
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const syncBucket = searchParams.get('sync') === 'true';

    await connectDB();

    if (syncBucket) {
      // Sync with R2 bucket - find media in bucket not in database
      const r2Objects = await listR2Images();
      const dbMedia = await Media.find({}).lean();
      const dbKeys = new Set(dbMedia.map((m: any) => m.fileKey));

      // Find objects in R2 that aren't in database
      const missingInDb = r2Objects.filter(obj => !dbKeys.has(obj.key));

      // Create media documents for missing objects
      for (const obj of missingInDb) {
        try {
          await Media.create({
            kind: 'IMAGE',
            fileKey: obj.key,
            url: getPublicUrl(obj.key),
            alt_he: '',
            focalPoint: { x: 0.5, y: 0.5 },
          });
        } catch (error) {
          console.warn(`Failed to sync ${obj.key}:`, error);
        }
      }
    }

    // Fetch all media from database
    const media = await Media.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Generate signed URLs for viewing (1 hour expiry)
    const mediaWithSignedUrls = await Promise.all(
      media.map(async (m: any) => {
        try {
          const signedUrl = await generateSignedViewUrl(m.fileKey, 3600);
          return {
            _id: m._id.toString(),
            kind: m.kind,
            fileKey: m.fileKey,
            url: signedUrl, // Use signed URL for viewing
            width: m.width,
            height: m.height,
            alt_he: m.alt_he,
            thumbnailUrl: signedUrl, // Use same signed URL for thumbnail
            createdAt: m.createdAt,
          };
        } catch (error) {
          console.warn(`Failed to generate signed URL for ${m.fileKey}:`, error);
          return {
            _id: m._id.toString(),
            kind: m.kind,
            fileKey: m.fileKey,
            url: m.url, // Fallback to stored URL
            width: m.width,
            height: m.height,
            alt_he: m.alt_he,
            thumbnailUrl: m.thumbnailUrl,
            createdAt: m.createdAt,
          };
        }
      })
    );

    return NextResponse.json({
      media: mediaWithSignedUrls,
    });
  } catch (error: any) {
    console.error('Media list error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת המדיה' },
      { status: 500 }
    );
  }
}
