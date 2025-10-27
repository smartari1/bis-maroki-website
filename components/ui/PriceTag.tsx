interface PriceTagProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Styled price display in ILS with brand orange color
 */
export default function PriceTag({ price, size = 'md' }: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <span className={`${sizeClasses[size]} font-bold text-brand-orange`}>
      ₪{price}
    </span>
  );
}
