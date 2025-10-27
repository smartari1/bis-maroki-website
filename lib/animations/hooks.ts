'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Custom React hooks for Framer Motion animations
 * Provides reusable animation logic and accessibility support
 */

/**
 * Hook for scroll-triggered animations
 * Returns props to spread onto motion components
 */
export function useScrollAnimation() {
  const shouldReduceMotion = useReducedMotion();

  return {
    initial: shouldReduceMotion ? { opacity: 1 } : "hidden",
    whileInView: shouldReduceMotion ? { opacity: 1 } : "visible",
    viewport: { once: true, margin: "-100px" }
  };
}

/**
 * Hook for hover scale interactions
 * Returns motion props for scale/tap effects
 */
export function useHoverScale() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {};
  }

  return {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  };
}

/**
 * Hook for card lift effect on hover
 * Returns motion props for lift + shadow change
 */
export function useCardLift() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {};
  }

  return {
    whileHover: {
      y: -8,
      boxShadow: 'var(--shadow-lg)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };
}

/**
 * Hook for image zoom on parent hover
 * Pass parent hover state as argument
 */
export function useImageZoom(isHovered: boolean) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return { scale: 1 };
  }

  return {
    scale: isHovered ? 1.1 : 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  };
}

/**
 * Hook for carousel direction tracking
 * Returns [direction, setDirection] for RTL-aware carousel navigation
 */
export function useCarouselDirection(): [number, (direction: number) => void] {
  const [direction, setDirection] = useState(0);
  return [direction, setDirection];
}

/**
 * Hook for auto-advance carousel
 * Returns current index and controls
 */
export function useAutoCarousel(itemCount: number, interval: number = 10000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || itemCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemCount);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, itemCount, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return {
    currentIndex,
    goToSlide,
    pause,
    resume,
    isPaused
  };
}

/**
 * Hook for viewport detection (mobile/desktop)
 * Useful for conditional animations
 */
export function useViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return { isMobile };
}

/**
 * Hook for intersection observer (for lazy animations)
 * Returns ref and isInView state
 */
export function useInView(options = {}) {
  const [ref, setRef] = useState<Element | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.2, ...options });

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return { ref: setRef, isInView };
}
