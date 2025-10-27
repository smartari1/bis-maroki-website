'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import { useGsapContext } from '@/lib/hooks/useGsapContext';
import { useReducedMotion } from '@/lib/hooks/useGsapContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

interface DishMedia {
  url: string;
  thumbnailUrl: string;
  alt_he: string;
}

interface DishCategory {
  _id: string;
  name_he: string;
  slug: string;
}

interface Dish {
  _id: string;
  title_he: string;
  slug: string;
  description_he?: any;
  price: number;
  categoryIds: DishCategory[];
  mediaIds: DishMedia[];
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: number;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CateringSettings {
  minOrderAmount: number;
  minPersons: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
}

interface CateringConfiguratorProps {
  dishes: Dish[];
  basePrice: number;
  whatsappUrl: string;
  cateringSettings?: CateringSettings;
  className?: string;
}

export function CateringConfigurator({
  dishes,
  basePrice,
  whatsappUrl,
  cateringSettings,
  className = '',
}: CateringConfiguratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories from dishes
  const categories = dishes.reduce((acc: DishCategory[], dish) => {
    dish.categoryIds?.forEach((cat) => {
      if (!acc.find((c) => c._id === cat._id)) {
        acc.push(cat);
      }
    });
    return acc;
  }, []);

  // Filter dishes by selected category
  const filteredDishes =
    selectedCategory === 'all'
      ? dishes
      : dishes.filter((dish) =>
          dish.categoryIds?.some((cat) => cat._id === selectedCategory)
        );

  // Calculate total price
  const cartTotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalPrice = cartTotal;

  // Minimum order validation
  const minOrderAmount = cateringSettings?.minOrderAmount || 200;
  const hasReachedMinimum = totalPrice >= minOrderAmount;
  const remainingAmount = Math.max(0, minOrderAmount - totalPrice);
  const progressPercentage = Math.min(100, (totalPrice / minOrderAmount) * 100);

  useGsapContext(() => {
    if (!containerRef.current) return;

    if (prefersReducedMotion) {
      return;
    }

    // Pin the configurator section during scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=150%',
      pin: '.configurator-panels',
      pinSpacing: true,
      anticipatePin: 1,
    });
  }, [prefersReducedMotion]);

  const addToCart = (dish: Dish) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.dish._id === dish._id);
      if (existing) {
        return prevCart.map((item) =>
          item.dish._id === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { dish, quantity: 1 }];
    });

    // Animate cart icon
    gsap.fromTo(
      '.cart-badge',
      { scale: 1 },
      { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.dish._id !== dishId));
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.dish._id === dishId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleWhatsAppOrder = () => {
    const dishList = cart
      .map((item) => `${item.dish.title_he} x${item.quantity} - ₪${item.dish.price * item.quantity}`)
      .join('\n');

    const message = encodeURIComponent(
      `שלום! אני רוצה להזמין מגש אירוח:\n\n` +
        `מספר סועדים: ${personCount}\n\n` +
        `מנות:\n${dishList}\n\n` +
        `סה"כ: ₪${totalPrice}`
    );

    window.open(`${whatsappUrl}${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="catering-configurator"
      ref={containerRef}
      className={`relative py-20 bg-gradient-to-b from-[var(--brand-cream)] to-white ${className}`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--brand-black)] mb-4">
            התאימו את המגש שלכם
          </h2>
          <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
            בחרו מנות לפי טעמכם, ואנחנו נדאג לכל השאר
          </p>
        </div>

        {/* Configurator Panels (Pinned) */}
        <div className="configurator-panels grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
          {/* Left Panel - Dish Selection (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--brand-red)] text-white shadow-lg scale-105'
                    : 'bg-white text-[var(--brand-black)] hover:bg-gray-100'
                }`}
              >
                הכל
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat._id
                      ? 'bg-[var(--brand-red)] text-white shadow-lg scale-105'
                      : 'bg-white text-[var(--brand-black)] hover:bg-gray-100'
                  }`}
                >
                  {cat.name_he}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredDishes.map((dish) => (
                <article
                  key={dish._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  {/* Dish Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--brand-beige)] to-[var(--brand-cream)]">
                    {dish.mediaIds && dish.mediaIds.length > 0 ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${dish.mediaIds[0].url})`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-[var(--brand-brown)] opacity-30"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                      </div>
                    )}

                    {/* Dietary badges */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {dish.isVegan && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          🌱 טבעוני
                        </span>
                      )}
                      {dish.isVegetarian && !dish.isVegan && (
                        <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                          🥬 צמחוני
                        </span>
                      )}
                    </div>

                    {/* Spice level */}
                    {dish.spiceLevel && dish.spiceLevel > 0 && (
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {[...Array(dish.spiceLevel)].map((_, i) => (
                          <span key={i} className="text-red-500">
                            🌶️
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dish Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[var(--brand-black)] mb-2">
                      {dish.title_he}
                    </h3>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold text-[var(--brand-red)]">
                        ₪{dish.price}
                      </span>
                      <button
                        onClick={() => addToCart(dish)}
                        className="bg-[var(--brand-red)] hover:bg-[var(--brand-orange)] text-white px-8 py-3 rounded-full font-bold text-base transition-all hover:scale-110 shadow-lg hover:shadow-xl active:scale-95"
                        style={{ minWidth: '100px' }}
                      >
                        הוסף
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Panel - Cart/Summary (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[var(--brand-black)]">
                  ההזמנה שלכם
                </h3>
                <div className="cart-badge relative">
                  <svg
                    className="w-8 h-8 text-[var(--brand-red)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[var(--brand-red)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Person Count Selector */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-[var(--brand-black)] mb-3">
                  מספר סועדים:
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={() => setPersonCount(Math.max(minPersons, personCount - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-[var(--brand-black)] w-10 h-10 rounded-full font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-[var(--brand-red)] min-w-[60px] text-center">
                    {personCount}
                  </span>
                  <button
                    onClick={() => setPersonCount(personCount + 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-[var(--brand-black)] w-10 h-10 rounded-full font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">מינימום {minPersons} סועדים</p>

                {/* Minimum Order Warning */}
                {!hasReachedMinimum && totalPrice > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-800 mb-1">
                          מינימום הזמנה: ₪{minOrderAmount}
                        </p>
                        <p className="text-xs text-orange-700">
                          חסרים עוד ₪{remainingAmount} להשלמת המינימום
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {totalPrice > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>התקדמות למינימום</span>
                      <span className={hasReachedMinimum ? 'text-green-600 font-bold' : ''}>
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          hasReachedMinimum ? 'bg-green-500' : 'bg-orange-400'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    {hasReachedMinimum && (
                      <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <span>✓</span> הגעת למינימום ההזמנה!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">העגלה ריקה</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.dish._id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.dish.title_he}</p>
                        <p className="text-xs text-gray-500">
                          ₪{item.dish.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.dish._id, -1)}
                          className="w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.dish._id, 1)}
                          className="w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.dish._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                {cartTotal > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>מנות שנבחרו</span>
                      <span>₪{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[var(--brand-red)] pt-2">
                      <span>סה"כ</span>
                      <span>₪{totalPrice}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-400 py-4">
                    הוסיפו מנות לעגלה
                  </p>
                )}
              </div>

              {/* WhatsApp Order Button */}
              <div className="relative">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={cart.length === 0 || !hasReachedMinimum}
                  className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full text-white font-bold transition-all ${
                    cart.length === 0 || !hasReachedMinimum
                      ? 'bg-gray-300 cursor-not-allowed opacity-60'
                      : 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-105 shadow-lg'
                  }`}
                  title={
                    !hasReachedMinimum && cart.length > 0
                      ? `יש להגיע למינימום הזמנה של ₪${minOrderAmount}`
                      : ''
                  }
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {!hasReachedMinimum && cart.length > 0 ? (
                    <>
                      <span>🔒</span>
                      <span>הגעה למינימום נדרשת</span>
                    </>
                  ) : (
                    'שליחת הזמנה בוואטסאפ'
                  )}
                </button>
                {!hasReachedMinimum && cart.length > 0 && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    הוסיפו עוד ₪{remainingAmount} כדי לשלוח הזמנה
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
