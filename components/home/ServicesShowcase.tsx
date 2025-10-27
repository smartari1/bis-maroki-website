'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  overlayImage: string;
  ctaLabel: string;
  ctaHref: string;
}

interface ServicesShowcaseProps {
  services: ServiceCard[];
}

/**
 * GSAP ScrollTrigger Pinned Services Showcase Section
 * Features:
 * - Section pins while user scrolls through 300vh
 * - Slides change based on scroll progress (0-33%, 33-66%, 66-100%)
 * - Parallax image effects
 * - Counter animation
 * - CTA buttons to service pages
 */
export default function ServicesShowcase({ services }: ServicesShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || services.length === 0) return;

    const container = containerRef.current;
    const sections = gsap.utils.toArray<HTMLElement>('.service-slide');
    const outerWrappers = gsap.utils.toArray<HTMLElement>('.service-slide__outer');
    const innerWrappers = gsap.utils.toArray<HTMLElement>('.service-slide__inner');
    const overlayImages = gsap.utils.toArray<HTMLElement>('.service-overlay-image');

    // Initial setup
    gsap.set(outerWrappers, { xPercent: 100 });
    gsap.set(innerWrappers, { xPercent: -100 });
    gsap.set('.service-slide:nth-of-type(1) .service-slide__outer', { xPercent: 0 });
    gsap.set('.service-slide:nth-of-type(1) .service-slide__inner', { xPercent: 0 });

    // Set initial visibility
    gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 });
    gsap.set(overlayImages[0], { zIndex: 1, autoAlpha: 1 });

    function gotoSection(index: number, direction: number) {
      if (animatingRef.current || index === lastIndexRef.current) return;

      animatingRef.current = true;
      const currentIdx = lastIndexRef.current;
      lastIndexRef.current = index;

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'expo.inOut' },
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      const currentSection = sections[currentIdx];
      const nextSection = sections[index];
      const currentHeading = currentSection?.querySelector('.service-slide__heading') as HTMLElement;
      const nextHeading = nextSection?.querySelector('.service-slide__heading') as HTMLElement;
      const currentDesc = currentSection?.querySelector('.service-slide__description') as HTMLElement;
      const nextDesc = nextSection?.querySelector('.service-slide__description') as HTMLElement;
      const currentCTA = currentSection?.querySelector('.service-slide__cta') as HTMLElement;
      const nextCTA = nextSection?.querySelector('.service-slide__cta') as HTMLElement;

      // Set z-index and visibility
      gsap.set(sections, { zIndex: 0, autoAlpha: 0 });
      gsap.set(sections[currentIdx], { zIndex: 1, autoAlpha: 1 });
      gsap.set(sections[index], { zIndex: 2, autoAlpha: 1 });

      if (overlayImages[index]) {
        gsap.set(overlayImages, { zIndex: 0, autoAlpha: 0 });
        gsap.set(overlayImages[index], { zIndex: 1, autoAlpha: 1 });
      }

      tl.fromTo(
        outerWrappers[index],
        { xPercent: 100 * direction },
        { xPercent: 0 },
        0
      )
        .fromTo(
          innerWrappers[index],
          { xPercent: -100 * direction },
          { xPercent: 0 },
          0
        )
        .to(
          currentHeading,
          {
            xPercent: 30 * direction,
            opacity: 0,
          },
          0
        )
        .fromTo(
          nextHeading,
          {
            xPercent: -30 * direction,
            opacity: 0,
          },
          {
            xPercent: 0,
            opacity: 1,
          },
          0
        )
        .to(
          currentDesc,
          {
            opacity: 0,
            y: 20 * direction,
          },
          0
        )
        .fromTo(
          nextDesc,
          {
            opacity: 0,
            y: -20 * direction,
          },
          {
            opacity: 1,
            y: 0,
          },
          0.2
        )
        .to(
          currentCTA,
          {
            opacity: 0,
            scale: 0.9,
          },
          0
        )
        .fromTo(
          nextCTA,
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
          },
          0.4
        )
        .timeScale(0.8);

      setCurrentIndex(index);
    }

    // Create ScrollTrigger to pin the section and track progress
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=300%', // 3 slides × 100vh each
      pin: true,
      anticipatePin: 1,
      scrub: false,
      onUpdate: (self) => {
        // Calculate which slide should be active based on scroll progress
        const progress = self.progress; // 0 to 1
        let targetIndex = 0;

        if (progress < 0.33) {
          targetIndex = 0; // First slide
        } else if (progress < 0.66) {
          targetIndex = 1; // Second slide
        } else {
          targetIndex = 2; // Third slide
        }

        // Only trigger transition if index actually changed
        if (targetIndex !== lastIndexRef.current) {
          const direction = targetIndex > lastIndexRef.current ? 1 : -1;
          gotoSection(targetIndex, direction);
        }
      },
    });

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [services.length]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden bg-brand-cream">
      {/* Service Slides */}
      {services.map((service, index) => (
        <section
          key={index}
          className="service-slide absolute inset-0 w-full h-full"
          style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
        >
          <div className="service-slide__outer w-full h-full overflow-hidden">
            <div className="service-slide__inner w-full h-full">
              <div
                className="service-slide__content absolute inset-0 flex items-center justify-center"
                style={{
                  backgroundColor: index === 0 ? '#7C4A27' :
                                   index === 1 ? '#6d597a' :
                                   index === 2 ? '#355070' : '#9a8c98',
                }}
              >
                <div className="service-slide__container relative max-w-7xl w-full mx-auto px-8 h-[90vh] grid grid-cols-10 grid-rows-10 gap-4 pt-[88px]">
                  {/* Heading */}
                  <h2 className="service-slide__heading text-brand-cream text-7xl md:text-9xl font-bold mix-blend-difference col-start-2 col-end-10 row-start-2 row-end-3 self-end relative z-20">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="service-slide__description text-brand-cream text-xl md:text-2xl leading-relaxed col-start-2 col-end-8 row-start-3 row-end-5 relative z-20">
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <div className="service-slide__cta col-start-2 col-end-6 row-start-5 row-end-6 relative z-20">
                    <Link
                      href={service.ctaHref}
                      className="inline-block px-8 py-4 bg-brand-orange text-white font-bold text-lg rounded-lg hover:bg-brand-red transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {service.ctaLabel}
                    </Link>
                  </div>

                  {/* Small Image */}
                  <figure className="service-slide__img-cont col-start-1 col-end-7 row-start-6 row-end-10 overflow-hidden rounded-lg shadow-2xl">
                    <img
                      className="service-slide__img w-full h-full object-cover"
                      src={service.image}
                      alt={service.title}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Overlay with counter and large images */}
      <section className="service-overlay absolute inset-0 z-10 pointer-events-none">
        <div className="service-overlay__content max-w-7xl w-full mx-auto px-8 h-[90vh] grid grid-cols-10 grid-rows-10 gap-4 pt-[88px]">
          {/* Counter */}
          <p className="service-overlay__count col-start-10 row-start-3 text-6xl md:text-8xl text-white text-right border-b-4 border-white m-0 p-0">
            0{currentIndex + 1}
          </p>

          {/* Large overlay images */}
          <figure className="service-overlay__img-cont relative overflow-hidden col-start-7 col-end-11 row-start-4 row-end-9 rounded-lg shadow-2xl">
            {services.map((service, index) => (
              <img
                key={index}
                className="service-overlay-image absolute inset-0 w-full h-full object-cover"
                src={service.overlayImage}
                alt={service.title}
                style={{ opacity: index === 0 ? 1 : 0 }}
              />
            ))}
          </figure>
        </div>
      </section>

      {/* Instructions */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-20 pointer-events-none">
        <p className="text-center">גלול כדי לראות את כל השירותים שלנו</p>
      </div>
    </div>
  );
}
