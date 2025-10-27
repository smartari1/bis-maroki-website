/**
 * R2 List Operations
 *
 * Utilities for listing and discovering objects in R2 bucket
 */

import { ListObjectsV2Command, type ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import { getR2Client, getR2Config } from './client';

export interface R2Object {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

/**
 * List all objects in R2 bucket with optional prefix filter
 */
export async function listR2Objects(prefix?: string): Promise<R2Object[]> {
  const r2Client = getR2Client();
  const config = getR2Config();
  const objects: R2Object[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });

    const response: ListObjectsV2CommandOutput = await r2Client.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Size && obj.LastModified) {
          objects.push({
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
            etag: obj.ETag || '',
          });
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

/**
 * List images from R2 bucket (filters by image extensions)
 */
export async function listR2Images(prefix?: string): Promise<R2Object[]> {
  const allObjects = await listR2Objects(prefix);

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'];

  return allObjects.filter(obj => {
    const lowerKey = obj.key.toLowerCase();
    return imageExtensions.some(ext => lowerKey.endsWith(ext));
  });
}

/**
 * Get object metadata from R2
 */
export async function getR2ObjectMetadata(key: string) {
  const r2Client = getR2Client();
  const config = getR2Config();
  const { HeadObjectCommand } = await import('@aws-sdk/client-s3');

  const command = new HeadObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  return await r2Client.send(command);
}

/**
 * Check if object exists in R2
 */
export async function r2ObjectExists(key: string): Promise<boolean> {
  try {
    await getR2ObjectMetadata(key);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}
