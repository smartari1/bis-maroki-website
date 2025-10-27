'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/dist/MotionPathPlugin';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: TimelineStep[] = [
  {
    number: '01',
    title: 'בחירת מנות',
    description: 'בחרו מתוך מבחר המנות האותנטיות שלנו או התאימו מגש אישי',
    icon: '🍽️',
  },
  {
    number: '02',
    title: 'קביעת כמות',
    description: 'ספרו לנו כמה סועדים צפויים והכינו את הכמות המתאימה',
    icon: '👥',
  },
  {
    number: '03',
    title: 'אישור הזמנה',
    description: 'שלחו לנו את ההזמנה בוואטסאפ ונאשר את כל הפרטים',
    icon: '✅',
  },
  {
    number: '04',
    title: 'הכנה טרייה',
    description: 'נכין עבורכם את כל המנות בטריות מירבית ביום האירוע',
    icon: '👨‍🍳',
  },
  {
    number: '05',
    title: 'משלוח והגעה',
    description: 'נגיע אליכם בזמן עם המגשים ארוזים ומוכנים להגשה',
    icon: '🚚',
  },
];

interface HowItWorksTimelineProps {
  className?: string;
}

export function HowItWorksTimeline({ className = '' }: HowItWorksTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current || !pathRef.current || !plateRef.current) return;

    if (prefersReducedMotion) {
      // Simple fade-in for reduced motion
      gsap.fromTo(
        '.timeline-step',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 20%',
        end: 'bottom 80%',
        scrub: 1,
      },
    });

    // Animate plate along the path
    tl.to(plateRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      duration: 1,
      ease: 'none',
    });

    // Animate steps entrance on scroll
    gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((step, i) => {
      gsap.fromTo(
        step,
        {
          opacity: 0,
          x: i % 2 === 0 ? 80 : -80,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className={`relative py-32 px-6 bg-gradient-to-b from-white to-[var(--brand-cream)] overflow-hidden ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--brand-brown) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--brand-black)] mb-4">
            איך זה עובד?
          </h2>
          <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
            חמישה שלבים פשוטים למגש אירוח מושלם
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* SVG Path for plate animation */}
          <svg
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-red)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--brand-orange)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={`M 0 0 Q -50 ${steps.length * 150 * 0.2} 0 ${steps.length * 150 * 0.4} T 0 ${steps.length * 150}`}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeDasharray="10 5"
            />
          </svg>

          {/* Animated Plate */}
          <div
            ref={plateRef}
            className="absolute top-0 left-1/2 w-16 h-16 transform -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[var(--brand-beige)] to-[var(--brand-cream)] rounded-full border-4 border-[var(--brand-brown)] shadow-xl" />
          </div>

          {/* Timeline Steps */}
          <div className="relative space-y-24" style={{ zIndex: 3 }}>
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`timeline-step flex items-center gap-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Side */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
                    {/* Step Number */}
                    <div
                      className={`text-6xl font-bold text-[var(--brand-red)] opacity-20 mb-2 ${
                        index % 2 === 0 ? 'text-right' : 'text-left'
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="text-5xl mb-4">{step.icon}</div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[var(--brand-black)] mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-[var(--text-gray)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Point (hidden, used for spacing) */}
                <div className="w-2 h-2 bg-transparent flex-shrink-0" />

                {/* Empty Side for alternating layout */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg text-[var(--text-gray)] mb-6">
            מוכנים להתחיל? בואו נתכנן את המגש המושלם שלכם
          </p>
          <button
            onClick={() => {
              const configurator = document.getElementById('catering-configurator');
              if (configurator) {
                configurator.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-3 bg-[var(--brand-red)] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[var(--brand-orange)] transition-all hover:scale-105 shadow-lg"
            data-magnetic
          >
            בואו נתחיל
            <svg
              className="w-6 h-6 rotate-180"
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
        </div>
      </div>
    </section>
  );
}
