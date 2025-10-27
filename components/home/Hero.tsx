'use client';

import { motion } from 'framer-motion';
import PatternButton from '@/components/ui/PatternButton';
import { fadeInUp, fadeInRight, staggerContainer } from '@/lib/animations/variants';

interface HeroProps {
  headline: string;
  subtext: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

/**
 * Hero Section - Full viewport with brand design
 * Features:
 * - Large Hebrew headline with gradient text
 * - Floating sesame seed garnish (CSS animation)
 * - Two CTAs with staggered entrance
 * - Moroccan pattern overlay
 * - RTL-optimized animations
 */
export default function Hero({ headline, subtext, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating garnish - sesame seeds */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.img
            key={i}
            src="/assets/patterns/sesame-seed.svg"
            alt=""
            className="absolute w-3 h-4 opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-4xl mx-auto px-4 text-center"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeInRight}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
        >
          {headline.split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-3">
              {i === 0 && (
                <span className="text-brand-cream">•</span>
              )}
              {word}
            </span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-white/95 mb-10 drop-shadow-md"
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div variants={fadeInUp}>
            <PatternButton href={ctaPrimary.href} variant="primary">
              {ctaPrimary.label}
            </PatternButton>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <PatternButton href={ctaSecondary.href} variant="secondary">
              {ctaSecondary.label}
            </PatternButton>
          </motion.div>
        </motion.div>

        {/* Decorative pattern underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 mx-auto"
          style={{ transformOrigin: '100% 50%' }}
        >
          <img
            src="/assets/patterns/arabesc-border.svg"
            alt=""
            className="w-64 mx-auto opacity-40"
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <svg
          className="w-6 h-6 text-white drop-shadow-lg"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
}
