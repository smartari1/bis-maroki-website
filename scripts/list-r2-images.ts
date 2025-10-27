/**
 * Script to list all images in R2 bucket
 *
 * Usage: npx tsx scripts/list-r2-images.ts
 */

// Load environment variables from .env.local
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('Failed to load .env.local:', error);
}

import { listR2Images } from '../lib/r2/list';
import { getPublicUrl } from '../lib/r2/client';

async function main() {
  console.log('📦 Listing images from R2 bucket...\n');

  try {
    const images = await listR2Images();

    if (images.length === 0) {
      console.log('❌ No images found in R2 bucket');
      return;
    }

    console.log(`✅ Found ${images.length} images:\n`);

    // Group images by directory/prefix
    const grouped: Record<string, typeof images> = {};

    for (const img of images) {
      const parts = img.key.split('/');
      const prefix = parts.length > 1 ? parts[0] : 'root';

      if (!grouped[prefix]) {
        grouped[prefix] = [];
      }
      grouped[prefix].push(img);
    }

    // Display grouped results
    for (const [prefix, imgs] of Object.entries(grouped)) {
      console.log(`\n📁 ${prefix}/`);
      console.log('─'.repeat(80));

      for (const img of imgs) {
        const sizeKB = (img.size / 1024).toFixed(2);
        const url = getPublicUrl(img.key);

        console.log(`
  Key:      ${img.key}
  Size:     ${sizeKB} KB
  Modified: ${img.lastModified.toISOString()}
  URL:      ${url}
        `);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`Total: ${images.length} images`);
  } catch (error) {
    console.error('❌ Error listing images:', error);
    process.exit(1);
  }
}

main();
