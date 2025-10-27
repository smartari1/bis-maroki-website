import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Bundle from '@/lib/db/models/Bundle';
import Dish from '@/lib/db/models/Dish';
import Menu from '@/lib/db/models/Menu';
import Settings from '@/lib/db/models/Settings';
import { generateSignedViewUrl } from '@/lib/r2/signed-urls';
import { CateringHero } from '@/components/catering/CateringHero';
import { BundleGrid } from '@/components/catering/BundleGrid';
import { CateringConfigurator } from '@/components/catering/CateringConfigurator';
import { HowItWorksTimeline } from '@/components/catering/HowItWorksTimeline';
import { SampleMenus } from '@/components/catering/SampleMenus';
import { CateringFAQ } from '@/components/catering/CateringFAQ';

// WhatsApp link for inquiries
const WHATSAPP_URL = 'https://wa.me/972524481419?text=';

async function getCateringData() {
  await connectDB();

  // Get settings
  const settings = await Settings.findOne().lean();

  // Find the catering menu
  const cateringMenu = await Menu.findOne({ slug: 'catering' }).lean();

  if (!cateringMenu) {
    return { bundles: [], dishes: [], settings: null };
  }

  // Get all bundles
  const bundles = await Bundle.find({ status: 'PUBLISHED' })
    .populate('mediaIds', 'url thumbnailUrl alt_he fileKey')
    .populate('allowedDishIds', 'title_he slug price mediaIds categoryIds')
    .sort({ createdAt: -1 })
    .lean();

  // Get all catering dishes
  const dishes = await Dish.find({
    menuIds: cateringMenu._id,
    status: 'PUBLISHED',
  })
    .populate('categoryIds', 'name_he slug')
    .populate('mediaIds', 'url thumbnailUrl alt_he fileKey')
    .sort({ createdAt: -1 })
    .lean();

  // Generate signed URLs for all media
  const bundlesWithSignedUrls = await Promise.all(
    bundles.map(async (bundle: any) => {
      // Sign bundle media
      if (bundle.mediaIds && bundle.mediaIds.length > 0) {
        const mediaWithSignedUrls = await Promise.all(
          bundle.mediaIds.map(async (media: any) => {
            try {
              const signedUrl = await generateSignedViewUrl(media.fileKey, 3600);
              return {
                ...media,
                url: signedUrl,
                thumbnailUrl: signedUrl,
              };
            } catch (error) {
              console.warn(`Failed to generate signed URL:`, error);
              return media;
            }
          })
        );
        return {
          ...bundle,
          mediaIds: mediaWithSignedUrls,
        };
      }
      return bundle;
    })
  );

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
              return media;
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

  return {
    bundles: bundlesWithSignedUrls.map((bundle: any) => ({
      _id: bundle._id.toString(),
      title_he: bundle.title_he,
      slug: bundle.slug,
      description_he: bundle.description_he,
      basePricePerPerson: bundle.basePricePerPerson,
      minPersons: bundle.minPersons,
      maxPersons: bundle.maxPersons,
      includes: bundle.includes,
      allowedDishIds: bundle.allowedDishIds?.map((dish: any) => dish._id.toString()) || [],
      mediaIds: bundle.mediaIds?.map((m: any) => ({
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        alt_he: m.alt_he,
      })) || [],
    })),
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
      mediaIds: dish.mediaIds?.map((m: any) => ({
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        alt_he: m.alt_he,
      })) || [],
      isVegan: dish.isVegan,
      isVegetarian: dish.isVegetarian,
      isGlutenFree: dish.isGlutenFree,
      spiceLevel: dish.spiceLevel,
    })),
    settings: settings ? {
      brand: settings.brand,
      contact: settings.contact,
      location: settings.location,
      catering: settings.catering,
    } : null,
  };
}

export default async function CateringPage() {
  const { bundles, dishes, settings } = await getCateringData();

  return (
    <main className="min-h-screen bg-[var(--brand-cream)]">
      {/* Hero Section with Plate → Platter Morph */}
      <CateringHero />

      {/* Bundle Grid */}
      {bundles.length > 0 && (
        <BundleGrid bundles={bundles} whatsappUrl={WHATSAPP_URL} />
      )}

      {/* Interactive Configurator */}
      {dishes.length > 0 && (
        <CateringConfigurator
          dishes={dishes}
          basePrice={120}
          whatsappUrl={WHATSAPP_URL}
          cateringSettings={settings?.catering}
        />
      )}

      {/* How It Works Timeline */}
      <HowItWorksTimeline />

      {/* Sample Menus */}
      {bundles.length > 0 && (
        <SampleMenus bundles={bundles.slice(0, 3)} />
      )}

      {/* FAQ Section */}
      <CateringFAQ />
    </main>
  );
}
