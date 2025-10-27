'use client';

import { usePathname } from 'next/navigation';
import CustomCursor from '@/components/ui/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  settings?: {
    brand?: {
      name_he?: string;
    };
    contact?: {
      phone?: string;
      whatsapp?: string;
      email?: string;
      socialLinks?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
      };
    };
    location?: {
      address_he?: string;
    };
    hours?: {
      sunday?: string;
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
    };
  } | null;
}

export default function ConditionalLayout({ children, settings }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages: no header, footer, or custom cursor
    return <>{children}</>;
  }

  // Public pages: include header, footer, and custom cursor
  return (
    <>
      <CustomCursor />
      <Header />
      <div className="pt-24">{children}</div>
      <Footer settings={settings} />
    </>
  );
}
