import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { connectDB } from '@/lib/db/mongoose';
import Settings from '@/lib/db/models/Settings';
import '@/lib/db/models';

export const metadata: Metadata = {
  title: 'ביס מרוקאי - מסעדת אוכל רחוב מרוקאי אותנטי',
  description: 'טעמים מסורתיים מרחוב השוק המרוקאי. מנות אותנטיות, מגשי אירוח ואירועים. תל אביב.',
  keywords: 'מסעדה מרוקאית, אוכל מרוקאי, פטה כבד, קובה, סיגר מרוקאי, מגשי אירוח, תל אביב',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'ביס מרוקאי - מסעדת אוכל רחוב מרוקאי אותנטי',
    description: 'טעמים מסורתיים מרחוב השוק המרוקאי',
    type: 'website',
    locale: 'he_IL',
  },
};

async function getSettings() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();

    if (!settings) {
      return null;
    }

    return {
      brand: settings.brand,
      contact: settings.contact,
      location: settings.location,
      hours: settings.hours,
    };
  } catch (error) {
    console.error('Error fetching settings for layout:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        <ConditionalLayout settings={settings}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
