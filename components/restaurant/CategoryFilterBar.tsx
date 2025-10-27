'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGsapContext } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  _id: string;
  name_he: string;
  slug: string;
}

interface CategoryFilterBarProps {
  categories: Category[];
}

export function CategoryFilterBar({ categories }: CategoryFilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Pin filter bar on scroll
      ScrollTrigger.create({
        trigger: '.filter-bar',
        start: 'top 80px', // Below header
        endTrigger: '.menu-section',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);

    // Smooth scroll to category section or top of menu
    if (slug === 'all') {
      document.querySelector('.menu-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      const categorySection = document.querySelector(
        `[data-category="${slug}"]`
      );
      if (categorySection) {
        const offset = 160; // Account for sticky filter bar
        const elementPosition = categorySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }

    // Animate underline
    const pill = document.querySelector(
      `[data-pill="${slug}"]`
    ) as HTMLElement;
    if (pill) {
      gsap.to('.pill-underline', {
        width: pill.offsetWidth,
        x: pill.offsetLeft,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  return (
    <div ref={containerRef} className="filter-bar-wrapper">
      <div className="filter-bar bg-white shadow-md py-4 z-40">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Pills Container */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
              {/* All Pills */}
              <button
                data-pill="all"
                onClick={() => handleCategoryClick('all')}
                className={`pill flex-shrink-0 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[var(--brand-orange)] text-white'
                    : 'bg-[var(--brand-cream)] text-[var(--brand-black)] hover:bg-[var(--brand-beige)]'
                }`}
              >
                הכל
              </button>

              {categories.map((category) => (
                <button
                  key={category._id}
                  data-pill={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`pill flex-shrink-0 px-6 py-3 rounded-full font-medium transition-colors ${
                    activeCategory === category.slug
                      ? 'bg-[var(--brand-orange)] text-white'
                      : 'bg-[var(--brand-cream)] text-[var(--brand-black)] hover:bg-[var(--brand-beige)]'
                  }`}
                >
                  {category.name_he}
                </button>
              ))}
            </div>

            {/* Animated underline (desktop only) */}
            <div className="hidden md:block absolute bottom-0 right-0 h-0.5 bg-[var(--brand-orange)] pill-underline" />
          </div>

          {/* Filter count (optional) */}
          <div className="mt-2 text-sm text-[var(--text-gray)]">
            {activeCategory === 'all'
              ? 'מציג את כל המנות'
              : `מציג מנות מקטגוריית ${
                  categories.find((c) => c.slug === activeCategory)?.name_he
                }`}
          </div>
        </div>
      </div>
    </div>
  );
}
