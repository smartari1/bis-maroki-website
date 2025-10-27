import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, getR2Config, generateR2Key, getPublicUrl } from '@/lib/r2/client';

export const runtime = 'nodejs';

/**
 * POST /api/admin/media/upload
 * Generate presigned upload URL for direct client upload to R2
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename) {
      return NextResponse.json(
        { error: 'שם הקובץ נדרש' },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = generateR2Key(filename, 'uploads');
    const r2Client = getR2Client();
    const config = getR2Config();

    // Create presigned URL for upload (15 minute expiry)
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 900, // 15 minutes
    });

    // Return presigned URL and file info
    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl: getPublicUrl(key),
    });
  } catch (error: any) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה ביצירת URL להעלאה' },
      { status: 500 }
    );
  }
}
