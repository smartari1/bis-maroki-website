#!/usr/bin/env tsx

// Load environment variables FIRST
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (error) {
  console.error('❌ Could not load .env.local file');
  process.exit(1);
}

import { connectDB } from '../lib/db/mongoose';
import Category from '../lib/db/models/Category';
import Dish from '../lib/db/models/Dish';

async function cleanup() {
  console.log('🧹 Cleaning up old data structure...\n');

  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Delete old categories with typeScope
    const categoriesResult = await Category.deleteMany({ typeScope: { $exists: true } });
    console.log(`✅ Deleted ${categoriesResult.deletedCount} old categories with typeScope`);

    // Delete old dishes with type field
    const dishesResult = await Dish.deleteMany({ type: { $exists: true } });
    console.log(`✅ Deleted ${dishesResult.deletedCount} old dishes with type field\n`);

    console.log('🎉 Cleanup complete!');
    console.log('\nNow run:');
    console.log('  npx tsx scripts/seed-categories.ts');
    console.log('  npx tsx scripts/seed-menus.ts');
    console.log('  npx tsx scripts/seed-dishes.ts');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanup();
