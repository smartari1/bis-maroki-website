'use client';

import { motion } from 'framer-motion';
import { rotateIn } from '@/lib/animations/variants';
import { useScrollAnimation } from '@/lib/animations/hooks';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Consistent section heading with pattern underline
 * Animated entrance with rotate + fade
 */
export default function SectionHeading({ title, subtitle, className = '' }: SectionHeadingProps) {
  const scrollProps = useScrollAnimation();

  return (
    <motion.div
      {...scrollProps}
      variants={rotateIn}
      className={`text-center mb-12 ${className}`}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-gray mb-6">{subtitle}</p>
      )}
      <div className="w-24 h-1 bg-brand-red mx-auto rounded-full" />
    </motion.div>
  );
}
