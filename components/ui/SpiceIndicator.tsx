interface SpiceIndicatorProps {
  level: number; // 0-3
}

/**
 * Displays spice level with pepper icons (0-3)
 * Uses brand red color for filled peppers
 */
export default function SpiceIndicator({ level }: SpiceIndicatorProps) {
  if (level === 0) return null;

  return (
    <div className="flex items-center gap-1" aria-label={`רמת חריפות: ${level} מתוך 3`}>
      {[...Array(3)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < level ? 'text-brand-red' : 'text-border-light'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C10.9 2 10 2.9 10 4C10 4.8 10.4 5.5 11 5.9V7C8.8 7 7 8.8 7 11V14C7 16.2 8.8 18 11 18C11 19.1 11.9 20 13 20C14.1 20 15 19.1 15 18C17.2 18 19 16.2 19 14V11C19 8.8 17.2 7 15 7V5.9C15.6 5.5 16 4.8 16 4C16 2.9 15.1 2 14 2C13.4 2 12.9 2.3 12.5 2.7C12.3 2.3 11.7 2 12 2Z" />
        </svg>
      ))}
      <span className="text-xs text-text-gray mr-1">חריף</span>
    </div>
  );
}
