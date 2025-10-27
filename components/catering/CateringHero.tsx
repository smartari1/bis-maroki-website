'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/dist/SplitText';
import { MorphSVGPlugin } from 'gsap/dist/MorphSVGPlugin';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, MorphSVGPlugin);
}

interface CateringHeroProps {
  className?: string;
}

export function CateringHero({ className = '' }: CateringHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const plateRef = useRef<SVGSVGElement>(null);
  const steamRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current || !headlineRef.current || !plateRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (prefersReducedMotion) {
      // Reduced motion: Simple fade-in
      tl.fromTo(
        headlineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }
      );
      tl.fromTo(
        '.hero-subtext',
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.3'
      );
      tl.fromTo(
        '.hero-cta',
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.2'
      );
      return;
    }

    // Plate → Platter morph animation
    const platePath = plateRef.current.querySelector('#plate-shape');
    const platterPath = plateRef.current.querySelector('#platter-shape');

    if (platePath && platterPath) {
      tl.set(plateRef.current, { opacity: 1 });
      tl.fromTo(
        plateRef.current,
        {
          scale: 0.6,
          rotation: -15,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
        }
      );

      // Morph plate to platter after entrance
      tl.to(
        platePath,
        {
          morphSVG: platterPath as any,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '+=0.3'
      );
    }

    // Headline reveal with SplitText (RTL)
    const split = new SplitText(headlineRef.current, {
      type: 'words,chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    tl.fromTo(
      split.words,
      {
        opacity: 0,
        rotationX: -90,
        y: 50,
        transformOrigin: '100% 50%',
      },
      {
        opacity: 1,
        rotationX: 0,
        y: 0,
        duration: 0.8,
        stagger: {
          each: 0.08,
          from: 'end', // RTL: start from right
        },
        ease: 'back.out(2)',
      },
      '-=0.8'
    );

    // Subtext reveal
    tl.fromTo(
      '.hero-subtext',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.4'
    );

    // Items "drop" onto platter with stagger
    tl.fromTo(
      '.platter-item',
      {
        opacity: 0,
        y: -60,
        scale: 0.5,
        rotation: () => gsap.utils.random(-20, 20),
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: {
          each: 0.1,
          from: 'random',
        },
        ease: 'bounce.out',
      },
      '-=0.5'
    );

    // CTA entrance
    tl.fromTo(
      '.hero-cta',
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      },
      '-=0.3'
    );

    // Steam particles infinite loop
    steamRefs.current.forEach((steam, i) => {
      if (!steam) return;

      gsap.to(steam, {
        y: -100,
        opacity: 0,
        scale: 1.5,
        duration: 3 + i * 0.5,
        repeat: -1,
        delay: i * 0.8,
        ease: 'sine.inOut',
      });
    });

    // Specular highlight sweep on platter
    const highlight = plateRef.current.querySelector('.specular-highlight');
    if (highlight) {
      tl.fromTo(
        highlight,
        {
          x: '-100%',
          opacity: 0,
        },
        {
          x: '200%',
          opacity: 0.6,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '-=0.5'
      );
    }

    return () => {
      split.revert();
    };
  }, [prefersReducedMotion]);

  const handleCTAClick = () => {
    const configurator = document.getElementById('catering-configurator');
    if (configurator) {
      configurator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--brand-cream)] to-[var(--brand-beige)] ${className}`}
    >
      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C4A27' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12">
            {/* Headline with SplitText animation */}
            <h1
              ref={headlineRef}
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--brand-black)] mb-6 leading-tight"
              style={{ direction: 'rtl' }}
            >
              מגשי אירוח מושלמים לכל אירוע
            </h1>

            {/* Subtext */}
            <p className="hero-subtext text-xl md:text-2xl text-[var(--text-gray)] max-w-3xl mx-auto mb-8">
              מבחר מנות מרוקאיות אותנטיות, הכנה טרייה, והגעה עד אליכם
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">✓</span>
                <span className="font-medium">מינימום 10 סועדים</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">🚚</span>
                <span className="font-medium">משלוח עד הבית</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">⭐</span>
                <span className="font-medium">התאמה אישית מלאה</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCTAClick}
              className="hero-cta inline-flex items-center gap-3 bg-[var(--brand-red)] text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-[var(--brand-orange)] transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              data-magnetic
            >
              בואו נתכנן את המגש שלכם
              <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Platter SVG with morph animation */}
          <div className="relative flex justify-center items-center min-h-[400px]">
            <svg
              ref={plateRef}
              viewBox="0 0 600 400"
              className="w-full max-w-3xl opacity-0"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(124, 74, 39, 0.15))' }}
            >
              <defs>
                {/* Gradient for platter */}
                <radialGradient id="platterGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#F5E4D2" />
                  <stop offset="50%" stopColor="#E7D7C3" />
                  <stop offset="100%" stopColor="#C7A88C" />
                </radialGradient>

                {/* Specular highlight */}
                <linearGradient id="specularGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Plate shape (starting state) */}
              <ellipse
                id="plate-shape"
                cx="300"
                cy="200"
                rx="150"
                ry="150"
                fill="url(#platterGradient)"
                stroke="#7C4A27"
                strokeWidth="3"
              />

              {/* Platter shape (morph target - hidden) */}
              <ellipse
                id="platter-shape"
                cx="300"
                cy="200"
                rx="250"
                ry="120"
                fill="url(#platterGradient)"
                stroke="#7C4A27"
                strokeWidth="3"
                opacity="0"
              />

              {/* Decorative pattern on platter rim */}
              <ellipse
                cx="300"
                cy="200"
                rx="145"
                ry="145"
                fill="none"
                stroke="#7C4A27"
                strokeWidth="1"
                strokeDasharray="4 8"
                opacity="0.4"
              />

              {/* Specular highlight sweep */}
              <rect
                className="specular-highlight"
                x="0"
                y="100"
                width="200"
                height="200"
                fill="url(#specularGradient)"
                opacity="0"
              />
            </svg>

            {/* Items that "drop" onto platter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full max-w-3xl h-[400px]">
                {/* Food item representations */}
                <div className="platter-item absolute top-[35%] left-[25%] w-16 h-16 rounded-full bg-gradient-to-br from-[#D34A2F] to-[#E0723E] shadow-lg" />
                <div className="platter-item absolute top-[30%] right-[28%] w-14 h-14 rounded-full bg-gradient-to-br from-[#7C4A27] to-[#C7A88C] shadow-lg" />
                <div className="platter-item absolute top-[45%] left-[35%] w-12 h-12 rounded-full bg-gradient-to-br from-[#4F6A3C] to-[#7C9A6D] shadow-lg" />
                <div className="platter-item absolute top-[50%] right-[35%] w-16 h-16 rounded-full bg-gradient-to-br from-[#E0723E] to-[#F5E4D2] shadow-lg" />
                <div className="platter-item absolute bottom-[35%] left-[30%] w-14 h-14 rounded-full bg-gradient-to-br from-[#D34A2F] to-[#7C4A27] shadow-lg" />
                <div className="platter-item absolute bottom-[32%] right-[30%] w-12 h-12 rounded-full bg-gradient-to-br from-[#C7A88C] to-[#E7D7C3] shadow-lg" />
              </div>
            </div>

            {/* Steam particles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) steamRefs.current[i] = el;
                }}
                className="absolute w-3 h-3 bg-white/30 rounded-full blur-sm"
                style={{
                  left: `${40 + i * 5}%`,
                  top: '50%',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--brand-beige)] to-transparent pointer-events-none" />
    </section>
  );
}
