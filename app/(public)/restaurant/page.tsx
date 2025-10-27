import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Dish from '@/lib/db/models/Dish';
import Category from '@/lib/db/models/Category';
import Menu from '@/lib/db/models/Menu';
import Settings from '@/lib/db/models/Settings';
import { RestaurantHero } from '@/components/restaurant/RestaurantHero';
import { DailySpecials } from '@/components/restaurant/DailySpecials';
import { CategoryFilterBar } from '@/components/restaurant/CategoryFilterBar';
import { MenuGrid } from '@/components/restaurant/MenuGrid';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';

// Online ordering link
const ONLINE_ORDER_URL = 'https://order.tap2dine.com/login?key=MMaEM4VmW2gpgSTS1tOtjo6ZIATWDVZL';

async function getRestaurantData() {
  await connectDB();

  // Get settings
  const settings = await Settings.findOne().lean();

  // Find the restaurant menu
  const restaurantMenu = await Menu.findOne({ slug: 'restaurant' }).lean();

  if (!restaurantMenu) {
    return { dishes: [], categories: [], dailySpecials: [], settings: null };
  }

  // Get all dishes for restaurant menu
  const dishes = await Dish.find({
    menuIds: restaurantMenu._id,
    status: 'PUBLISHED',
  })
    .populate('categoryIds', 'name_he slug')
    .populate('mediaIds', 'url thumbnailUrl alt_he fileKey')
    .sort({ createdAt: -1 })
    .lean();

  // Generate signed URLs for all media (1 hour expiry)
  const dishesWithSignedUrls = await Promise.all(
    dishes.map(async (dish: any) => {
      if (dish.mediaIds && dish.mediaIds.length > 0) {
        const mediaWithSignedUrls = await Promise.all(
          dish.mediaIds.map(async (media: any) => {
            try {
              const signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
              return {
                ...media,
                url: signedUrl,
                thumbnailUrl: signedUrl,
              };
            } catch (error) {
              console.warn(`Failed to generate signed URL for ${media.fileKey}:`, error);
              return media; // Return original if signing fails
            }
          })
        );
        return {
          ...dish,
          mediaIds: mediaWithSignedUrls,
        };
      }
      return dish;
    })
  );

  // Get categories used by restaurant dishes
  const categoryIds = [...new Set(dishesWithSignedUrls.flatMap(d => d.categoryIds?.map((c: any) => c._id.toString()) || []))];
  const categories = await Category.find({
    _id: { $in: categoryIds },
  })
    .sort({ order: 1 })
    .lean();

  // Find daily specials (dishes with "מנת היום" badge)
  const dailySpecials = dishesWithSignedUrls.filter((dish: any) =>
    dish.badges?.includes('מנת היום')
  ).slice(0, 4);

  return {
    dishes: dishesWithSignedUrls.map((dish: any) => ({
      _id: dish._id.toString(),
      title_he: dish.title_he,
      slug: dish.slug,
      description_he: dish.description_he,
      price: dish.price,
      categoryIds: dish.categoryIds?.map((c: any) => ({
        _id: c._id.toString(),
        name_he: c.name_he,
        slug: c.slug,
      })) || [],
      spiceLevel: dish.spiceLevel,
      isVegan: dish.isVegan,
      isVegetarian: dish.isVegetarian,
      isGlutenFree: dish.isGlutenFree,
      allergens: dish.allergens || [],
      mediaIds: dish.mediaIds?.map((m: any) => ({
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        alt_he: m.alt_he,
      })) || [],
      badges: dish.badges || [],
      availability: dish.availability,
    })),
    categories: categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name_he: cat.name_he,
      slug: cat.slug,
    })),
    dailySpecials: dailySpecials.map((dish: any) => ({
      _id: dish._id.toString(),
      title_he: dish.title_he,
      slug: dish.slug,
      description_he: dish.description_he,
      price: dish.price,
      mediaIds: dish.mediaIds?.map((m: any) => ({
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        alt_he: m.alt_he,
      })) || [],
      badges: dish.badges || [],
    })),
    settings: settings ? {
      brand: settings.brand,
      contact: settings.contact,
      location: settings.location,
      hours: settings.hours,
    } : null,
  };
}

export default async function RestaurantPage() {
  const { dishes, categories, dailySpecials, settings } = await getRestaurantData();

  return (
    <main className="min-h-screen bg-[var(--brand-cream)]">
      {/* Hero Section */}
      <RestaurantHero settings={settings} onlineOrderUrl={ONLINE_ORDER_URL} />

      {/* Daily Specials */}
      {dailySpecials.length > 0 && (
        <DailySpecials specials={dailySpecials} />
      )}

      {/* Category Filter Bar (Sticky) */}
      <CategoryFilterBar categories={categories} />

      {/* Menu Grid */}
      <MenuGrid dishes={dishes} categories={categories} onlineOrderUrl={ONLINE_ORDER_URL} />
    </main>
  );
}
