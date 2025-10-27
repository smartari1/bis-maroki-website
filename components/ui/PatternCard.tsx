import { ReactNode } from 'react';

interface PatternCardProps {
  children: ReactNode;
  className?: string;
  withPattern?: boolean;
}

/**
 * Card component with optional Moroccan pattern overlay
 * Uses brand design system colors and shadows
 */
export default function PatternCard({ children, className = '', withPattern = false }: PatternCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${withPattern ? 'pattern-overlay' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
