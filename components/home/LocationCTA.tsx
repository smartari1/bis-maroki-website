'use client';

import { motion } from 'framer-motion';
import ContactCard from '@/components/ui/ContactCard';
import PatternButton from '@/components/ui/PatternButton';
import { staggerContainer, fadeInRight, pulse } from '@/lib/animations/variants';
import { useScrollAnimation } from '@/lib/animations/hooks';

interface LocationCTAProps {
  address: string;
  phone: string;
  whatsapp: string;
  hours: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  mapUrl: string;
}

/**
 * Location & Contact Section - Footer CTA
 * Features:
 * - Split layout: Map (left) + Contact (right)
 * - Contact cards with icons
 * - Operating hours table
 * - Large reserve CTA button
 * - Waze navigation link
 */
export default function LocationCTA({
  address,
  phone,
  whatsapp,
  hours,
  mapUrl,
}: LocationCTAProps) {
  const scrollProps = useScrollAnimation();

  const daysHebrew = {
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת',
  };

  return (
    <section className="py-20 gradient-warm">
      <div className="container mx-auto px-4">
        <motion.div
          {...scrollProps}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Map */}
          <motion.div variants={fadeInRight} className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-border-strong h-[400px]">
              <iframe
                src={`${mapUrl}?output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום המסעדה"
              />
              {/* Warm overlay */}
              <div className="absolute inset-0 bg-brand-beige/10 pointer-events-none" />
            </div>

            {/* Pin icon with bounce */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full"
            >
              <svg
                className="w-12 h-12 text-brand-red drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0zM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={staggerContainer} className="space-y-6">
            <h2 className="text-4xl font-bold text-brand-black mb-6">
              בואו לבקר אותנו
            </h2>

            {/* Address */}
            <motion.div variants={fadeInRight}>
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0zM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11z" />
                  </svg>
                }
                title="כתובת"
                content={address}
              />
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeInRight}>
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 004.48.9 1 1 0 011 1v3.49a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.9 4.48 1 1 0 01-.21 1.11z" />
                  </svg>
                }
                title="טלפון"
                content={phone}
                href={`tel:${phone}`}
              />
            </motion.div>

            {/* WhatsApp */}
            <motion.div variants={fadeInRight}>
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                }
                title="WhatsApp"
                content={whatsapp}
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              />
            </motion.div>

            {/* Hours */}
            <motion.div variants={fadeInRight}>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-brand-black mb-3 text-lg">שעות פתיחה</h3>
                <div className="space-y-2">
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-brand-black font-medium">
                        {daysHebrew[day as keyof typeof daysHebrew]}
                      </span>
                      <span
                        className={`${
                          time === 'סגור' ? 'text-status-error font-semibold' : 'text-text-gray'
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={pulse}
              animate="pulse"
              className="pt-4"
            >
              <PatternButton href="/restaurant" variant="primary" className="w-full text-lg py-4">
                הזמינו שולחן עכשיו
              </PatternButton>
            </motion.div>

            {/* Waze Link */}
            <motion.a
              href="https://www.waze.com/ul?q=בית+מסעדה"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-brand-black hover:text-brand-red transition-colors font-semibold"
              data-interactive
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
              </svg>
              נווטו אלינו בWaze ←
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
