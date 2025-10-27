'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import { useGsapContext } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

interface Dish {
  _id: string;
  title_he: string;
  slug: string;
  description_he: any;
  price: number;
  categoryIds: Array<{
    _id: string;
    name_he: string;
    slug: string;
  }>;
  spiceLevel: number;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  mediaIds: Array<{
    url: string;
    thumbnailUrl: string;
    alt_he: string;
  }>;
  badges: string[];
  availability: string;
}

interface DishDetailModalProps {
  dish: Dish;
  onClose: () => void;
  onlineOrderUrl: string;
}

export function DishDetailModal({ dish, onClose, onlineOrderUrl }: DishDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!modalRef.current) return;

    const ctx = gsap.context(() => {
      // Modal entrance animation
      gsap.from('.modal-backdrop', {
        opacity: 0,
        duration: 0.3,
      });

      gsap.from('.modal-content', {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });

      // Ingredient chips entrance
      gsap.from('.ingredient-chip', {
        scale: 0,
        opacity: 0,
        stagger: {
          from: 'center',
          amount: 0.4,
        },
        ease: 'back.out(2)',
        delay: 0.3,
      });
    }, modalRef);

    return () => ctx.revert();
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 20;
    const y = ((e.clientY - top) / height - 0.5) * 20;
    gsap.to(img, { x, y, scale: 1.2, duration: 0.3 });
  };

  const handleImageMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, scale: 1, duration: 0.5 });
  };

  return (
    <div
      ref={modalRef}
      className="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="modal-content bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          aria-label="סגור"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Section */}
        <div className="relative">
          <div
            className="modal-image h-96 bg-[var(--brand-beige)] overflow-hidden cursor-move"
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
          >
            {dish.mediaIds[0] ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${dish.mediaIds[0].url})`,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-[var(--brand-brown)] opacity-20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            )}
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            {dish.isVegan && (
              <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                טבעוני
              </span>
            )}
            {dish.isVegetarian && !dish.isVegan && (
              <span className="px-4 py-2 bg-green-400 text-white text-sm font-bold rounded-full shadow-lg">
                צמחוני
              </span>
            )}
            {dish.badges?.includes('מומלץ') && (
              <span className="px-4 py-2 bg-[var(--brand-orange)] text-white text-sm font-bold rounded-full shadow-lg">
                מומלץ
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-[var(--brand-black)] mb-2">
                {dish.title_he}
              </h2>

              {/* Category Tags */}
              <div className="flex gap-2">
                {dish.categoryIds.map((cat) => (
                  <span
                    key={cat._id}
                    className="text-sm text-[var(--text-gray)] bg-[var(--brand-cream)] px-3 py-1 rounded-full"
                  >
                    {cat.name_he}
                  </span>
                ))}
              </div>
            </div>

            {dish.price > 0 && (
              <div className="text-left">
                <span className="text-4xl font-bold text-[var(--brand-orange)]">
                  ₪{dish.price}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {dish.description_he?.blocks && (
            <div className="mb-6">
              {dish.description_he.blocks.map((block: any, i: number) => (
                <p key={i} className="text-lg text-[var(--text-gray)] leading-relaxed">
                  {block.data.text}
                </p>
              ))}
            </div>
          )}

          {/* Spice Level */}
          {dish.spiceLevel > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--brand-black)] mb-2">
                רמת חריפות
              </h3>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < dish.spiceLevel ? 'opacity-100' : 'opacity-20 grayscale'
                    }`}
                    role="img"
                    aria-label="חריף"
                  >
                    🌶️
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--brand-black)] mb-3">
                אלרגנים
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen, i) => (
                  <span
                    key={i}
                    className="ingredient-chip px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-200"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Flags */}
          <div className="flex flex-wrap gap-4 mb-8">
            {dish.isVegan && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">טבעוני</span>
              </div>
            )}
            {dish.isGlutenFree && (
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">ללא גלוטן</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <a
            href={onlineOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[var(--brand-orange)] text-white rounded-xl font-bold text-lg hover:bg-[var(--brand-red)] transition-colors text-center"
          >
            הזמן עכשיו
          </a>
        </div>
      </div>
    </div>
  );
}
