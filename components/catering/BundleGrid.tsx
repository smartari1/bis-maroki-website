'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BundleMedia {
  url: string;
  thumbnailUrl: string;
  alt_he: string;
}

interface Bundle {
  _id: string;
  title_he: string;
  slug: string;
  description_he?: any;
  basePricePerPerson: number;
  minPersons: number;
  maxPersons?: number;
  includes: {
    mains: number;
    salads: number;
    desserts: number;
  };
  mediaIds: BundleMedia[];
}

interface BundleGridProps {
  bundles: Bundle[];
  whatsappUrl: string;
  className?: string;
}

export function BundleGrid({ bundles, whatsappUrl, className = '' }: BundleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.bundle-card');

    if (prefersReducedMotion) {
      // Simple fade-in for reduced motion
      gsap.fromTo(
        cards,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
      return;
    }

    // GSAP batch entrance from right (RTL)
    ScrollTrigger.batch(cards, {
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          {
            opacity: 0,
            x: 100,
            rotation: 5,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'back.out(1.7)',
            force3D: true,
          }
        );
      },
      start: 'top 85%',
      once: true,
    });
  }, [prefersReducedMotion]);

  const handleWhatsAppClick = (bundle: Bundle) => {
    const message = encodeURIComponent(
      `שלום! אני מעוניין/ת במגש אירוח: ${bundle.title_he}\nמחיר בסיס: ₪${bundle.basePricePerPerson}\nמינימום: ${bundle.minPersons} סועדים`
    );
    window.open(`${whatsappUrl}${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={containerRef}
      className={`py-20 px-6 bg-gradient-to-b from-[var(--brand-beige)] to-[var(--brand-cream)] ${className}`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--brand-black)] mb-4">
            המגשים שלנו
          </h2>
          <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
            בחרו מבין מגוון מגשי האירוח המוכנים שלנו, או התאימו מגש אישי לפי הטעם שלכם
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <article
              key={bundle._id}
              className="bundle-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Bundle Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[var(--brand-beige)] to-[var(--brand-cream)]">
                {bundle.mediaIds && bundle.mediaIds.length > 0 ? (
                  <div
                    className="bundle-image w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${bundle.mediaIds[0].url})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-[var(--brand-brown)] opacity-30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                )}

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-[var(--brand-red)] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  ₪{bundle.basePricePerPerson}
                </div>
              </div>

              {/* Bundle Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-2xl font-bold text-[var(--brand-black)] mb-3 group-hover:text-[var(--brand-red)] transition-colors">
                  {bundle.title_he}
                </h3>

                {/* Minimum persons */}
                <p className="text-sm text-[var(--text-gray)] mb-4">
                  מינימום {bundle.minPersons} סועדים
                  {bundle.maxPersons && ` • מקסימום ${bundle.maxPersons} סועדים`}
                </p>

                {/* Includes (composition) */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[var(--brand-brown)] mb-2">המגש כולל:</p>
                  <div className="flex flex-wrap gap-2">
                    {bundle.includes.mains > 0 && (
                      <span className="inline-flex items-center gap-1 bg-[var(--brand-red)]/10 text-[var(--brand-red)] px-3 py-1 rounded-full text-sm font-medium">
                        🍖 {bundle.includes.mains} עיקריות
                      </span>
                    )}
                    {bundle.includes.salads > 0 && (
                      <span className="inline-flex items-center gap-1 bg-[var(--brand-green)]/10 text-[var(--brand-green)] px-3 py-1 rounded-full text-sm font-medium">
                        🥗 {bundle.includes.salads} סלטים
                      </span>
                    )}
                    {bundle.includes.desserts > 0 && (
                      <span className="inline-flex items-center gap-1 bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] px-3 py-1 rounded-full text-sm font-medium">
                        🍰 {bundle.includes.desserts} קינוחים
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleWhatsAppClick(bundle)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-full transition-all hover:scale-105 shadow-md hover:shadow-lg"
                  data-magnetic
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  הזמנה בוואטסאפ
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-[var(--text-gray)] mb-6">
            לא מצאתם מה שחיפשתם? בואו נתכנן את המגש המושלם בשבילכם
          </p>
          <button
            onClick={() => {
              const configurator = document.getElementById('catering-configurator');
              if (configurator) {
                configurator.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-3 bg-[var(--brand-black)] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[var(--brand-brown)] transition-all hover:scale-105 shadow-lg"
            data-magnetic
          >
            עיצוב מגש אישי
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
