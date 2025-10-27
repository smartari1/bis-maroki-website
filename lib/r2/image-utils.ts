/**
 * Image Utilities for R2
 *
 * Helpers for processing and analyzing images
 */

import { getR2Client, getR2Config, getPublicUrl } from './client';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get image dimensions from R2 object
 * Note: This downloads the image to get dimensions
 * For production, consider using a separate metadata store
 */
export async function getImageDimensions(key: string): Promise<ImageDimensions> {
  const r2Client = getR2Client();
  const config = getR2Config();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  const response = await r2Client.send(command);

  if (!response.Body) {
    throw new Error(`Failed to get image body for ${key}`);
  }

  // Convert stream to buffer
  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  // Use sharp to get dimensions (if available)
  try {
    const sharp = await import('sharp');
    const metadata = await sharp.default(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Failed to extract dimensions');
    }

    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    // Fallback: Try to parse image header manually
    // This is a simplified approach - for production use sharp
    console.warn(`Sharp not available, using fallback dimensions for ${key}`);
    return { width: 800, height: 600 }; // Default dimensions
  }
}

/**
 * Extract category from file path
 */
export function extractCategoryFromPath(key: string): string | null {
  const pathParts = key.split('/');

  if (pathParts.length < 2) {
    return null;
  }

  // Extract second-to-last part (category folder)
  const category = pathParts[pathParts.length - 2];

  // Map Hebrew folder names to category types
  const categoryMap: Record<string, string> = {
    'אירועים ביס ': 'EVENT',
    'מגשי אירוח בשריים ': 'CATERING',
    'תפריט ותמונות מסעדה': 'RESTAURANT',
  };

  return categoryMap[category] || 'RESTAURANT';
}

/**
 * Extract file name without extension
 */
export function extractFileName(key: string): string {
  const parts = key.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.replace(/\.[^.]+$/, '');
}

/**
 * Generate alt text from file name (basic)
 */
export function generateAltText(key: string): string {
  const fileName = extractFileName(key);
  const category = extractCategoryFromPath(key);

  const categoryNames: Record<string, string> = {
    'EVENT': 'ביס מרוקאי - אירועים',
    'CATERING': 'ביס מרוקאי - מגשי אירוח',
    'RESTAURANT': 'ביס מרוקאי - מסעדה',
  };

  const categoryName = categoryNames[category || 'RESTAURANT'] || 'ביס מרוקאי';

  return `${categoryName} - ${fileName}`;
}
