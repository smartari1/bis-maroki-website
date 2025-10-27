'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import PriceTag from '@/components/ui/PriceTag';
import SpiceIndicator from '@/components/ui/SpiceIndicator';
import DietaryBadge from '@/components/ui/DietaryBadge';
import PatternButton from '@/components/ui/PatternButton';
import { staggerContainer, scaleIn } from '@/lib/animations/variants';
import { useScrollAnimation } from '@/lib/animations/hooks';

interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  spiceLevel?: number;
  isVegan?: boolean;
  isVegetarian?: boolean;
  badge?: string;
}

interface MenuShowcaseProps {
  dishes: Dish[];
}

/**
 * Menu Showcase Section - Featured dishes grid
 * Features:
 * - 6-dish grid (responsive: 3x2 → 2x3 → 1x6)
 * - Circular images with pattern borders
 * - Hover effects: card scale + image zoom
 * - Spice indicators and dietary badges
 * - Staggered grid entrance
 */
export default function MenuShowcase({ dishes }: MenuShowcaseProps) {
  const scrollProps = useScrollAnimation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-brand-cream pattern-overlay">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="התפריט שלנו"
          subtitle="מבחר מנות אותנטיות מהמטבח המרוקאי"
        />

        <motion.div
          {...scrollProps}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              variants={scaleIn}
              custom={index}
              onHoverStart={() => setHoveredId(dish.id)}
              onHoverEnd={() => setHoveredId(null)}
              whileHover={{
                scale: 1.03,
                boxShadow: 'var(--shadow-lg)',
              }}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredId === dish.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === dish.id ? 1 : 0 }}
                  className="absolute inset-0 bg-brand-orange/10"
                />

                {/* Badge */}
                {dish.badge && (
                  <div className="absolute top-4 right-4 bg-brand-red text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {dish.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-brand-black mb-2">
                  {dish.title}
                </h3>

                <p className="text-text-gray mb-4 leading-relaxed">
                  {dish.description}
                </p>

                {/* Dietary & Spice */}
                <div className="flex items-center gap-3 mb-4">
                  {dish.spiceLevel && <SpiceIndicator level={dish.spiceLevel} />}
                  <DietaryBadge
                    isVegan={dish.isVegan}
                    isVegetarian={dish.isVegetarian}
                  />
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <PriceTag price={dish.price} size="md" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-brand-red font-semibold hover:text-brand-orange transition-colors"
                    data-interactive
                  >
                    להזמנה ←
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to full menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <PatternButton href="/menu" variant="primary">
            לתפריט המלא
          </PatternButton>
        </motion.div>
      </div>
    </section>
  );
}
