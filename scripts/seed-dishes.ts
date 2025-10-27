/**
 * Seed Dishes
 *
 * This script creates dishes based on real menu documents
 * - תפריט מסעדה (Restaurant)
 * - מגשי אירוח (Catering)
 * - אירועים (Events)
 *
 * Usage: npx tsx scripts/seed-dishes.ts
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

async function seedDishes() {
  console.log('🌱 Seeding dishes from real menus...\n');

  try {
    // Import modules AFTER env is loaded
    const { connectDB } = await import('../lib/db/mongoose');
    const DishModule = await import('../lib/db/models/Dish');
    const Dish = DishModule.default;
    const CategoryModule = await import('../lib/db/models/Category');
    const Category = CategoryModule.default;
    const MenuModule = await import('../lib/db/models/Menu');
    const Menu = MenuModule.default;

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get categories and create lookup map
    const categories = await Category.find();
    const categoryMap = new Map(categories.map(c => [c.slug, c._id]));
    console.log(`📦 Found ${categories.length} categories`);

    // Get menus and create lookup map
    const menus = await Menu.find();
    const menuMap = new Map(menus.map(m => [m.slug, m._id]));
    console.log(`📋 Found ${menus.length} menus\n`);

    // Helper to create description blocks
    const desc = (text: string) => ({
      blocks: [{ type: 'paragraph', data: { text } }]
    });

    // Define all dishes based on real menu documents
    const dishes = [
      // ==================== RESTAURANT MENU ====================
      // Schnitzel dishes
      {
        title_he: 'שניצל במגש',
        slug: 'schnitzel-bemegash',
        menuIds: [menuMap.get('restaurant')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('שניצל דק קריספי בתוספת פוטטוס פלחי תפו"א, סלט כרוב במיונז ואיולי שום שמיר'),
        price: 65,
        spiceLevel: 0,
        allergens: ['גלוטן', 'ביצים'],
        badges: ['מנת צהריים'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'חלה שניצל',
        slug: 'challah-schnitzel',
        menuIds: [menuMap.get('restaurant')],
        categoryIds: [categoryMap.get('krichim')],
        description_he: desc('חלה שמינייה מזונות עם ממרח חומוס מטבוחה חציל מטוגן ושניצל פריך'),
        price: 65,
        spiceLevel: 1,
        allergens: ['גלוטן', 'ביצים', 'שומשום'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'לחמניה שניצל',
        slug: 'lachmaniya-schnitzel',
        menuIds: [menuMap.get('restaurant')],
        categoryIds: [categoryMap.get('krichim')],
        description_he: desc('לחמניית קשר מזונות ממרח חומוס מטבוחה חציל מטוגן ושניצל פריך'),
        price: 39,
        spiceLevel: 1,
        allergens: ['גלוטן', 'ביצים', 'שומשום'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'רצועות שניצל',
        slug: 'retzuot-schnitzel',
        menuIds: [menuMap.get('restaurant')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('שניצל פריך חתוך לרצועות'),
        price: 30,
        spiceLevel: 0,
        allergens: ['גלוטן', 'ביצים'],
        badges: [],
        status: 'PUBLISHED',
      },

      // ==================== SHARED: CATERING & EVENTS ====================
      // Main dishes (עיקריות) - shared between both menus
      {
        title_he: 'ביס מרוקאי',
        slug: 'bis-maroki',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot'), categoryMap.get('krichim')],
        description_he: desc('שניצל פריך בלחמניה רכה עם מטבוחה מרוקאית פיקנטית ופרוסת חציל מטוגן'),
        price: 0, // Part of package
        spiceLevel: 2,
        allergens: ['גלוטן', 'ביצים'],
        badges: ['מומלץ', 'המנה המיוחדת שלנו'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טורטייה אסאדו מעושן',
        slug: 'tortilla-asado-meushan',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('טורטייה במילוי אסאדו מעושן עם רוטב ברביקיו וצ\'יפס מרובע'),
        price: 0,
        spiceLevel: 1,
        allergens: ['גלוטן'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טורטייה בשר טחון',
        slug: 'tortilla-basar-tachun',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('טורטייה במילוי בשר טחון עם שומן כבש בצל מטוגן וממרח חומוס'),
        price: 0,
        spiceLevel: 2,
        allergens: ['גלוטן', 'שומשום'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טורטייה אסייאתי',
        slug: 'tortilla-asiyati',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('טורטייה במילוי חזה עוף מוקפץ עם ירקות בסגנון אסייאתי'),
        price: 0,
        spiceLevel: 1,
        allergens: ['גלוטן', 'סויה'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טורטייה מעורב ירושלמי',
        slug: 'tortilla-meorav-yerushalmi',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('טורטייה במילוי חזה עוף פרגיות וכבד עם בצל מטוגן בזילוף טחינה ופטרוזיליה קצוצה'),
        price: 0,
        spiceLevel: 1,
        allergens: ['גלוטן', 'שומשום'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'קרואסון סצ\'ואן',
        slug: 'croissant-szechuan',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot'), categoryMap.get('krichim')],
        description_he: desc('קרואסון צרפתי במילוי אוסובוקו מעושן עם פלפל אדום בצל מטוגן ברוטב סצ\'ואן'),
        price: 0,
        spiceLevel: 2,
        allergens: ['גלוטן', 'חלב', 'סויה'],
        badges: ['מומלץ'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'בייגל קורנדביף',
        slug: 'bagel-corned-beef',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot'), categoryMap.get('krichim')],
        description_he: desc('חצי בייגל אמריקאי במילוי קורנדביף פרוס דק עם איולי שום שמיר עגבנייה בצל סגול מיקס חסה ונגיעות רוטב סריראצ\'ה'),
        price: 0,
        spiceLevel: 1,
        allergens: ['גלוטן', 'ביצים'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'פרנה אנטריקוט',
        slug: 'parna-entrecote',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot'), categoryMap.get('krichim')],
        description_he: desc('חצי פרנה מרוקאית במילוי אנטריקוט פרוס דק דק עם חומוס חריף אריסה פיקנטית פרוסות מלפפון חמוץ וכרוב סגול במיונז'),
        price: 0,
        spiceLevel: 3,
        allergens: ['גלוטן', 'שומשום', 'ביצים'],
        badges: ['חריף'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'סביח',
        slug: 'sabich',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('מיני פיתה במילוי חומוס חריף בצל בסומאק פרוסות חציל מטוגן ביצה קשה מלפפון חמוץ פטרוזיליה קצוצה מגיע עם רוטב טחינה בצד'),
        price: 0,
        spiceLevel: 1,
        isVegetarian: true,
        allergens: ['גלוטן', 'שומשום', 'ביצים'],
        badges: ['צמחוני'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'המבורגר',
        slug: 'hamburger',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('לחמניה רכה עם המבורגר עסיסי חסה עגבנייה בצל סגול ורוטב אלף האיים'),
        price: 0,
        spiceLevel: 0,
        allergens: ['גלוטן', 'ביצים'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'קבב מזרחי',
        slug: 'kebab-mizrachi',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('ikariyot')],
        description_he: desc('מיני לחמניה עם קבב בתיבול מיוחד צ\'ימיצ\'ורי חסה וטחינה עמבה'),
        price: 0,
        spiceLevel: 2,
        allergens: ['גלוטן', 'שומשום'],
        badges: [],
        status: 'PUBLISHED',
      },

      // Shared salads (סלטים)
      {
        title_he: 'גזר חי חריף',
        slug: 'gezer-chai-charif',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('גזר חי טרי מגורד עם תיבול חריף'),
        price: 0,
        spiceLevel: 2,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'סלק אדום חי חמוץ',
        slug: 'selek-adom-chai-chamutz',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('סלק אדום טרי מגורד בתיבול חמוץ'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'חסה עם פרי העונה',
        slug: 'chasa-im-pri-haona',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('חסה טריה עם פירות העונה'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'כרוב לבן חמוץ',
        slug: 'kruv-lavan-chamutz',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('כרוב לבן כבוש בתיבול חמוץ'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'כרוב סגול אסייאתי',
        slug: 'kruv-sagol-asiyati',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('כרוב סגול בתיבול אסייאתי מיוחד'),
        price: 0,
        spiceLevel: 1,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: ['סויה'],
        badges: ['טבעוני'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'כרוב לבן עם פלפל אדום בצל ירוק ומקלות שקדים',
        slug: 'kruv-lavan-pilpel-adom',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('כרוב לבן עם פלפל אדום בצל ירוק ומקלות שקדים'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: ['אגוזים'],
        badges: ['טבעוני'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'מיקס ירוקים',
        slug: 'mix-yerokim',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('חסה עם עשבי תיבול חמוציות ואגוזי מלך ברוטב מתקתק'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: ['אגוזים'],
        badges: ['צמחוני'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'קינואה נענע חמוציות ופקאן',
        slug: 'kinoa-naana-pecan',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('קינואה עם נענע חמוציות ופקאן טבעי'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: ['אגוזים'],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'חסה שרי פטריות בטטה צ\'יפס',
        slug: 'chasa-cherry-pitriyot-batata',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('salatim')],
        description_he: desc('חסה עם עגבניות שרי פטריות וצ\'יפס בטטה (מגיע רק בקערה)'),
        price: 0,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },

      // Shared desserts (קינוחים)
      {
        title_he: 'שמרים שוקולד לוז פרווה',
        slug: 'shmarim-shokolad-luz',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('kinuchim')],
        description_he: desc('שמרים אוורירי עם מילוי שוקולד ולוז פרווה'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: ['גלוטן', 'אגוזים'],
        badges: ['מומלץ'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'מלבי קוקוס',
        slug: 'malabi-kokos',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('kinuchim')],
        description_he: desc('מלבי קוקוס קרמי ומרענן'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: [],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'ברולה פרווה',
        slug: 'brulee-parve',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('kinuchim')],
        description_he: desc('ברולה פרווה עם רוטב קרמל'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: ['ביצים'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'בקלאווה',
        slug: 'baklava',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('kinuchim')],
        description_he: desc('בקלאווה מרוקאית אותנטית ברוטב דבש תפוזים'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: ['גלוטן', 'אגוזים'],
        badges: ['מומלץ', 'אותנטי'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'מוס שוקולד',
        slug: 'mousse-shokolad',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('kinuchim')],
        description_he: desc('מוס שוקולד עשיר וקרמי'),
        price: 0,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: ['ביצים', 'חלב'],
        badges: [],
        status: 'PUBLISHED',
      },

      // Kids meals (מנות ילדים) - different prices for catering vs events
      {
        title_he: 'ילדים - המבורגר עם צ\'יפס',
        slug: 'yeladim-hamburger',
        menuIds: [menuMap.get('catering'), menuMap.get('events')],
        categoryIds: [categoryMap.get('manot-yeladim')],
        description_he: desc('לחמניה רכה עם המבורגר או נקניקיה וקטשופ + צ\'יפס'),
        price: 40, // Catering price, Events is 45
        spiceLevel: 0,
        allergens: ['גלוטן'],
        badges: ['ילדים'],
        status: 'PUBLISHED',
      },

      // ==================== EVENTS ONLY - EXTRAS (תוספות) ====================
      {
        title_he: 'קובה סיסקה',
        slug: 'kubeh-siska',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('קובה סיסקה עבודת יד במרק סלק חמצמץ פיקנטי - מנה 3 קובה לאדם'),
        price: 42,
        spiceLevel: 2,
        allergens: [],
        badges: ['עבודת יד', 'מומלץ'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טורטייה בשר טחון ושומן כבש בציפוי קריספי',
        slug: 'tortilla-crispy-basar-tachun',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('טורטייה במילוי בשר טחון ושומן כבש בציפוי קריספי מיוחד'),
        price: 35,
        spiceLevel: 2,
        allergens: ['גלוטן'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'סיגר מרוקאי פיקנטי',
        slug: 'cigar-maroki-pikanti',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('סיגר מרוקאי עבודת יד במילוי בשר עשיר'),
        price: 20,
        spiceLevel: 3,
        allergens: ['גלוטן'],
        badges: ['עבודת יד', 'חריף'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'אגרול סיני',
        slug: 'egg-roll-sini',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('אגרול סיני במילוי ירקות ועוף בסגנון אסייאתי'),
        price: 15,
        spiceLevel: 1,
        allergens: ['גלוטן', 'סויה'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'אדממה',
        slug: 'edamame',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('פולי סויה חלוטים עם מלח גס ולימון'),
        price: 20,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: ['סויה'],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'חציל בטחינה (תוספת)',
        slug: 'chatzil-b-tchina-tosefet',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('חציל שרוף על להבה גלויה עם טחינה גולמית סילאן ומלח ים וצ\'ילי אדום ובוטנים מטוגנים מוגש עם משולשי טורטייה קראנצ\'י'),
        price: 35,
        spiceLevel: 2,
        isVegetarian: true,
        allergens: ['שומשום', 'בוטנים', 'גלוטן'],
        badges: ['צמחוני', 'מומלץ'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'מיקס נקניקיות',
        slug: 'mix-naknikiyot',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('צ\'וריסוס, מרגז, קראנץ\' - 10 יחידות'),
        price: 180,
        spiceLevel: 1,
        allergens: [],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'צ\'יפס',
        slug: 'chips',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('צ\'יפס טרי וזהוב'),
        price: 10,
        spiceLevel: 0,
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        allergens: [],
        badges: ['טבעוני', 'ללא גלוטן'],
        status: 'PUBLISHED',
      },
      {
        title_he: 'טבעות בצל',
        slug: 'tabat-batzal',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('טבעות בצל פריכות בציפוי מתובל'),
        price: 17,
        spiceLevel: 0,
        isVegetarian: true,
        allergens: ['גלוטן'],
        badges: [],
        status: 'PUBLISHED',
      },
      {
        title_he: 'כרובית בציפוי פריך',
        slug: 'kruvit-b-tzipuy-priach',
        menuIds: [menuMap.get('events')],
        categoryIds: [categoryMap.get('tosafot')],
        description_he: desc('כרובית טריה בציפוי פריך מתובל'),
        price: 25,
        spiceLevel: 1,
        isVegetarian: true,
        allergens: ['גלוטן'],
        badges: ['צמחוני'],
        status: 'PUBLISHED',
      },
    ];

    // Create dishes
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const dishData of dishes) {
      try {
        // Check if dish already exists
        const existing = await Dish.findOne({ slug: dishData.slug });
        if (existing) {
          console.log(`⏭️  Skipping: ${dishData.title_he}`);
          skipped++;
          continue;
        }

        // Create dish with defaults
        const dish = new Dish({
          ...dishData,
          currency: 'ILS',
          isVegan: dishData.isVegan || false,
          isVegetarian: dishData.isVegetarian || false,
          isGlutenFree: dishData.isGlutenFree || false,
          allergens: dishData.allergens || [],
          mediaIds: [],
          badges: dishData.badges || [],
          availability: 'AVAILABLE',
          publishAt: new Date(),
        });

        await dish.save();
        console.log(`✅ Created: ${dishData.title_he}`);
        created++;
      } catch (error: any) {
        console.error(`❌ Error creating ${dishData.title_he}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${dishes.length}`);
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedDishes();
