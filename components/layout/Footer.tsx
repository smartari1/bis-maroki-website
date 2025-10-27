'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface FooterProps {
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

/**
 * Footer Component
 * Full-width footer with links, contact info, and social media
 */
export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Extract settings data with fallbacks
  const brandName = settings?.brand?.name_he || 'ביס מרוקאי';
  const phone = settings?.contact?.phone || '03-1234567';
  const whatsapp = settings?.contact?.whatsapp || '0501234567';
  const email = settings?.contact?.email || 'info@bismaroki.com';
  const address = settings?.location?.address_he || 'רח\' הרצל 123, תל אביב';

  // Social links
  const socialLinks = [];
  if (settings?.contact?.socialLinks?.facebook) {
    socialLinks.push({
      name: 'Facebook',
      href: settings.contact.socialLinks.facebook,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    });
  }
  if (settings?.contact?.socialLinks?.instagram) {
    socialLinks.push({
      name: 'Instagram',
      href: settings.contact.socialLinks.instagram,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    });
  }
  if (settings?.contact?.socialLinks?.tiktok) {
    socialLinks.push({
      name: 'TikTok',
      href: settings.contact.socialLinks.tiktok,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      ),
    });
  }
  if (settings?.contact?.socialLinks?.youtube) {
    socialLinks.push({
      name: 'YouTube',
      href: settings.contact.socialLinks.youtube,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    });
  }

  // Add WhatsApp if available
  if (whatsapp) {
    socialLinks.push({
      name: 'WhatsApp',
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    });
  }

  const quickLinks = [
    { href: '/menu', label: 'תפריט' },
    { href: '/restaurant', label: 'מסעדה' },
    { href: '/catering', label: 'מגשי אירוח' },
    { href: '/events', label: 'אירועים' },
    { href: '/about', label: 'אודות' },
  ];

  return (
    <footer className="bg-brand-black text-brand-cream relative overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 pattern-overlay" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <img
                src="https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/logo.png"
                alt={brandName}
                className="h-20 w-auto mb-3 brightness-0 invert"
              />
            </motion.div>
            <p className="text-brand-beige text-sm leading-relaxed">
              {brandName} - מסעדת אוכל רחוב מרוקאי אותנטי. טעמים מסורתיים מרחוב השוק, חוויה מודרנית.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-orange">קישורים מהירים</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-brand-beige hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-orange">יצירת קשר</h4>
            <ul className="space-y-3 text-brand-beige text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="hover:text-brand-orange transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-brand-orange transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-brand-orange">שעות פתיחה</h4>
            <ul className="space-y-1 text-brand-beige text-sm mb-6">
              {settings?.hours?.wednesday && (
                <li className="flex justify-between">
                  <span>רביעי</span>
                  <span className={settings.hours.wednesday.toLowerCase().includes('סגור') ? 'text-brand-red' : ''}>{settings.hours.wednesday}</span>
                </li>
              )}
              {settings?.hours?.thursday && (
                <li className="flex justify-between">
                  <span>חמישי</span>
                  <span className={settings.hours.thursday.toLowerCase().includes('סגור') ? 'text-brand-red' : ''}>{settings.hours.thursday}</span>
                </li>
              )}
              {!settings?.hours && (
                <li className="text-sm text-brand-beige">
                  <span>רביעי וחמישי: 20:00 - 23:00</span>
                </li>
              )}
            </ul>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-brand-beige hover:text-brand-orange transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-brown pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-beige">
            <p>© {currentYear} {brandName}. כל הזכויות שמורות.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-brand-orange transition-colors">
                תנאי שימוש
              </Link>
              <Link href="/privacy" className="hover:text-brand-orange transition-colors">
                מדיניות פרטיות
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
