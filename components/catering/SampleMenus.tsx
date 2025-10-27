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

interface SampleMenusProps {
  bundles: Bundle[];
  className?: string;
}

export function SampleMenus({ bundles, className = '' }: SampleMenusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.sample-card');

    if (prefersReducedMotion) {
      // Simple fade-in for reduced motion
      gsap.fromTo(
        cards,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
      return;
    }

    // Entrance animation with 3D depth
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 100,
        rotationX: -30,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    );
  }, [prefersReducedMotion]);

  // 3D card tilt effect on mouse move
  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    cardElement: HTMLDivElement
  ) => {
    if (prefersReducedMotion) return;

    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // -10 to 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10; // -10 to 10 degrees

    gsap.to(cardElement, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      force3D: true,
    });

    // Shine effect position
    const shineElement = cardElement.querySelector('.shine-effect') as HTMLElement;
    if (shineElement) {
      gsap.to(shineElement, {
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        opacity: 0.15,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCardMouseLeave = (cardElement: HTMLDivElement) => {
    if (prefersReducedMotion) return;

    gsap.to(cardElement, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    const shineElement = cardElement.querySelector('.shine-effect') as HTMLElement;
    if (shineElement) {
      gsap.to(shineElement, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className={`relative py-32 px-6 bg-gradient-to-b from-[var(--brand-cream)] to-white ${className}`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--brand-black)] mb-4">
            תפריטים מומלצים
          </h2>
          <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
            אלו המגשים הפופולריים ביותר שלנו - אבל תמיד אפשר להתאים אישית
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {bundles.map((bundle, index) => (
            <div
              key={bundle._id}
              className="sample-card group perspective-1000"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget as HTMLDivElement)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget as HTMLDivElement)}
              style={{ perspective: '1000px' }}
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-300 group-hover:shadow-3xl transform-gpu">
                {/* Shine effect overlay */}
                <div
                  className="shine-effect absolute inset-0 pointer-events-none opacity-0 z-10"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)',
                  }}
                />

                {/* Bundle Image */}
                <div className="relative h-80 overflow-hidden">
                  {bundle.mediaIds && bundle.mediaIds.length > 0 ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${bundle.mediaIds[0].url})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--brand-beige)] to-[var(--brand-cream)] flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-[var(--brand-brown)] opacity-30"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  {index === 0 && (
                    <div className="absolute top-6 right-6 bg-[var(--brand-red)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ הכי פופולרי
                    </div>
                  )}

                  {/* Price */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
                    <span className="text-2xl font-bold text-[var(--brand-red)]">
                      ₪{bundle.basePricePerPerson}
                    </span>
                  </div>
                </div>

                {/* Bundle Content */}
                <div className="p-8">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[var(--brand-black)] mb-3 group-hover:text-[var(--brand-red)] transition-colors">
                    {bundle.title_he}
                  </h3>

                  {/* Minimum persons */}
                  <p className="text-sm text-gray-500 mb-4">
                    מינימום {bundle.minPersons} סועדים
                  </p>

                  {/* Composition */}
                  <div className="mb-6 space-y-2">
                    {bundle.includes.mains > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🍖</span>
                        <span className="font-medium">
                          {bundle.includes.mains} עיקריות לבחירה
                        </span>
                      </div>
                    )}
                    {bundle.includes.salads > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🥗</span>
                        <span className="font-medium">
                          {bundle.includes.salads} סלטים טריים
                        </span>
                      </div>
                    )}
                    {bundle.includes.desserts > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-2xl">🍰</span>
                        <span className="font-medium">
                          {bundle.includes.desserts} קינוחים מתוקים
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => {
                      const bundleGrid = document.querySelector('.bundle-card');
                      if (bundleGrid) {
                        bundleGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="w-full bg-[var(--brand-black)] hover:bg-[var(--brand-red)] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 group-hover:scale-105 shadow-md"
                  >
                    לפרטים נוספים
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-lg text-[var(--text-gray)]">
            כל המגשים שלנו ניתנים להתאמה אישית מלאה לפי הטעם והתקציב שלכם
          </p>
        </div>
      </div>
    </section>
  );
}
