'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useHoverScale } from '@/lib/animations/hooks';

interface PatternButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * CTA button with brand gradient and hover effects
 * Primary: Gradient spice background
 * Secondary: Border with transparent background
 */
export default function PatternButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = ''
}: PatternButtonProps) {
  const hoverProps = useHoverScale();

  const baseClasses = 'px-6 py-3 rounded-lg font-bold transition-all duration-300 inline-block text-center';

  const variantClasses = {
    primary: 'gradient-spice text-white shadow-md hover:shadow-lg',
    secondary: 'border-2 border-white bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 hover:shadow-xl'
  };

  const Component = href ? motion.a : motion.button;
  const extraProps = href ? { href } : { onClick, type: 'button' as const };

  return (
    <Component
      {...extraProps}
      {...hoverProps}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      data-interactive
    >
      {children}
    </Component>
  );
}
