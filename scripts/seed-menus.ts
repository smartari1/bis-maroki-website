/**
 * Seed Menus
 *
 * This script creates the 3 main menus for the restaurant
 * Usage: npx tsx scripts/seed-menus.ts
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

async function seedMenus() {
  console.log('🌱 Seeding menus...\n');

  try {
    // Import modules AFTER env is loaded
    const { connectDB } = await import('../lib/db/mongoose');
    const MenuModule = await import('../lib/db/models/Menu');
    const Menu = MenuModule.default;

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Define the 3 main menus
    const menus = [
      {
        title: 'תפריט מסעדה',
        slug: 'restaurant',
        scope: 'RESTAURANT',
        items: [], // Will be populated with dishes later
      },
      {
        title: 'מגשי אירוח',
        slug: 'catering',
        scope: 'CATERING',
        items: [], // Will be populated with dishes later
      },
      {
        title: 'אירועים',
        slug: 'events',
        scope: 'CUSTOM',
        items: [], // Will be populated with dishes later
      },
    ];

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const menuData of menus) {
      try {
        // Check if menu already exists
        const existing = await Menu.findOne({ slug: menuData.slug });
        if (existing) {
          console.log(`⏭️  Skipping: ${menuData.title} (slug: ${menuData.slug})`);
          skipped++;
          continue;
        }

        // Create menu
        const menu = new Menu(menuData);
        await menu.save();
        console.log(`✅ Created: ${menuData.title} (slug: ${menuData.slug})`);
        created++;
      } catch (error: any) {
        console.error(`❌ Error creating ${menuData.title}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${menus.length}`);
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedMenus();
