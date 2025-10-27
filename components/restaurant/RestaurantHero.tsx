'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SplitText from 'gsap/dist/SplitText';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface RestaurantHeroProps {
  settings: {
    brand?: { name_he?: string };
    contact?: any;
    location?: any;
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
  onlineOrderUrl: string;
}

export function RestaurantHero({ settings, onlineOrderUrl }: RestaurantHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Restaurant photos for carousel
  const restaurantPhotos = [
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20241218-WA0091.jpg',
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250107-WA0065.jpg',
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250108-WA0104.jpg',
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250129-WA0110.jpg',
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250617-WA0113.jpg',
    'https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20/%D7%AA%D7%A4%D7%A8%D7%99%D7%98%20%D7%95%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20%D7%9E%D7%A1%D7%A2%D7%93%D7%94/IMG-20250821-WA0090.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % restaurantPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurantPhotos.length - 1 : prev - 1
    );
  };

  // Format hours for display - Only open Wednesday and Thursday
  const formatHours = () => {
    if (!settings?.hours) return 'פתוח: רביעי וחמישי 20:00-23:00';

    const { wednesday, thursday } = settings.hours;

    // Check if both days have same hours
    if (wednesday && thursday && wednesday === thursday && wednesday !== 'סגור') {
      return `פתוח: רביעי וחמישי ${wednesday}`;
    }

    // Different hours for each day
    const parts = [];
    if (wednesday && wednesday !== 'סגור') {
      parts.push(`רביעי ${wednesday}`);
    }
    if (thursday && thursday !== 'סגור') {
      parts.push(`חמישי ${thursday}`);
    }

    if (parts.length > 0) {
      return `פתוח: ${parts.join(', ')}`;
    }

    return 'פתוח: רביעי וחמישי 20:00-23:00';
  };

  useGsapContext(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Plate drop animation
      gsap.from('.hero-plate', {
        y: -200,
        rotation: 360,
        scale: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
      });

      // Hero image parallax
      ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to('.hero-image', {
            y: self.progress * 100,
          });
        },
      });

      // Text reveal with SplitText (RTL)
      const titleElement = document.querySelector('.hero-title');
      if (titleElement) {
        const split = new SplitText(titleElement, { type: 'words,chars' });
        gsap.from(split.chars, {
          opacity: 0,
          y: 50,
          rotationX: -90,
          stagger: {
            from: 'end', // RTL: start from right
            amount: 0.8,
          },
          ease: 'back.out(1.7)',
          delay: 0.5,
        });
      }

      // Subtitle fade up
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.2,
        ease: 'power3.out',
      });

      // Hours badge entrance
      gsap.from('.hours-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        delay: 1.5,
        ease: 'back.out(2)',
      });

      // CTA buttons stagger
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        stagger: {
          from: 'end', // RTL
          amount: 0.3,
        },
        duration: 0.6,
        delay: 1.8,
        ease: 'power3.out',
      });

      // Gallery images entrance from right (RTL)
      gsap.from('.gallery-image', {
        x: 100,
        opacity: 0,
        scale: 0.8,
        stagger: {
          from: 'end', // RTL: start from right
          amount: 0.6,
        },
        duration: 0.8,
        delay: 2,
        ease: 'back.out(1.7)',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[var(--brand-brown)] to-[var(--brand-orange)]"
    >
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Decorative plate in top-right */}
      <div className="hero-plate absolute top-20 left-20 w-32 h-32 opacity-20 z-0">
        <div
          className="w-full h-full rounded-full border-4 border-[var(--brand-beige)]"
          style={{
            boxShadow: '0 10px 30px rgba(124, 74, 39, 0.3)',
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-content order-2 lg:order-1">
            {/* Title */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              ביס מרוקאי — טעם של בית
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-[var(--brand-cream)] mb-8">
              מנות מרוקאיות אותנטיות בלב הרי ירושלים
            </p>

            {/* Hours Badge & Waze Link */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="hours-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-green-400 text-xl">●</span>
                <span className="text-white font-medium">{formatHours()}</span>
              </div>

              {/* Waze Navigation Link */}
              <a
                href="https://waze.com/ul?ll=31.7449239,35.0594668&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00D4FF]/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-[#00D4FF] transition-colors shadow-lg group"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M47.5 24c0-13-10.5-23.5-23.5-23.5S.5 11 .5 24s10.5 23.5 23.5 23.5 23.5-10.5 23.5-23.5zm-27-9.8c0-.6.4-1 1-1h5c.6 0 1 .4 1 1v1.5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-1.5zm8.8 14.3l-1.8 5.3c-.2.5-.6.8-1.1.8h-3.9c-.5 0-.9-.3-1.1-.8l-1.8-5.3c-.1-.3 0-.6.2-.8.2-.2.5-.3.8-.2l3.5 1.2c.3.1.6.1.9 0l3.5-1.2c.3-.1.6 0 .8.2.2.2.3.5.2.8z"/>
                </svg>
                <span className="text-white font-medium">ניווט ב-Waze</span>
                <svg className="w-4 h-4 text-white group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                className="hero-cta px-8 py-4 bg-[var(--brand-orange)] text-white rounded-lg font-bold text-lg hover:bg-[var(--brand-red)] transition-colors shadow-lg"
                onClick={() => {
                  document.querySelector('.menu-section')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                לתפריט המלא
              </button>

              <a
                href={onlineOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-colors"
              >
                הזמנה אונליין
              </a>
            </div>
          </div>

          {/* Right Side - Large Carousel */}
          <div className="carousel-container order-1 lg:order-2 relative">
            {/* Main Image Display */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${restaurantPhotos[currentImageIndex]})`,
                }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group z-10"
                aria-label="תמונה קודמת"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group z-10"
                aria-label="תמונה הבאה"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentImageIndex + 1} / {restaurantPhotos.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Indicators */}
            <div className="flex gap-2 mt-4 justify-center">
              {restaurantPhotos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-white scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${photo})`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-20">
        <span className="text-sm">גלול למטה</span>
        <svg
          className="w-6 h-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
