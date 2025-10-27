/**
 * Seed Media from R2 Bucket
 *
 * This script imports all existing images from R2 into the MongoDB database
 * Usage: npx tsx scripts/seed-media-from-r2.ts
 */

// Load environment variables FIRST
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
  process.exit(1);
}

async function seedMediaFromR2() {
  console.log('🌱 Seeding media from R2 bucket...\n');

  try {
    // Import modules AFTER env is loaded
    const { connectDB } = await import('../lib/db/mongoose');
    const MediaModule = await import('../lib/db/models/Media');
    const Media = MediaModule.default;
    const { listR2Images } = await import('../lib/r2/list');
    const { getPublicUrl } = await import('../lib/r2/client');
    const {
      extractCategoryFromPath,
      generateAltText,
      getImageDimensions,
    } = await import('../lib/r2/image-utils');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get all images from R2
    const images = await listR2Images();
    console.log(`📦 Found ${images.length} images in R2\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const image of images) {
      try {
        // Check if already exists
        const existing = await Media.findOne({ fileKey: image.key });
        if (existing) {
          console.log(`⏭️  Skipping (already exists): ${image.key}`);
          skipped++;
          continue;
        }

        // Extract metadata
        const category = extractCategoryFromPath(image.key);
        const altText = generateAltText(image.key);
        const publicUrl = getPublicUrl(image.key);

        console.log(`📝 Processing: ${image.key}`);

        // Get image dimensions (this may take time for large images)
        let dimensions = { width: 800, height: 600 };
        try {
          dimensions = await getImageDimensions(image.key);
          console.log(`   Dimensions: ${dimensions.width}x${dimensions.height}`);
        } catch (dimError) {
          console.log(`   ⚠️  Could not get dimensions, using defaults`);
        }

        // Create media document
        const media = new Media({
          kind: 'IMAGE',
          fileKey: image.key,
          url: publicUrl,
          width: dimensions.width,
          height: dimensions.height,
          alt_he: altText,
          focalPoint: { x: 0.5, y: 0.5 }, // Center by default
          thumbnailUrl: publicUrl, // For now, same as main URL
          blurDataUrl: '', // Will be generated later if needed
          meta: {
            originalSize: image.size,
            lastModified: image.lastModified,
            etag: image.etag,
            category,
          },
        });

        await media.save();
        console.log(`✅ Created: ${image.key}\n`);
        created++;
      } catch (error: any) {
        console.error(`❌ Error processing ${image.key}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${images.length}`);
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedMediaFromR2();
