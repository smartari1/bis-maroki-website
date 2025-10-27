import StarRating from './StarRating';

interface TestimonialCardProps {
  name: string;
  quote: string;
  rating: number;
  date?: string;
  variant?: 'large' | 'small';
}

/**
 * Testimonial card with quote, rating, and customer info
 * Large: Featured testimonial, Small: Grid testimonials
 */
export default function TestimonialCard({
  name,
  quote,
  rating,
  date,
  variant = 'small'
}: TestimonialCardProps) {
  const isLarge = variant === 'large';

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isLarge ? 'p-8' : ''}`}>
      {/* Quote */}
      <div className="mb-4">
        <svg
          className="w-8 h-8 text-brand-orange mb-2 opacity-40"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
        <p className={`text-brand-black ${isLarge ? 'text-2xl' : 'text-lg'} leading-relaxed`}>
          "{quote}"
        </p>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={rating} />
      </div>

      {/* Customer info */}
      <div className="flex items-center gap-3">
        {/* Avatar with initials */}
        <div className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-brand-black">{name}</p>
          {date && <p className="text-sm text-text-gray">{date}</p>}
        </div>
      </div>
    </div>
  );
}
