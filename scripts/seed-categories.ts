/**
 * Seed Categories
 *
 * This script creates the initial category structure for the restaurant
 * Usage: npx tsx scripts/seed-categories.ts
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

async function seedCategories() {
  console.log('🌱 Seeding categories...\n');

  try {
    // Import modules AFTER env is loaded
    const { connectDB } = await import('../lib/db/mongoose');
    const CategoryModule = await import('../lib/db/models/Category');
    const Category = CategoryModule.default;

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Define universal categories (shared across all menus)
    const categories = [
      {
        name_he: 'עיקריות',
        slug: 'ikariyot',
        order: 1,
      },
      {
        name_he: 'כריכים',
        slug: 'krichim',
        order: 2,
      },
      {
        name_he: 'סלטים',
        slug: 'salatim',
        order: 3,
      },
      {
        name_he: 'קינוחים',
        slug: 'kinuchim',
        order: 4,
      },
      {
        name_he: 'תוספות',
        slug: 'tosafot',
        order: 5,
      },
      {
        name_he: 'שתייה קרה',
        slug: 'shtiya-kara',
        order: 6,
      },
      {
        name_he: 'שתייה חמה',
        slug: 'shtiya-chama',
        order: 7,
      },
      {
        name_he: 'מנות ילדים',
        slug: 'manot-yeladim',
        order: 8,
      },
    ];

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const categoryData of categories) {
      try {
        // Check if category already exists
        const existing = await Category.findOne({ slug: categoryData.slug });
        if (existing) {
          console.log(`⏭️  Skipping: ${categoryData.name_he} (slug: ${categoryData.slug})`);
          skipped++;
          continue;
        }

        // Create category
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Created: ${categoryData.name_he} (slug: ${categoryData.slug})`);
        created++;
      } catch (error: any) {
        console.error(`❌ Error creating ${categoryData.name_he}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${categories.length}`);
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedCategories();
