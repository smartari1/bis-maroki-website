import Hero from '@/components/home/Hero';
import StoryCards from '@/components/home/StoryCards';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import MenuShowcase from '@/components/home/MenuShowcase';
import SocialProof from '@/components/motion/SocialProof';
import LocationCTA from '@/components/home/LocationCTA';
import { connectDB } from '@/lib/db/mongoose';
import Settings from '@/lib/db/models/Settings';
import Review from '@/lib/db/models/Review';
import '@/lib/db/models';

async function getSettings() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();

    if (!settings) {
      return null;
    }

    return {
      contact: settings.contact,
      location: settings.location,
      hours: settings.hours,
    };
  } catch (error) {
    console.error('Error fetching settings for home page:', error);
    return null;
  }
}

async function getReviews() {
  try {
    await connectDB();
    const reviews = await Review.find({ status: 'PUBLISHED' })
      .sort({ order: 1, createdAt: -1 })
      .select('customerName customerInitials rating testimonialText isFeatured')
      .lean();

    return reviews.map(review => ({
      ...review,
      _id: review._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching reviews for home page:', error);
    return [];
  }
}

/**
 * Home Page - ביס מרוקאי
 * Complete redesign with Tailwind CSS + Framer Motion
 * Features: Rich Moroccan patterns, warm brand colors, smooth animations
 */
export default async function Home() {
  const settings = await getSettings();
  const reviews = await getReviews();
  return (
    <>
      {/* Global background image with orange overlay - covers entire page */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250821-WA0090.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-brand-orange/50" />
      </div>

      <main className="relative z-10 overflow-x-hidden">
        {/* Hero Section */}
        <Hero
        headline="ביס מרוקאי"
        subtext="מהיר חריף ועצבני"
        ctaPrimary={{ label: 'הזמנת שולחן', href: '/restaurant' }}
        ctaSecondary={{ label: 'מגשי אירוח', href: '/catering' }}
      />

      {/* Story Cards - 3 Key Messages */}
      <StoryCards
        cards={[
          {
            title: 'המרכיבים',
            description: 'רק חומרי גלם טריים מהשוק. כל יום אנחנו מביאים את המרכיבים הטריים ביותר - עגבניות, פלפלים, תבלינים שנבחרו בקפידה.',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20241218-WA0091.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250107-WA0065.jpg',
            icon: '🥬',
          },
          {
            title: 'המסורת',
            description: 'מתכונים עתיקים שעברו דור אחר דור. האש היא הסוד שלנו - בישול איטי וסבלני שמעניק לכל מנה את הטעם המעושן והעשיר.',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250108-WA0104.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250129-WA0110.jpg',
            icon: '🔥',
          },
          {
            title: 'האירוח',
            description: 'מגשי אירוח מרשימים לכל אירוע. מבחר מנות עיקריות, סלטים וקינוחים מסורתיים המושלמים לאירוח משפחתי וחברים.',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%9E%D7%92%D7%A9%D7%99%20%D7%90%D7%99%D7%A8%D7%95%D7%97%20%D7%91%D7%A9%D7%A8%D7%99%D7%99%D7%9D%20/IMG-20230508-WA0108.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250617-WA0113.jpg',
            icon: '🎉',
            ctaLabel: 'הזמינו עכשיו',
            ctaHref: '/catering',
          },
        ]}
      />

      {/* Services Showcase - 3 Main Services */}
      <ServicesShowcase
        services={[
          {
            title: 'המסעדה שלנו',
            description: 'חוויית אוכל מרוקאי אותנטי במסעדה שלנו. מנות טריות מידי יום, אווירה חמה ומשפחתית',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250821-WA0090.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250108-WA0114.jpg',
            ctaLabel: 'לתפריט המלא',
            ctaHref: '/restaurant',
          },
          {
            title: 'מגשי אירוח',
            description: 'מגשים מרשימים לאירועים. מגוון מנות עיקריות, סלטים וקינוחים. מינימום 10 איש',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%9E%D7%92%D7%A9%D7%99%20%D7%90%D7%99%D7%A8%D7%95%D7%97%20%D7%91%D7%A9%D7%A8%D7%99%D7%99%D7%9D%20/IMG-20230706-WA0002.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%9E%D7%92%D7%A9%D7%99%20%D7%90%D7%99%D7%A8%D7%95%D7%97%20%D7%91%D7%A9%D7%A8%D7%99%D7%99%D7%9D%20/IMG-20230508-WA0133.jpg',
            ctaLabel: 'הזמינו מגש',
            ctaHref: '/catering',
          },
          {
            title: 'אירועים',
            description: 'השכירו את המקום לאירוע שלכם. שירות מלא, תפריט מותאם אישית וצוות מקצועי',
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D%20%D7%91%D7%99%D7%A1%20/IMG-20250312-WA0172.jpg',
            overlayImage: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D%20%D7%91%D7%99%D7%A1%20/IMG-20250215-WA0038.jpg',
            ctaLabel: 'פרטים נוספים',
            ctaHref: '/events',
          },
        ]}
      />

      {/* Menu Showcase - Featured Dishes */}
      <MenuShowcase
        dishes={[
          {
            id: '1',
            title: 'פטה כבד מרוקאי',
            description: 'פטה כבד עשיר עם תבלינים מרוקאיים אותנטיים',
            price: 42,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20241218-WA0091.jpg',
            spiceLevel: 1,
            badge: 'פופולרי',
          },
          {
            id: '2',
            title: 'סיגר מרוקאי חריף',
            description: 'סיגר פריך במילוי בשר טחון מתובל',
            price: 45,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250107-WA0065.jpg',
            spiceLevel: 3,
          },
          {
            id: '3',
            title: 'קובה סלק',
            description: 'קובה ממולאת בשר במרק סלק עשיר',
            price: 38,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250108-WA0104.jpg',
            badge: 'מומלץ',
          },
          {
            id: '4',
            title: 'חציל בטחינה',
            description: 'חציל קלוי עם טחינה גולמית ותבלינים',
            price: 32,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250129-WA0110.jpg',
            isVegan: true,
          },
          {
            id: '5',
            title: 'טורטייה בשר',
            description: 'טורטייה ממולאת בבשר מתובל ירקות',
            price: 48,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250617-WA0113.jpg',
            spiceLevel: 2,
          },
          {
            id: '6',
            title: 'בקלאווה',
            description: 'קינוח מסורתי מתוק עם אגוזים ודבש',
            price: 28,
            image: 'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%9E%D7%92%D7%A9%D7%99%20%D7%90%D7%99%D7%A8%D7%95%D7%97%20%D7%91%D7%A9%D7%A8%D7%99%D7%99%D7%9D%20/IMG-20230508-WA0108.jpg',
            isVegetarian: true,
          },
        ]}
      />

      {/* Customer Reviews - Managed via Admin */}
      <SocialProof reviews={reviews} />

      {/* Location & Contact */}
      <LocationCTA
        address={settings?.location?.address_he || 'רח\' הרצל 123, תל אביב'}
        phone={settings?.contact?.phone || '03-1234567'}
        whatsapp={settings?.contact?.whatsapp || '050-1234567'}
        hours={{
          sunday: settings?.hours?.sunday || '11:00 - 23:00',
          monday: settings?.hours?.monday || '11:00 - 23:00',
          tuesday: settings?.hours?.tuesday || '11:00 - 23:00',
          wednesday: settings?.hours?.wednesday || '11:00 - 23:00',
          thursday: settings?.hours?.thursday || '11:00 - 23:00',
          friday: settings?.hours?.friday || '11:00 - 16:00',
          saturday: settings?.hours?.saturday || 'סגור',
        }}
        mapUrl={
          settings?.location?.lat && settings?.location?.lng
            ? `https://www.google.com/maps?q=${settings.location.lat},${settings.location.lng}`
            : 'https://www.google.com/maps?q=32.0709,34.7748'
        }
      />
      </main>
    </>
  );
}
