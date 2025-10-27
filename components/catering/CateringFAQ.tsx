'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'מה המינימום סועדים למגש אירוח?',
    answer:
      'המינימום הוא 10 סועדים. זה מאפשר לנו לשמור על איכות ומגוון מנות מספקים. למגשים גדולים יותר נוכל להציע מחירים מועדפים.',
  },
  {
    question: 'כמה זמן מראש צריך להזמין?',
    answer:
      'מומלץ להזמין לפחות 3 ימי עבודה מראש כדי שנוכל להבטיח טריות ואיכות. לאירועים גדולים (מעל 50 סועדים) עדיף שבוע מראש.',
  },
  {
    question: 'איזה אזורים אתם מגיעים אליהם?',
    answer:
      'אנחנו מספקים משלוחים לכל אזור ירושלים והסביבה. לאזורים מרוחקים יותר יתכן תוספת דמי משלוח. צרו קשר ונבדוק זמינות עבורכם.',
  },
  {
    question: 'האם אפשר להתאים את המגש באופן אישי?',
    answer:
      'בהחלט! כל המגשים שלנו ניתנים להתאמה אישית מלאה. תוכלו לבחור את המנות המדויקות שאתם רוצים, להוסיף או להפחית כמויות, ולהתאים לצרכים תזונתיים מיוחדים.',
  },
  {
    question: 'איך המנות מגיעות? צריך לחמם?',
    answer:
      'המנות מגיעות טריות ומוכנות להגשה. לפי בקשתכם נוכל לספק אותן חמות מהכיריים או קרות למקרים שבהם תרצו לחמם בעצמכם. נספק הוראות חימום מפורטות במידת הצורך.',
  },
  {
    question: 'מה כולל המחיר?',
    answer:
      'המחיר כולל את כל המנות שבחרתם, אריזה מקצועית, משלוח לכתובת, וציוד חד-פעמי איכותי (צלחות, כלים). לא כלול שירות הגשה במקום - ניתן להזמין בנפרד.',
  },
  {
    question: 'האם יש אפשרות לטעימה מראש?',
    answer:
      'בהזמנות גדולות (מעל 30 סועדים) ניתן לתאם טעימה מראש במסעדה. צרו איתנו קשר ונקבע מועד מתאים.',
  },
  {
    question: 'מה המדיניות ביטולים?',
    answer:
      'ביטול עד 48 שעות לפני מועד האירוע - החזר מלא. ביטול בין 48-24 שעות - החזר חלקי של 50%. ביטול פחות מ-24 שעות - ללא החזר כספי. במקרי חירום נשתדל למצוא פתרון.',
  },
];

interface CateringFAQProps {
  className?: string;
}

export function CateringFAQ({ className = '' }: CateringFAQProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.faq-item');

    if (prefersReducedMotion) {
      // Simple fade-in for reduced motion
      gsap.fromTo(
        items,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
      return;
    }

    // Entrance animation
    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      }
    );
  }, [prefersReducedMotion]);

  const toggleAccordion = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);

    if (prefersReducedMotion) return;

    // Animate the answer panel
    const answerElement = document.getElementById(`faq-answer-${index}`);
    if (answerElement) {
      if (newIndex === index) {
        // Opening
        gsap.fromTo(
          answerElement,
          {
            height: 0,
            opacity: 0,
          },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          }
        );
      } else {
        // Closing
        gsap.to(answerElement, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }

    // Rotate the chevron icon
    const iconElement = document.getElementById(`faq-icon-${index}`);
    if (iconElement) {
      gsap.to(iconElement, {
        rotation: newIndex === index ? 180 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className={`relative py-32 px-6 bg-gradient-to-b from-white to-[var(--brand-beige)] ${className}`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--brand-black)] mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-xl text-[var(--text-gray)]">
            כל מה שרציתם לדעת על שירות מגשי האירוח שלנו
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className="faq-item bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-bold text-[var(--brand-black)] flex-1 pr-4">
                  {faq.question}
                </h3>
                <div
                  id={`faq-icon-${index}`}
                  className="flex-shrink-0 w-8 h-8 bg-[var(--brand-red)] rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer Panel */}
              <div
                id={`faq-answer-${index}`}
                className="overflow-hidden"
                style={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-lg text-[var(--text-gray)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-[var(--text-gray)] mb-6">
            יש לכם שאלה נוספת? נשמח לעזור!
          </p>
          <a
            href="https://wa.me/972524481419?text=שלום!%20יש%20לי%20שאלה%20לגבי%20מגשי%20האירוח"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            צרו קשר בוואטסאפ
          </a>
        </div>
      </div>
    </section>
  );
}
