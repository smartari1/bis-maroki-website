'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Flip } from 'gsap/dist/Flip';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { DishDetailModal } from './DishDetailModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip);
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

interface Category {
  _id: string;
  name_he: string;
  slug: string;
}

interface MenuGridProps {
  dishes: Dish[];
  categories: Category[];
  onlineOrderUrl: string;
}

export function MenuGrid({ dishes, categories, onlineOrderUrl }: MenuGridProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Batch entrance for cards
      ScrollTrigger.batch('.dish-card', {
        onEnter: (batch) => {
          gsap.from(batch, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            rotation: -3,
            stagger: {
              from: 'end', // RTL
              amount: 0.4,
            },
            ease: 'back.out(1.7)',
          });
        },
        start: 'top 85%',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
  };

  // Group dishes by category
  const dishesByCategory = categories.map((category) => ({
    category,
    dishes: dishes.filter((dish) =>
      dish.categoryIds.some((c) => c._id === category._id)
    ),
  }));

  return (
    <>
      <section
        ref={containerRef}
        className="menu-section py-20 bg-[var(--brand-cream)]"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[var(--brand-black)] text-center mb-12">
            התפריט שלנו
          </h2>

          {/* Dishes grouped by category */}
          {dishesByCategory.map(
            ({ category, dishes: categoryDishes }) =>
              categoryDishes.length > 0 && (
                <div
                  key={category._id}
                  data-category={category.slug}
                  className="mb-16"
                >
                  {/* Category Title */}
                  <h3 className="text-3xl font-bold text-[var(--brand-black)] mb-8 sticky top-40 bg-[var(--brand-cream)] py-2 z-10">
                    {category.name_he}
                  </h3>

                  {/* Dish Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className="dish-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => handleDishClick(dish)}
                      >
                        {/* Image */}
                        <div className="relative h-56 bg-[var(--brand-beige)] overflow-hidden">
                          {dish.mediaIds[0] ? (
                            <div
                              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                              style={{
                                backgroundImage: `url(${
                                  dish.mediaIds[0].thumbnailUrl ||
                                  dish.mediaIds[0].url
                                })`,
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-24 h-24 text-[var(--brand-brown)] opacity-20"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                            </div>
                          )}

                          {/* Info Overlay */}
                          <div className="info-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-medium">
                              לחץ לפרטים נוספים
                            </span>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            {dish.isVegan && (
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                טבעוני
                              </span>
                            )}
                            {dish.isVegetarian && !dish.isVegan && (
                              <span className="px-3 py-1 bg-green-400 text-white text-xs font-bold rounded-full">
                                צמחוני
                              </span>
                            )}
                            {dish.badges?.includes('מומלץ') && (
                              <span className="px-3 py-1 bg-[var(--brand-orange)] text-white text-xs font-bold rounded-full">
                                מומלץ
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-xl font-bold text-[var(--brand-black)] group-hover:text-[var(--brand-orange)] transition-colors">
                              {dish.title_he}
                            </h4>

                            {/* Spice Level */}
                            {dish.spiceLevel > 0 && (
                              <div className="flex gap-0.5">
                                {[...Array(dish.spiceLevel)].map((_, i) => (
                                  <span key={i} className="text-lg" role="img" aria-label="חריף">
                                    🌶️
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {dish.description_he?.blocks?.[0]?.data?.text && (
                            <p className="text-[var(--text-gray)] text-sm mb-4 line-clamp-2">
                              {dish.description_he.blocks[0].data.text}
                            </p>
                          )}

                          {/* Price and Availability */}
                          <div className="flex items-center justify-between">
                            {dish.price > 0 && (
                              <span className="text-2xl font-bold text-[var(--brand-orange)]">
                                ₪{dish.price}
                              </span>
                            )}

                            {dish.availability === 'OUT_OF_STOCK' && (
                              <span className="text-sm text-red-500 font-medium">
                                אזל מהמלאי
                              </span>
                            )}
                          </div>

                          {/* Dietary Icons */}
                          <div className="flex gap-2 mt-4">
                            {dish.isGlutenFree && (
                              <span className="text-xs text-[var(--text-gray)]" title="ללא גלוטן">
                                🌾❌
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}

          {/* Empty State */}
          {dishes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-[var(--text-gray)]">
                אין מנות להצגה כרגע
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onlineOrderUrl={onlineOrderUrl}
        />
      )}
    </>
  );
}
