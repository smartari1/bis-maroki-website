import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';
import { revalidatePath } from 'next/cache';

/**
 * Admin API: Seed Reviews
 * POST /api/admin/reviews/seed
 *
 * Seeds the database with sample reviews
 */

const sampleReviews = [
  // Featured Reviews (will show in main carousel)
  {
    customerName: 'דני כהן',
    rating: 5,
    testimonialText: 'האוכל הכי טעים שאכלתי! הפטה כבד פשוט מושלם, והשירות מעולה. אווירה חמה ומשפחתית, מרגישים כמו בבית. חוזרים בקרוב בוודאי!',
    isFeatured: true,
    status: 'PUBLISHED' as const,
    order: 0,
  },
  {
    customerName: 'רחל לוי',
    rating: 5,
    testimonialText: 'הזמנו מגש אירוח לאירוע משפחתי וכולם התלהבו! המנות היו טריות, טעימות ומגוונות. השירות היה מקצועי והמחיר הוגן מאוד. ממליצה בחום!',
    isFeatured: true,
    status: 'PUBLISHED' as const,
    order: 1,
  },
  {
    customerName: 'יוסי מזרחי',
    rating: 5,
    testimonialText: 'הקובה הכי טובה שיש! מרק עשיר, קובה ממולאת בשר עסיסי, וטעמים שמזכירים את הבית של סבתא. המקום הזה הוא אוצר אמיתי של המטבח המרוקאי.',
    isFeatured: true,
    status: 'PUBLISHED' as const,
    order: 2,
  },
  {
    customerName: 'שרה אבוטבול',
    rating: 5,
    testimonialText: 'מסעדה מעולה עם אוכל אותנטי! הסיגר המרוקאי חריף בדיוק כמו שצריך, והחציל בטחינה פשוט מדהים. כל מנה היא חוויה של טעמים וריחות.',
    isFeatured: true,
    status: 'PUBLISHED' as const,
    order: 3,
  },
  {
    customerName: 'משה ביטון',
    rating: 5,
    testimonialText: 'אחלה מקום! הטורטייה בשר טחון היא החיים, והבקלאווה נמסה בפה. המחירים סבירים והכמויות נדיבות. כבר שלוש פעמים השבוע אנחנו פה!',
    isFeatured: true,
    status: 'PUBLISHED' as const,
    order: 4,
  },

  // Regular Reviews
  {
    customerName: 'אביגיל חדד',
    rating: 5,
    testimonialText: 'מסעדה משפחתית נהדרת עם אוכל ביתי טעים. הקובה סלק הייתה פשוט מושלמת, והשירות מאוד חם ואישי.',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 5,
  },
  {
    customerName: 'אלי אוחיון',
    rating: 5,
    testimonialText: 'כל פעם מחדש אני מתפעל מהאיכות והטעמים. הכריכים טריים והמנות מגיעות חמות. ממש כיף לאכול פה!',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 6,
  },
  {
    customerName: 'מיכל סבג',
    rating: 5,
    testimonialText: 'הזמנתי מגש לחברות בעבודה וכולם בקשו את הפרטים! האוכל מדהים והמחיר שווה מאוד. תודה רבה!',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 7,
  },
  {
    customerName: 'דוד אלמליח',
    rating: 5,
    testimonialText: 'הקובה הכי טובה בעיר! טעם של פעם, בדיוק כמו שאמא מכינה. אווירה נעימה ושירות מעולה.',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 8,
  },
  {
    customerName: 'נועה בן חמו',
    rating: 5,
    testimonialText: 'מסעדה מקסימה עם אוכל טעים! האפשרויות הצמחוניות מעולות, והחציל בטחינה ממכר.',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 9,
  },
  {
    customerName: 'אברהם בוזגלו',
    rating: 5,
    testimonialText: 'כל פעם שאני רוצה לאכול אוכל מרוקאי אמיתי, אני מגיע לפה. הסיגר המרוקאי פשוט מושלם!',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 10,
  },
  {
    customerName: 'ליאת עזרא',
    rating: 4,
    testimonialText: 'אוכל טעים ומנות נדיבות. קצת צפוף בשעות העומס אבל בהחלט שווה את זה. ממליצה!',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 11,
  },
  {
    customerName: 'רונן שלום',
    rating: 5,
    testimonialText: 'הפטה כבד הכי טוב שטעמתי! תבלינים מעולים, טקסטורה נהדרת. חובה לנסות.',
    isFeatured: false,
    status: 'PUBLISHED' as const,
    order: 12,
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing reviews
    await Review.deleteMany({});

    // Insert sample reviews
    const reviews = await Review.insertMany(sampleReviews);

    // Revalidate home page
    revalidatePath('/');

    const featuredCount = reviews.filter(r => r.isFeatured).length;
    const regularCount = reviews.filter(r => !r.isFeatured).length;

    return NextResponse.json({
      success: true,
      message: 'המלצות נוספו בהצלחה',
      data: {
        total: reviews.length,
        featured: featuredCount,
        regular: regularCount,
        reviews: reviews.map(r => ({
          _id: r._id.toString(),
          customerName: r.customerName,
          customerInitials: r.customerInitials,
          rating: r.rating,
          isFeatured: r.isFeatured,
        })),
      },
    });

  } catch (error: any) {
    console.error('Error seeding reviews:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'שגיאה בהוספת המלצות',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
