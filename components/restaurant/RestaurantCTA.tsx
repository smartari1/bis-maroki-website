'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RestaurantCTAProps {
  settings: {
    contact?: {
      phone?: string;
      whatsapp?: string;
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

export function RestaurantCTA({ settings }: RestaurantCTAProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Days of the week in Hebrew - Only open Wednesday and Thursday
  const daysHebrew = [
    { key: 'wednesday', label: 'רביעי' },
    { key: 'thursday', label: 'חמישי' },
  ];

  const formatPhone = (phone: string) => {
    // Format phone for display (e.g., "054-645-7720" -> "054-645-7720")
    return phone;
  };

  useGsapContext(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // CTA entrance with scale bounce
      gsap.from('.cta-banner', {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.cta-banner',
          start: 'top 90%',
        },
      });

      // Phone number pulse on scroll into view
      gsap.to('.phone-number', {
        scale: 1.05,
        duration: 0.5,
        ease: 'sine.inOut',
        repeat: 3,
        yoyo: true,
        scrollTrigger: {
          trigger: '.cta-banner',
          start: 'top 80%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-red)] relative overflow-hidden"
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="cta-banner container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            הזמינו עכשיו
          </h2>

          <p className="text-xl text-white/90 mb-12">
            נשמח לארח אתכם במסעדה שלנו או להכין לכם הזמנה לאיסוף
          </p>

          {/* Contact Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <a
              href={`tel:${settings?.contact?.phone || '+972501234567'}`}
              className="phone-number group bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-[var(--brand-orange)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/70 mb-1">טלפון</div>
                  <div className="text-xl font-bold text-white" dir="ltr">
                    {formatPhone(settings?.contact?.phone || '050-123-4567')}
                  </div>
                </div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={settings?.contact?.whatsapp ? `https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}` : 'https://wa.me/972501234567'}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/70 mb-1">WhatsApp</div>
                  <div className="text-xl font-bold text-white">שלח הודעה</div>
                </div>
              </div>
            </a>

            {/* Location */}
            <a
              href="https://waze.com/ul?q=ביס מרוקאי"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-[var(--brand-orange)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/70 mb-1">מיקום</div>
                  <div className="text-xl font-bold text-white">נווט אלינו</div>
                </div>
              </div>
            </a>
          </div>

          {/* Hours */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 inline-block">
            <h3 className="text-lg font-bold text-white mb-4">שעות פתיחה</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
              {daysHebrew.map(({ key, label }) => {
                const hoursText = settings?.hours?.[key as keyof typeof settings.hours] || 'סגור';
                const isClosed = hoursText === 'סגור' || !hoursText;

                return (
                  <React.Fragment key={key}>
                    <div className="text-white/80">{label}</div>
                    <div
                      className={isClosed ? "text-red-300 font-medium" : "text-white font-medium"}
                    >
                      {hoursText}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
