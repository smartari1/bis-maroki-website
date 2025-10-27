'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGsapContext } from '@/lib/hooks/useGsapContext';

interface Review {
  _id: string;
  customerName: string;
  customerInitials?: string;
  rating: number;
  testimonialText: string;
  isFeatured: boolean;
}

interface SocialProofProps {
  reviews: Review[];
}

export default function SocialProof({ reviews }: SocialProofProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<gsap.core.Tween | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!containerRef.current || reviews.length === 0) return;

    // Entrance animations for the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });

    // Title entrance
    tl.from('.social-proof-title', {
      opacity: 0,
      y: 30,
      rotationX: -15,
      duration: 0.7,
      ease: 'back.out(1.7)',
    });

    // Cards stagger entrance
    tl.from('.review-card', {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    }, '-=0.3');

    // Arrow buttons entrance
    tl.from('.nav-arrow', {
      opacity: 0,
      scale: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    }, '-=0.4');

  }, [reviews.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length, isPaused, activeIndex]);

  // Navigation handlers with animation
  const handleNext = () => {
    if (isTransitioning) return;

    const featuredReviews = reviews.filter(r => r.isFeatured);
    if (featuredReviews.length <= 1) return;

    setIsTransitioning(true);

    // Animate out
    gsap.to(cardRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex((prev) => (prev + 1) % featuredReviews.length);

        // Animate in
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            onComplete: () => setIsTransitioning(false),
          }
        );
      },
    });
  };

  const handlePrevious = () => {
    if (isTransitioning) return;

    const featuredReviews = reviews.filter(r => r.isFeatured);
    if (featuredReviews.length <= 1) return;

    setIsTransitioning(true);

    // Animate out
    gsap.to(cardRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex((prev) =>
          prev === 0 ? featuredReviews.length - 1 : prev - 1
        );

        // Animate in
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            onComplete: () => setIsTransitioning(false),
          }
        );
      },
    });
  };

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={index < rating ? '#E0723E' : '#E7D7C3'}
        style={{ display: 'inline-block', marginLeft: '2px' }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  if (reviews.length === 0) {
    return null; // Don't render if no reviews
  }

  const featuredReviews = reviews.filter(r => r.isFeatured);
  const activeReview = featuredReviews[activeIndex] || reviews[0];

  return (
    <section
      ref={containerRef}
      className="social-proof-section"
      style={{
        padding: '120px 5%',
        backgroundColor: '#FFF6ED',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Title */}
        <h2
          className="social-proof-title"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: '#1A1A1A',
            textAlign: 'center',
            marginBottom: '60px',
            direction: 'rtl',
          }}
        >
          מה הלקוחות שלנו אומרים
        </h2>

        {/* Main Featured Carousel */}
        <div
          style={{
            position: 'relative',
            marginBottom: '80px',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          {featuredReviews.length > 1 && (
            <>
              {/* Right Arrow (Previous in RTL) */}
              <button
                className="nav-arrow nav-arrow-right"
                onClick={handlePrevious}
                disabled={isTransitioning}
                aria-label="המלצה קודמת"
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid #E7D7C3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(60, 30, 10, 0.08)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  if (!isTransitioning) {
                    gsap.to(e.currentTarget, {
                      scale: 1.15,
                      backgroundColor: '#E0723E',
                      borderColor: '#E0723E',
                      duration: 0.3,
                      ease: 'back.out(1.7)',
                    });
                    gsap.to(e.currentTarget.querySelector('svg'), {
                      fill: 'white',
                      duration: 0.3,
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    backgroundColor: 'white',
                    borderColor: '#E7D7C3',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                  gsap.to(e.currentTarget.querySelector('svg'), {
                    fill: '#7C4A27',
                    duration: 0.3,
                  });
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#7C4A27"
                  style={{ transition: 'fill 0.3s ease' }}
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>

              {/* Left Arrow (Next in RTL) */}
              <button
                className="nav-arrow nav-arrow-left"
                onClick={handleNext}
                disabled={isTransitioning}
                aria-label="המלצה הבאה"
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid #E7D7C3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(60, 30, 10, 0.08)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  if (!isTransitioning) {
                    gsap.to(e.currentTarget, {
                      scale: 1.15,
                      backgroundColor: '#E0723E',
                      borderColor: '#E0723E',
                      duration: 0.3,
                      ease: 'back.out(1.7)',
                    });
                    gsap.to(e.currentTarget.querySelector('svg'), {
                      fill: 'white',
                      duration: 0.3,
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    backgroundColor: 'white',
                    borderColor: '#E7D7C3',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                  gsap.to(e.currentTarget.querySelector('svg'), {
                    fill: '#7C4A27',
                    duration: 0.3,
                  });
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#7C4A27"
                  style={{ transition: 'fill 0.3s ease' }}
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </>
          )}

          <div
            ref={cardRef}
            className="review-card featured-review"
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '60px 40px',
              boxShadow: '0 8px 32px rgba(60, 30, 10, 0.12)',
              maxWidth: '800px',
              margin: '0 auto',
              position: 'relative',
              direction: 'rtl',
            }}
          >
            {/* Quote Icon */}
            <div
              style={{
                fontSize: '80px',
                color: '#F5E4D2',
                lineHeight: 1,
                marginBottom: '-20px',
                fontFamily: 'Georgia, serif',
              }}
            >
              "
            </div>

            {/* Testimonial Text */}
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                lineHeight: 1.7,
                color: '#3E3E3E',
                marginBottom: '30px',
                fontStyle: 'italic',
              }}
            >
              {activeReview.testimonialText}
            </p>

            {/* Customer Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#E0723E',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '20px',
                }}
              >
                {activeReview.customerInitials || '?'}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    marginBottom: '4px',
                  }}
                >
                  {activeReview.customerName}
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {renderStars(activeReview.rating)}
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            {featuredReviews.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '30px',
                }}
              >
                {featuredReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      width: index === activeIndex ? '32px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      backgroundColor: index === activeIndex ? '#E0723E' : '#E7D7C3',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`עבור להמלצה ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/restaurant"
            data-magnetic
            className="cta"
            style={{
              display: 'inline-block',
              padding: '18px 48px',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#E0723E',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(224, 114, 62, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(224, 114, 62, 0.4)',
                duration: 0.3,
                ease: 'back.out(1.7)',
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow: '0 4px 16px rgba(224, 114, 62, 0.3)',
                duration: 0.3,
                ease: 'power2.out',
              });
            }}
          >
            חוו את זה בעצמכם
          </a>
        </div>
      </div>
    </section>
  );
}
