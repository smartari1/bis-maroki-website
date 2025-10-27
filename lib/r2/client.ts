/**
 * Cloudflare R2 Client Configuration
 *
 * S3-compatible client for Cloudflare R2 storage
 * Used for all media asset storage and retrieval
 */

import { S3Client } from '@aws-sdk/client-s3';

let _r2Client: S3Client | null = null;

/**
 * Get or create R2 Client (lazy initialization)
 * Uses S3-compatible API with Cloudflare R2 endpoint
 */
export function getR2Client(): S3Client {
  if (_r2Client) {
    return _r2Client;
  }

  if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error('R2_ACCESS_KEY_ID is required');
  }

  if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2_SECRET_ACCESS_KEY is required');
  }

  if (!process.env.R2_ACCOUNT_ID) {
    throw new Error('R2_ACCOUNT_ID is required');
  }

  if (!process.env.R2_BUCKET) {
    throw new Error('R2_BUCKET is required');
  }

  _r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  return _r2Client;
}

/**
 * Legacy export for backwards compatibility
 */
export const r2Client = new Proxy({} as S3Client, {
  get(_, prop) {
    return (getR2Client() as any)[prop];
  },
});

/**
 * R2 Bucket Configuration (lazy)
 */
export function getR2Config() {
  if (!process.env.R2_BUCKET || !process.env.R2_ACCOUNT_ID) {
    throw new Error('R2_BUCKET and R2_ACCOUNT_ID are required');
  }

  return {
    bucket: process.env.R2_BUCKET,
    publicUrl: process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accountId: process.env.R2_ACCOUNT_ID,
  } as const;
}

/**
 * Legacy export for backwards compatibility
 */
export const R2_CONFIG = new Proxy({} as ReturnType<typeof getR2Config>, {
  get(_, prop) {
    return (getR2Config() as any)[prop];
  },
});

/**
 * Get public URL for an R2 object
 */
export function getPublicUrl(key: string): string {
  return `${R2_CONFIG.publicUrl}/${key}`;
}

/**
 * Generate R2 key from filename with optional prefix
 */
export function generateR2Key(filename: string, prefix?: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = prefix ? `${prefix}/${timestamp}-${sanitized}` : `${timestamp}-${sanitized}`;
  return key;
}
