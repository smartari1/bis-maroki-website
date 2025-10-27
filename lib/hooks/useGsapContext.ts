'use client';

import { useEffect, useRef, DependencyList, RefObject } from 'react';
import gsap from 'gsap';

/**
 * GSAP Context Hook
 * Automatically creates and reverts GSAP context for cleanup
 * Usage:
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useGsapContext(() => {
 *   gsap.to('.element', { x: 100 });
 * }, [dependency]);
 * ```
 */
export function useGsapContext(
  callback: () => void | (() => void),
  deps: DependencyList = []
) {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const cleanupFn = callbackRef.current();

    return () => {
      if (typeof cleanupFn === 'function') {
        cleanupFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * GSAP Timeline Hook
 * Creates a GSAP timeline with automatic cleanup
 * Usage:
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useGsapTimeline((tl) => {
 *   tl.to('.element', { x: 100 })
 *     .to('.element', { y: 100 });
 * }, containerRef);
 * ```
 */
export function useGsapTimeline(
  callback: (timeline: gsap.core.Timeline) => void,
  scope?: RefObject<HTMLElement>,
  deps: DependencyList = []
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      callback(tl);
      return tl;
    }, scope?.current || undefined);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Reduced Motion Hook
 * Detects if user prefers reduced motion
 * Returns true if reduced motion is preferred
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * useGsapContext(() => {
 *   if (prefersReducedMotion) return;
 *   gsap.to('.element', { x: 100 });
 * }, [prefersReducedMotion]);
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useGsapMatchMedia('(prefers-reduced-motion: reduce)');

  return prefersReducedMotion;
}

/**
 * GSAP MatchMedia Hook
 * Reactive media query hook that returns match state
 * Usage:
 * ```tsx
 * const [isMobile] = useGsapMatchMedia('(max-width: 768px)');
 *
 * useGsapContext(() => {
 *   gsap.to('.element', {
 *     x: isMobile ? 50 : 100
 *   });
 * }, [isMobile]);
 * ```
 */
export function useGsapMatchMedia(query: string): [boolean, MediaQueryList | null] {
  const [matches, setMatches] = useGsapState(false);
  const [mediaQuery, setMediaQuery] = useGsapState<MediaQueryList | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(query);
    setMediaQuery(mq);
    setMatches(mq.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [query]);

  return [matches, mediaQuery];
}

/**
 * Simple state hook for GSAP context (internal utility)
 */
function useGsapState<T>(initialValue: T): [T, (value: T) => void] {
  const [state, setState] = useGsapStateInternal(initialValue);
  return [state, setState];
}

// Re-export useState with a different name to avoid confusion
import { useState as useGsapStateInternal } from 'react';

/**
 * Safe Duration Helper
 * Returns 0 if reduced motion is preferred, otherwise returns the duration
 * Usage:
 * ```tsx
 * const duration = safeDuration(1.5, prefersReducedMotion);
 * gsap.to('.element', { x: 100, duration });
 * ```
 */
export function safeDuration(
  duration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0 : duration;
}

/**
 * Safe Ease Helper
 * Returns 'none' if reduced motion is preferred, otherwise returns the ease
 * Usage:
 * ```tsx
 * const ease = safeEase('power3.out', prefersReducedMotion);
 * gsap.to('.element', { x: 100, ease });
 * ```
 */
export function safeEase(
  ease: string | gsap.EaseFunction,
  prefersReducedMotion: boolean
): string | gsap.EaseFunction {
  return prefersReducedMotion ? 'none' : ease;
}
