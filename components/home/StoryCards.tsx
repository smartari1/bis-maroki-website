'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryCard {
  title: string;
  description: string;
  image: string;
  overlayImage: string;
  icon?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface StoryCardsProps {
  cards: StoryCard[];
}

/**
 * GSAP ScrollTrigger Pinned Story Cards Section
 * Features:
 * - Section pins while user scrolls through 300vh
 * - Slides change based on scroll progress (0-33%, 33-66%, 66-100%)
 * - Parallax image effects
 * - Counter animation
 * - No auto-scroll - only manual scroll/swipe
 */
export default function StoryCards({ cards }: StoryCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || cards.length === 0) return;

    const container = containerRef.current;
    const sections = gsap.utils.toArray<HTMLElement>('.story-slide');
    const outerWrappers = gsap.utils.toArray<HTMLElement>('.story-slide__outer');
    const innerWrappers = gsap.utils.toArray<HTMLElement>('.story-slide__inner');
    const overlayImages = gsap.utils.toArray<HTMLElement>('.story-overlay-image');

    // Initial setup
    gsap.set(outerWrappers, { xPercent: 100 });
    gsap.set(innerWrappers, { xPercent: -100 });
    gsap.set('.story-slide:nth-of-type(1) .story-slide__outer', { xPercent: 0 });
    gsap.set('.story-slide:nth-of-type(1) .story-slide__inner', { xPercent: 0 });

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
      const currentHeading = currentSection?.querySelector('.story-slide__heading') as HTMLElement;
      const nextHeading = nextSection?.querySelector('.story-slide__heading') as HTMLElement;

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
  }, [cards.length]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden bg-brand-cream">
      {/* Story Slides */}
      {cards.map((card, index) => (
        <section
          key={index}
          className="story-slide absolute inset-0 w-full h-full"
          style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
        >
          <div className="story-slide__outer w-full h-full overflow-hidden">
            <div className="story-slide__inner w-full h-full">
              <div
                className="story-slide__content absolute inset-0 flex items-center justify-center"
                style={{
                  backgroundColor: index === 0 ? '#6d597a' :
                                   index === 1 ? '#355070' :
                                   index === 2 ? '#b56576' : '#9a8c98',
                }}
              >
                <div className="story-slide__container relative max-w-7xl w-full mx-auto px-8 h-[90vh] grid grid-cols-10 grid-rows-10 gap-0 pt-[88px]">
                  {/* Heading with higher z-index */}
                  <h2 className="story-slide__heading text-brand-cream text-8xl md:text-[15rem] font-bold mix-blend-difference col-start-2 col-end-10 row-start-2 row-end-3 self-end relative z-20">
                    {card.title}
                  </h2>

                  {/* Small Image */}
                  <figure className="story-slide__img-cont mt-16 col-start-1 col-end-8 row-start-2 row-end-7 overflow-hidden">
                    <img
                      className="story-slide__img w-full h-full object-cover"
                      src={card.image}
                      alt={card.title}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Overlay with counter and large images */}
      <section className="story-overlay absolute inset-0 z-10 pointer-events-none">
        <div className="story-overlay__content max-w-7xl w-full mx-auto px-8 h-[90vh] grid grid-cols-10 grid-rows-10 gap-0 pt-[88px]">
          {/* Counter */}
          <p className="story-overlay__count col-start-10 row-start-3 text-6xl md:text-8xl text-white text-right border-b-4 border-white m-0 p-0">
            0{currentIndex + 1}
          </p>

          {/* Large overlay images */}
          <figure className="story-overlay__img-cont relative overflow-hidden col-start-3 col-end-11 row-start-4 row-end-9">
            {cards.map((card, index) => (
              <img
                key={index}
                className="story-overlay-image absolute inset-0 w-full h-full object-cover"
                src={card.overlayImage}
                alt={card.title}
                style={{ opacity: index === 0 ? 1 : 0 }}
              />
            ))}
          </figure>
        </div>
      </section>

      {/* Instructions */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-20 pointer-events-none">
        <p className="text-center">גלול, החלק, או השתמש במקשי החצים</p>
      </div>
    </div>
  );
}
