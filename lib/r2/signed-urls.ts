/**
 * R2 Signed URLs for Viewing Media
 *
 * Generate temporary signed URLs for viewing private R2 objects
 */

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, getR2Config } from './client';

/**
 * Generate signed URL for viewing an R2 object
 * Default expiry: 1 hour
 */
export async function generateSignedViewUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const r2Client = getR2Client();
  const config = getR2Config();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(r2Client, command, {
    expiresIn,
  });

  return signedUrl;
}

/**
 * Generate signed URLs for multiple keys
 */
export async function generateSignedViewUrls(
  keys: string[],
  expiresIn: number = 3600
): Promise<Record<string, string>> {
  const urls: Record<string, string> = {};

  await Promise.all(
    keys.map(async (key) => {
      try {
        urls[key] = await generateSignedViewUrl(key, expiresIn);
      } catch (error) {
        console.error(`Failed to generate signed URL for ${key}:`, error);
        urls[key] = '';
      }
    })
  );

  return urls;
}
