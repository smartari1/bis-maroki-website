'use client';

import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { slideCarousel } from '@/lib/animations/variants';
import { useAutoCarousel } from '@/lib/animations/hooks';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  date?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

/**
 * Testimonials Section - Auto-advancing carousel
 * Features:
 * - Large featured testimonial with auto-advance (10s)
 * - 3 smaller testimonials in grid below
 * - Manual navigation dots
 * - Pause on hover
 * - Slide transitions with AnimatePresence
 */
export default function Testimonials({ testimonials }: TestimonialsProps) {
  const { currentIndex, goToSlide, pause, resume } = useAutoCarousel(testimonials.length, 10000);
  const featured = testimonials[currentIndex];
  const gridTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-20 bg-brand-beige pattern-overlay">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="לקוחות מספרים"
          subtitle="מה אומרים עלינו הלקוחות שלנו"
        />

        {/* Featured Testimonial Carousel */}
        <div
          className="max-w-3xl mx-auto mb-12"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentIndex}
              custom={1}
              variants={slideCarousel}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <TestimonialCard
                name={featured.name}
                quote={featured.quote}
                rating={featured.rating}
                date={featured.date}
                variant="large"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-brand-red w-8'
                    : 'bg-border-light hover:bg-border-strong'
                }`}
                aria-label={`עבור לחוות דעת ${index + 1}`}
                data-interactive
              />
            ))}
          </div>
        </div>

        {/* Grid of smaller testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {gridTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard
                name={testimonial.name}
                quote={testimonial.quote}
                rating={testimonial.rating}
                date={testimonial.date}
                variant="small"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-xl text-brand-black font-semibold mb-4">
            רוצים לחוות בעצמכם?
          </p>
          <motion.a
            href="/restaurant"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-spice text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
            data-interactive
          >
            הזמינו שולחן עכשיו
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
