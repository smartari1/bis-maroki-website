'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Draggable from 'gsap/dist/Draggable';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

interface DailySpecial {
  _id: string;
  title_he: string;
  slug: string;
  description_he: any;
  price: number;
  mediaIds: Array<{
    url: string;
    thumbnailUrl: string;
    alt_he: string;
  }>;
  badges: string[];
}

interface DailySpecialsProps {
  specials: DailySpecial[];
}

export function DailySpecials({ specials }: DailySpecialsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Card entrance stagger from right (RTL)
      gsap.from('.special-card', {
        x: 150,
        opacity: 0,
        scale: 0.8,
        rotation: -5,
        stagger: {
          from: 'end',
          amount: 0.6,
        },
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.specials-section',
          start: 'top 80%',
        },
      });

      // Shine effect on daily badge
      const badges = document.querySelectorAll('.daily-badge');
      badges.forEach((badge) => {
        gsap.to(badge, {
          backgroundPosition: '200% center',
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          repeatDelay: 3,
        });
      });

      // Draggable carousel with inertia
      if (!window.matchMedia('(max-width: 768px)').matches) {
        const carousel = document.querySelector('.specials-carousel');
        if (carousel) {
          Draggable.create(carousel, {
            type: 'x',
            bounds: '.carousel-container',
            inertia: true,
            edgeResistance: 0.65,
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (!specials || specials.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="specials-section py-20 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--brand-black)] mb-4">
            מנות היום
          </h2>
          <p className="text-lg text-[var(--text-gray)]">
            המנות המיוחדות שלנו להיום
          </p>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container relative">
          <div className="specials-carousel flex gap-6 pb-8 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
            {specials.map((special) => (
              <div
                key={special._id}
                className="special-card flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-[var(--brand-beige)] overflow-hidden">
                  {special.mediaIds[0] ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-110"
                      style={{
                        backgroundImage: `url(${special.mediaIds[0].thumbnailUrl || special.mediaIds[0].url})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-[var(--brand-brown)] opacity-30"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </div>
                  )}

                  {/* Daily Badge with Shine Effect */}
                  <div
                    className="daily-badge absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white text-sm"
                    style={{
                      background: 'linear-gradient(90deg, #E0723E 0%, #D34A2F 50%, #E0723E 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    מנת היום
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--brand-black)] mb-2">
                    {special.title_he}
                  </h3>

                  {special.description_he?.blocks?.[0]?.data?.text && (
                    <p className="text-[var(--text-gray)] mb-4 line-clamp-2">
                      {special.description_he.blocks[0].data.text}
                    </p>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    {special.price > 0 && (
                      <span className="text-2xl font-bold text-[var(--brand-orange)]">
                        ₪{special.price}
                      </span>
                    )}

                    <button className="px-6 py-2 bg-[var(--brand-orange)] text-white rounded-lg font-medium hover:bg-[var(--brand-red)] transition-colors">
                      הזמן עכשיו
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Hint (Mobile) */}
          <div className="md:hidden text-center mt-4 text-sm text-[var(--text-gray)]">
            <span>גלול ימינה לעוד מנות ←</span>
          </div>
        </div>
      </div>
    </section>
  );
}
