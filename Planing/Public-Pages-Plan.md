# 🎨 Complete Public Pages Plan — GSAP Animation Specifications

**Project:** ביס מרוקאי (Moroccan Restaurant Website)
**Date:** 2025-01-23
**Architecture:** Hardcoded page layouts with dynamic content from database
**Animation Engine:** GSAP with premium plugins (all FREE to use!)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Home Page](#1-home-page)
3. [Restaurant Page](#2-restaurant-page)
4. [Catering Page](#3-catering-page)
5. [Events Page](#4-events-page)
6. [About Page](#5-about-page)
7. [Menu Page](#6-menu-page)
8. [Dish Detail Page](#7-dish-detail-page)
9. [Implementation Order](#implementation-order)

---

## Overview

### Architecture Principles

**Hardcoded Pages with Dynamic Content:**
- Page layouts, structure, and animations are defined in code
- Content (dishes, bundles, menus, settings) is pulled from the database
- Restaurant owner manages content via admin CMS
- Design/animation changes require developer involvement

### GSAP Plugins Used (All FREE!)

- **ScrollTrigger** - Scroll choreography and pinned sections
- **Flip** - Layout morphs (list → detail, plate → platter)
- **MotionPathPlugin** - Plate curved paths
- **InertiaPlugin** - Throw physics on mobile
- **Draggable** - Mobile plate chip interactions, carousels
- **ScrollToPlugin** - Smart section jumps
- **TextPlugin** - Numeric counters, price animations
- **Observer** - Gesture shortcuts
- **SplitText** - Hero headline reveals (letter-by-letter)
- **MorphSVGPlugin** - SVG shape transitions (plate → platter)

### RTL (Right-to-Left) Conventions

All animations are RTL-aware for Hebrew:
- Text entrances default from **right → left**
- Transform origins biased to right: `transformOrigin: '100% 50%'`
- Horizontal carousels move rightward by default
- Underline animations pour from right edge

### Reduced Motion

Every animation has a fallback for users with `prefers-reduced-motion`:
- Replace complex path animations with simple fades
- Remove pinned sections
- Keep plate static
- Disable parallax effects

---

## 🏠 1. HOME PAGE (`/`)

**Status:** Detailed plan exists in `Planing/Home page plan.md`

### Quick Summary

**Sections:**
1. Hero Stage with plate path drop animation
2. Pinned Story Rail (3 scenes: Ingredients → Fire → Hosting)
3. Menu Sampler carousel with magnetic plate
4. Social Proof section with testimonials
5. Location CTA with map parallax

**Key Animations:**
- Global Plate System (cursor/mobile chip)
- Hero plate entrance via curved path (MotionPathPlugin)
- Headline SplitText reveal (RTL, right → left)
- Story Rail pinned scroll with scene transitions
- Plate → platter morph in Scene C (MorphSVG)
- Menu Sampler horizontal RTL carousel with plate magnet
- Card batch entrances with stagger

**Reference:** See existing `Planing/Home page plan.md` for full implementation details.

**Component Structure:**
```typescript
// app/(public)/page.tsx (Server Component)
import HeroStage from '@/components/public/home/HeroStage';
import StoryRail from '@/components/public/home/StoryRail';
import MenuSampler from '@/components/public/home/MenuSampler';
import SocialProof from '@/components/public/home/SocialProof';
import LocationCTA from '@/components/public/home/LocationCTA';
```

---

## 🍽️ 2. RESTAURANT PAGE (`/restaurant`)

### Purpose
Showcase the restaurant experience, atmosphere, chef's picks, and daily menu. Focus on the physical dining experience with warm, inviting animations.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero Banner                          │ (Full viewport)
│   - Restaurant interior photo           │
│   - "ביס מרוקאי - חוויה אותנטית"       │
│   - Plate glide entrance                │
├─────────────────────────────────────────┤
│ 2. Opening Hours & Info                 │ (Auto-height)
│   - Hours cards with live status        │
│   - Location map teaser                 │
├─────────────────────────────────────────┤
│ 3. Chef's Pick Section                  │ (Viewport height)
│   - Featured dish spotlight             │
│   - Rotating plate animation            │
│   - "Live" badge pulse                  │
├─────────────────────────────────────────┤
│ 4. Full Menu Preview                    │ (Auto-height)
│   - Category tabs with underline        │
│   - Dish grid (filtered)                │
│   - "View Full Menu" CTA                │
├─────────────────────────────────────────┤
│ 5. Atmosphere Gallery                   │ (Pinned parallax)
│   - Photo grid with depth layers        │
│   - Customer testimonials overlay       │
├─────────────────────────────────────────┤
│ 6. Reservation CTA                      │ (Auto-height)
│   - Phone/WhatsApp buttons              │
│   - Table availability hint             │
└─────────────────────────────────────────┘
```

### Section 1: Hero Banner

**Layout:**
- Full viewport height
- Background: Restaurant interior photo with subtle overlay
- Centered headline and subtitle
- Plate enters from top-right on curved path

**GSAP Animations:**

```typescript
// Plate entrance on page load
gsap.from('#plate', {
  motionPath: {
    path: [
      { x: window.innerWidth + 100, y: -100 },
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    ],
    curviness: 1.5
  },
  rotation: 360,
  duration: 2,
  ease: 'power2.out'
});

// Headline reveal (RTL - right to left)
const headline = new SplitText('.hero-headline', { type: 'chars' });
gsap.from(headline.chars, {
  opacity: 0,
  x: 50,
  rotation: 10,
  stagger: 0.03,
  duration: 0.8,
  ease: 'back.out(1.7)',
  delay: 0.5
});

// Subtitle fade-up
gsap.from('.hero-subtitle', {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 1.2,
  ease: 'power2.out'
});

// Background photo subtle zoom
gsap.to('.hero-bg', {
  scale: 1.05,
  duration: 20,
  ease: 'none',
  repeat: -1,
  yoyo: true
});
```

**Reduced Motion:** Replace path animation with simple fade-in, disable zoom.

---

### Section 2: Opening Hours & Info

**Layout:**
- Two-column grid (RTL: hours right, map left)
- Hours cards with day-by-day breakdown
- "Open Now" / "Closed" indicator with live status
- Mini map with location pin

**GSAP Animations:**

```typescript
// Cards entrance stagger from right
ScrollTrigger.create({
  trigger: '.hours-section',
  start: 'top 80%',
  onEnter: () => {
    gsap.from('.hours-card', {
      x: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out'
    });
  }
});

// "Open Now" badge pulse
gsap.to('.status-badge.open', {
  scale: 1.05,
  boxShadow: '0 0 20px rgba(79, 106, 60, 0.6)',
  duration: 1.5,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});

// Map pin bounce entrance
gsap.from('.map-pin', {
  y: -50,
  opacity: 0,
  ease: 'bounce.out',
  duration: 1,
  scrollTrigger: {
    trigger: '.map-container',
    start: 'top 70%'
  }
});
```

**Interaction:** Plate hovers near "Open Now" badge and pulses in sync.

---

### Section 3: Chef's Pick Section

**Layout:**
- Centered featured dish image (large)
- Rotating plate behind image (depth illusion)
- "Chef's Pick Today" badge
- Dish title, description, price
- "Order Now" CTA

**GSAP Animations:**

```typescript
// Plate rotation loop (continuous)
gsap.to('.chefs-pick-plate', {
  rotation: 360,
  duration: 30,
  ease: 'none',
  repeat: -1
});

// Dish image scale + shine on scroll into view
ScrollTrigger.create({
  trigger: '.chefs-pick-section',
  start: 'top center',
  onEnter: () => {
    // Scale dish image
    gsap.from('.dish-image', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    });

    // Specular shine sweep
    gsap.fromTo('.dish-shine',
      { x: '-100%', opacity: 0 },
      { x: '200%', opacity: 1, duration: 1.2, ease: 'power2.inOut' }
    );
  }
});

// "Live" badge pop animation
gsap.from('.live-badge', {
  scale: 0,
  rotation: -180,
  ease: 'elastic.out(1, 0.5)',
  duration: 1,
  scrollTrigger: {
    trigger: '.chefs-pick-section',
    start: 'top 60%'
  }
});

// Badge pulse loop
gsap.to('.live-badge', {
  scale: 1.1,
  duration: 0.8,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});
```

**Interaction:** Magnetic plate pull on "Order Now" button hover.

---

### Section 4: Full Menu Preview

**Layout:**
- Category tabs at top (horizontal scroll on mobile)
- Dish grid (3 columns desktop, 1 column mobile)
- Each card: image, title, price, badges
- "View Full Menu" button at bottom

**GSAP Animations:**

```typescript
// Tab underline slide (RTL - right to left)
const activeTab = (index: number) => {
  gsap.to('.tab-underline', {
    x: -index * tabWidth, // Negative for RTL
    duration: 0.35,
    ease: 'power2.out'
  });
};

// Dish cards batch entrance
ScrollTrigger.batch('.dish-card', {
  onEnter: batch => {
    gsap.from(batch, {
      x: 100,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true
    });
  },
  start: 'top 85%'
});

// Card hover: image zoom + plate proximity indicator
$('.dish-card').on('mouseenter', function() {
  gsap.to($(this).find('.dish-image'), {
    scale: 1.1,
    duration: 0.4,
    ease: 'power2.out'
  });

  // Draw arc from plate to card
  gsap.to('.plate-arc', {
    drawSVG: '0% 100%',
    duration: 0.5,
    ease: 'power2.out'
  });
});
```

**Reduced Motion:** Remove stagger, show all cards immediately with opacity transition only.

---

### Section 5: Atmosphere Gallery (Pinned Parallax)

**Layout:**
- 4 restaurant photos arranged in layered grid
- Customer testimonial quotes overlaid
- Photos have depth (parallax at different speeds)
- Section pins while photos scroll at different rates

**GSAP Animations:**

```typescript
// Pin section while photos parallax
ScrollTrigger.create({
  trigger: '.atmosphere-section',
  start: 'top top',
  end: '+=200%',
  pin: true,
  scrub: 1
});

// Multi-layer parallax (deeper layers move faster)
gsap.to('.photo-layer-1', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.atmosphere-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

gsap.to('.photo-layer-2', {
  yPercent: 40,
  ease: 'none',
  scrollTrigger: {
    trigger: '.atmosphere-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

// Testimonial quotes fade in/out based on scroll position
gsap.timeline({
  scrollTrigger: {
    trigger: '.atmosphere-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
})
.to('.testimonial-1', { opacity: 1, duration: 0.3 }, 0)
.to('.testimonial-1', { opacity: 0, duration: 0.3 }, 0.5)
.to('.testimonial-2', { opacity: 1, duration: 0.3 }, 0.5);
```

**Mobile:** Disable pinning, use simple fade-in gallery instead.

---

### Section 6: Reservation CTA

**Layout:**
- Centered CTA block
- Two buttons: "Call Now" and "WhatsApp"
- Availability hint text ("מקומות פנויים היום!")

**GSAP Animations:**

```typescript
// CTA block entrance with plate escort
ScrollTrigger.create({
  trigger: '.reservation-cta',
  start: 'top 70%',
  onEnter: () => {
    // Plate moves to escort position
    gsap.to('#plate', {
      x: ctaRect.left - 100,
      y: ctaRect.top + ctaRect.height / 2,
      rotation: 15,
      duration: 0.8,
      ease: 'power2.out'
    });

    // CTA block scale entrance
    gsap.from('.cta-block', {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.5)'
    });
  }
});

// Button border draw animation on hover
$('.cta-button').on('mouseenter', function() {
  gsap.fromTo($(this).find('.border-draw'),
    { drawSVG: '0% 0%' },
    { drawSVG: '0% 100%', duration: 0.4, ease: 'power2.out' }
  );
});
```

---

### Restaurant Page Component Structure

```typescript
// app/(public)/restaurant/page.tsx (Server Component)
import RestaurantHero from '@/components/public/restaurant/RestaurantHero';
import HoursInfo from '@/components/public/restaurant/HoursInfo';
import ChefsPick from '@/components/public/restaurant/ChefsPick';
import MenuPreview from '@/components/public/restaurant/MenuPreview';
import AtmosphereGallery from '@/components/public/restaurant/AtmosphereGallery';
import ReservationCTA from '@/components/public/restaurant/ReservationCTA';

export default async function RestaurantPage() {
  // Fetch data from APIs
  const settings = await fetch(`${process.env.PUBLIC_BASE_URL}/api/public/settings`).then(r => r.json());
  const chefsPick = await fetch(`${process.env.PUBLIC_BASE_URL}/api/public/dishes?featured=true&limit=1`).then(r => r.json());
  const menuDishes = await fetch(`${process.env.PUBLIC_BASE_URL}/api/public/dishes?type=RESTAURANT&limit=9`).then(r => r.json());

  return (
    <>
      <RestaurantHero />
      <HoursInfo hours={settings.hours} location={settings.location} />
      <ChefsPick dish={chefsPick.data[0]} />
      <MenuPreview dishes={menuDishes.data} />
      <AtmosphereGallery />
      <ReservationCTA contact={settings.contact} />
    </>
  );
}
```

---

## 🎉 3. CATERING PAGE (`/catering` - מגשי אירוח)

### Purpose
Showcase catering bundles (מגשי אירוח) for events, with visual configurator and pricing calculator. **Key animation: plate → platter morph**.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero with Platter Morph              │ (Full viewport)
│   - Plate enters → morphs to platter    │
│   - "מגשי אירוח מרוקאים"                │
├─────────────────────────────────────────┤
│ 2. Bundle Grid                           │ (Auto-height)
│   - Bundle cards with hover previews    │
│   - "Min 10 persons" indicators          │
├─────────────────────────────────────────┤
│ 3. Interactive Configurator              │ (Pinned section)
│   - Person count slider                  │
│   - Dish selection with constraints      │
│   - Live price calculator                │
│   - Visual platter fill animation        │
├─────────────────────────────────────────┤
│ 4. How It Works Timeline                 │ (Auto-height)
│   - 4-step process                       │
│   - Plate travels along timeline         │
├─────────────────────────────────────────┤
│ 5. Testimonials Carousel                 │ (Auto-height)
│   - Event photos + customer quotes       │
├─────────────────────────────────────────┤
│ 6. Inquiry CTA                           │ (Auto-height)
│   - WhatsApp direct order button         │
└─────────────────────────────────────────┘
```

### Section 1: Hero with Platter Morph

**Layout:**
- Centered platter visual (starts as plate)
- Headline: "מגשי אירוח מרוקאים אותנטיים"
- Subtext: "מינימום 10 איש"

**GSAP Animations:**

```typescript
// Plate → Platter morph using MorphSVGPlugin
gsap.timeline({ delay: 0.5 })
  .to('#plate-svg', {
    morphSVG: '#platter-svg',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .from('.platter-items', {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.5');

// Headline SplitText (RTL)
const headline = new SplitText('.hero-headline', { type: 'chars' });
gsap.from(headline.chars, {
  opacity: 0,
  x: 50,
  rotationY: 90,
  stagger: 0.04,
  duration: 0.8,
  ease: 'back.out(1.5)'
});

// Steam particles rise from platter
gsap.to('.steam-particle', {
  y: -200,
  opacity: 0,
  duration: 3,
  stagger: 0.3,
  repeat: -1,
  ease: 'power1.out'
});
```

**Reduced Motion:** Show platter immediately, skip morph animation.

---

### Section 2: Bundle Grid

**Layout:**
- 2 columns desktop, 1 column mobile
- Each card: platter image, title, composition, price per person
- "View Details" button

**GSAP Animations:**

```typescript
// Cards batch entrance with plate escort
ScrollTrigger.batch('.bundle-card', {
  onEnter: batch => {
    // Plate moves to first card
    const firstCard = batch[0].getBoundingClientRect();
    gsap.to('#plate', {
      x: firstCard.right + 50,
      y: firstCard.top + firstCard.height / 2,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Cards slide from right
    gsap.from(batch, {
      x: 150,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out'
    });
  },
  start: 'top 75%'
});

// Card hover: platter image scale + dish icons pop
$('.bundle-card').on('mouseenter', function() {
  gsap.to($(this).find('.platter-image'), {
    scale: 1.08,
    rotation: 2,
    duration: 0.4,
    ease: 'power2.out'
  });

  gsap.from($(this).find('.dish-icon'), {
    scale: 0,
    rotation: -180,
    stagger: 0.05,
    duration: 0.4,
    ease: 'back.out(2)'
  });
});
```

---

### Section 3: Interactive Configurator (Pinned)

**Layout:**
- Left: Person count slider + dish selection checkboxes
- Right: Visual platter that fills as items are selected
- Bottom: Live price calculator

**GSAP Animations:**

```typescript
// Pin configurator while scrolling through options
ScrollTrigger.create({
  trigger: '.configurator-section',
  start: 'top top',
  end: '+=150%',
  pin: '.configurator-sticky',
  anticipatePin: 1
});

// Person count slider: platter scale based on count
$('#person-slider').on('input', function() {
  const count = $(this).val();
  const scale = 1 + (count - 10) * 0.02;

  gsap.to('.visual-platter', {
    scale: scale,
    duration: 0.3,
    ease: 'power2.out'
  });
});

// Dish selection: item flies into platter
$('.dish-checkbox').on('change', function() {
  const dishId = $(this).data('dish-id');
  const dishImage = $(this).closest('.dish-option').find('img').attr('src');

  if ($(this).is(':checked')) {
    // Add dish to platter
    const newItem = $(`<img src="${dishImage}" class="platter-item" data-dish="${dishId}" />`);
    $('.visual-platter').append(newItem);

    gsap.from(newItem, {
      scale: 0,
      x: 200,
      y: -100,
      rotation: 360,
      duration: 0.8,
      ease: 'back.out(1.5)'
    });
  } else {
    // Remove dish from platter
    const item = $(`.platter-item[data-dish="${dishId}"]`);
    gsap.to(item, {
      scale: 0,
      x: 200,
      y: -100,
      rotation: -360,
      duration: 0.6,
      ease: 'back.in(1.5)',
      onComplete: () => item.remove()
    });
  }
});

// Price counter animation (TextPlugin)
const updatePrice = (oldPrice, newPrice) => {
  const temp = { val: oldPrice };
  gsap.to(temp, {
    val: newPrice,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
      $('.total-price').text(`₪${Math.round(temp.val)}`);
    }
  });
};
```

**Interaction:** Plate circles around configurator, reacting to selections.

---

### Section 4: How It Works Timeline

**Layout:**
- Horizontal timeline (RTL: right to left)
- 4 steps with icons and text
- Dotted line connecting steps
- Plate travels along timeline on scroll

**GSAP Animations:**

```typescript
// Plate travels along timeline path
gsap.to('#plate', {
  motionPath: {
    path: '.timeline-path',
    align: '.timeline-path',
    alignOrigin: [0.5, 0.5],
    autoRotate: false
  },
  duration: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.timeline-section',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: 1
  }
});

// Step icons pop in sequence
gsap.from('.timeline-step', {
  scale: 0,
  opacity: 0,
  stagger: 0.2,
  duration: 0.6,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.timeline-section',
    start: 'top 70%'
  }
});

// Dotted line draw from right to left
gsap.fromTo('.timeline-line',
  { drawSVG: '100% 100%' },
  {
    drawSVG: '0% 100%',
    duration: 1.5,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.timeline-section',
      start: 'top 70%'
    }
  }
);
```

---

### Catering Page Component Structure

```typescript
// app/(public)/catering/page.tsx (Server Component)
import CateringHero from '@/components/public/catering/CateringHero';
import BundleGrid from '@/components/public/catering/BundleGrid';
import Configurator from '@/components/public/catering/Configurator';
import HowItWorks from '@/components/public/catering/HowItWorks';
import Testimonials from '@/components/public/catering/Testimonials';
import InquiryCTA from '@/components/public/catering/InquiryCTA';

export default async function CateringPage() {
  const bundles = await fetch(`${process.env.PUBLIC_BASE_URL}/api/public/bundles`).then(r => r.json());
  const settings = await fetch(`${process.env.PUBLIC_BASE_URL}/api/public/settings`).then(r => r.json());

  return (
    <>
      <CateringHero />
      <BundleGrid bundles={bundles.data} />
      <Configurator bundles={bundles.data} />
      <HowItWorks />
      <Testimonials />
      <InquiryCTA contact={settings.contact} />
    </>
  );
}
```

---

## 🎊 4. EVENTS PAGE (`/events` - אירועים)

### Purpose
Multi-step event ordering flow with stepper UI. User configures event details, selects menu, and submits inquiry.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero with Stepper Preview            │ (Full viewport)
│   - "אירועים מיוחדים"                   │
│   - Mini plate stepper animation preview │
├─────────────────────────────────────────┤
│ 2. Multi-Step Form (Sticky Progress)    │ (Auto-height)
│   STEP 1: Event Details                 │
│     - Date picker, location, guests     │
│   STEP 2: Menu Selection                │
│     - Preset menus OR custom builder    │
│   STEP 3: Add-ons & Services            │
│     - Staff, equipment, dessert table   │
│   STEP 4: Review & Submit                │
│     - Summary + contact form            │
├─────────────────────────────────────────┤
│ 3. Past Events Gallery                  │ (Auto-height)
│   - Photo grid with hover details       │
├─────────────────────────────────────────┤
│ 4. FAQ Accordion                         │ (Auto-height)
│   - Common questions expandable          │
└─────────────────────────────────────────┘
```

### Section 1: Hero with Stepper Preview

**GSAP Animations:**

```typescript
// Plate rotates around stepper circle (infinite loop)
gsap.to('#mini-plate', {
  rotation: 360,
  transformOrigin: '150% 50%',
  duration: 8,
  ease: 'none',
  repeat: -1
});

// Step dots light up sequentially
gsap.timeline({ repeat: -1, repeatDelay: 2 })
  .to('.step-dot-1', { backgroundColor: '#E0723E', duration: 0.3 })
  .to('.step-dot-2', { backgroundColor: '#E0723E', duration: 0.3 }, '+=0.5')
  .to('.step-dot-3', { backgroundColor: '#E0723E', duration: 0.3 }, '+=0.5')
  .to('.step-dot-4', { backgroundColor: '#E0723E', duration: 0.3 }, '+=0.5');
```

---

### Section 2: Multi-Step Form

**GSAP Animations:**

```typescript
// Progress ring around plate icon
const updateProgress = (step: number) => {
  const progress = (step / 4) * 100;

  gsap.to('.progress-ring', {
    strokeDashoffset: 283 - (283 * progress / 100),
    duration: 0.6,
    ease: 'power2.out'
  });

  gsap.to('#progress-plate', {
    rotation: step * 90,
    duration: 0.6,
    ease: 'back.out(1.5)'
  });
};

// Step transition (slide from right)
const goToStep = (fromStep: number, toStep: number) => {
  const direction = toStep > fromStep ? -1 : 1;

  gsap.timeline()
    .to(`.step-${fromStep}`, {
      xPercent: -100 * direction,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .fromTo(`.step-${toStep}`,
      { xPercent: 100 * direction, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.25'
    );

  updateProgress(toStep);
};

// Form field focus animation
$('input, textarea, select').on('focus', function() {
  gsap.to($(this).siblings('label'), {
    y: -25,
    scale: 0.85,
    color: '#E0723E',
    duration: 0.3,
    ease: 'power2.out'
  });
});

// Guest count slider: visual icon scale
$('#guest-slider').on('input', function() {
  const count = $(this).val();
  const scale = 1 + (count / 100) * 0.5;

  gsap.to('.guest-icon', {
    scale: scale,
    duration: 0.2,
    ease: 'power2.out'
  });
});
```

---

### Events Page Component Structure

```typescript
// app/(public)/events/page.tsx (Client Component - form interactivity)
'use client';

import { useState } from 'react';
import EventsHero from '@/components/public/events/EventsHero';
import EventStepper from '@/components/public/events/EventStepper';
import PastEventsGallery from '@/components/public/events/PastEventsGallery';
import FAQ from '@/components/public/events/FAQ';

export default function EventsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <>
      <EventsHero />
      <EventStepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
      />
      <PastEventsGallery />
      <FAQ />
    </>
  );
}
```

---

## 📖 5. ABOUT PAGE (`/about`)

### Purpose
Tell the restaurant's story, values, and team. Focus on heritage and authenticity.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero Quote                            │ (Full viewport)
│   - Founder quote with photo            │
│   - Plate idle float animation          │
├─────────────────────────────────────────┤
│ 2. Our Story Timeline                    │ (Pinned scroll)
│   - Photos with dates                    │
│   - Plate as timeline scrubber (drag)   │
├─────────────────────────────────────────┤
│ 3. Values Marquee                        │ (Auto-height)
│   - "אותנטיות • איכות • משפחה"          │
├─────────────────────────────────────────┤
│ 4. Team Grid                             │ (Auto-height)
│   - Chef + staff photos with bios       │
├─────────────────────────────────────────┤
│ 5. Press & Awards                        │ (Auto-height)
│   - Logo grid with hover quotes         │
└─────────────────────────────────────────┘
```

### Section 1: Hero Quote

**GSAP Animations:**

```typescript
// Quote SplitText reveal
const quote = new SplitText('.hero-quote', { type: 'lines' });
gsap.from(quote.lines, {
  opacity: 0,
  y: 50,
  stagger: 0.1,
  duration: 1,
  ease: 'power2.out'
});

// Founder photo parallax on scroll
gsap.to('.founder-photo', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

// Plate idle float
gsap.to('#plate', {
  y: '+=15',
  duration: 2,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});
```

---

### Section 2: Our Story Timeline (Pinned + Draggable)

**GSAP Animations:**

```typescript
// Pin section while timeline scrolls
ScrollTrigger.create({
  trigger: '.timeline-section',
  start: 'top top',
  end: '+=300%',
  pin: true,
  scrub: 1
});

// Timeline photos parallax
gsap.to('.timeline-photos', {
  xPercent: -60,
  ease: 'none',
  scrollTrigger: {
    trigger: '.timeline-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

// Plate as draggable scrubber
Draggable.create('#plate', {
  type: 'x',
  bounds: '.timeline-track',
  onDrag: function() {
    const progress = this.x / this.maxX;
    gsap.to('.timeline-photos', {
      xPercent: -60 * progress,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
});
```

---

### Section 3: Values Marquee

**GSAP Animations:**

```typescript
// Infinite marquee (RTL: negative xPercent)
gsap.to('.marquee-text', {
  xPercent: -50,
  ease: 'none',
  duration: 20,
  repeat: -1
});

// Pause marquee on hover
$('.marquee-container').on('mouseenter', () => gsap.globalTimeline.pause());
$('.marquee-container').on('mouseleave', () => gsap.globalTimeline.resume());
```

---

## 🍲 6. MENU PAGE (`/menu`)

### Purpose
Browse all dishes with filters, search, and sorting. Gateway to dish detail pages.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero + Search Bar                     │ (Half viewport)
│   - "התפריט המלא שלנו"                   │
│   - Search input with autocomplete       │
├─────────────────────────────────────────┤
│ 2. Filter Sidebar + Dish Grid            │ (Auto-height)
│   Sidebar (sticky): Filters             │
│   Grid: Dish cards (infinite scroll)    │
├─────────────────────────────────────────┤
│ 3. Featured Dishes Carousel              │ (Auto-height)
│   - "מנות מומלצות"                        │
└─────────────────────────────────────────┘
```

### Section 1: Hero + Search

**GSAP Animations:**

```typescript
// Search bar entrance
gsap.from('.search-bar', {
  scale: 0.9,
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'back.out(1.5)',
  delay: 0.3
});

// Search input focus: border glow
$('.search-input').on('focus', function() {
  gsap.to(this, {
    boxShadow: '0 0 20px rgba(224, 114, 62, 0.4)',
    duration: 0.3,
    ease: 'power2.out'
  });
});
```

---

### Section 2: Filter Sidebar + Dish Grid

**GSAP Animations:**

```typescript
// Dish cards batch entrance (infinite scroll)
ScrollTrigger.batch('.dish-card', {
  onEnter: batch => {
    gsap.from(batch, {
      x: 100,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out'
    });
  },
  start: 'top 85%'
});

// Card hover: plate arc + image zoom
$('.dish-card').on('mouseenter', function() {
  gsap.to($(this).find('.dish-image'), {
    scale: 1.1,
    duration: 0.4,
    ease: 'power2.out'
  });

  // Plate draws arc to card
  const cardRect = this.getBoundingClientRect();
  gsap.to('#plate', {
    x: cardRect.left - 60,
    y: cardRect.top + cardRect.height / 2,
    duration: 0.4,
    ease: 'power3.out'
  });
});
```

---

## 🍛 7. DISH DETAIL PAGE (`/menu/[slug]`)

### Purpose
Individual dish deep-dive with large imagery, ingredient breakdown, and order CTA.

### Page Skeleton

```
┌─────────────────────────────────────────┐
│ 1. Hero Image with Zoom                 │ (Full viewport)
│   - Large dish photo                     │
│   - Plate as halo around dish            │
├─────────────────────────────────────────┤
│ 2. Dish Info Section                     │ (Auto-height)
│   - Title, description, price            │
│   - Badges, allergens                    │
├─────────────────────────────────────────┤
│ 3. Ingredients Breakdown                 │ (Auto-height)
│   - Ingredient chips with photos         │
├─────────────────────────────────────────┤
│ 4. Nutrition Info (Optional)             │ (Auto-height)
│   - Expandable accordion                 │
├─────────────────────────────────────────┤
│ 5. Related Dishes                        │ (Auto-height)
│   - "מנות דומות" carousel                │
└─────────────────────────────────────────┘
```

### Section 1: Hero Image with Zoom

**GSAP Animations:**

```typescript
// Plate halo rotation (continuous)
gsap.to('.dish-halo-plate', {
  rotation: 360,
  duration: 30,
  ease: 'none',
  repeat: -1
});

// Image entrance: Flip from menu card
const state = Flip.getState('.dish-card');
// DOM change: card → hero image
Flip.from(state, {
  duration: 0.8,
  ease: 'power2.inOut',
  absolute: true
});

// Image pan on mouse move
$('.dish-hero-image').on('mousemove', function(e) {
  const rect = this.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  gsap.to($(this).find('img'), {
    x: x * 30,
    y: y * 30,
    duration: 0.5,
    ease: 'power2.out'
  });
});
```

---

### Section 2: Dish Info

**GSAP Animations:**

```typescript
// Title SplitText entrance
const title = new SplitText('.dish-title', { type: 'chars' });
gsap.from(title.chars, {
  opacity: 0,
  x: 50,
  rotation: 5,
  stagger: 0.03,
  duration: 0.7,
  ease: 'back.out(1.5)'
});

// Price counter animation (TextPlugin)
const finalPrice = parseInt($('.dish-price').text());
const temp = { val: 0 };
gsap.to(temp, {
  val: finalPrice,
  duration: 1.5,
  delay: 0.6,
  ease: 'power2.out',
  onUpdate: () => {
    $('.dish-price').text(`₪${Math.round(temp.val)}`);
  }
});

// "Add to Order" button click: plate path to cart
$('.add-to-order-btn').on('click', function() {
  const cartIcon = $('.cart-icon').get(0).getBoundingClientRect();

  gsap.timeline()
    .to('#plate', {
      motionPath: {
        path: [
          { x: buttonRect.left, y: buttonRect.top },
          { x: window.innerWidth * 0.7, y: window.innerHeight * 0.3 },
          { x: cartIcon.left, y: cartIcon.top }
        ],
        curviness: 1.5
      },
      rotation: 720,
      duration: 1.2,
      ease: 'power2.inOut'
    })
    .to('.cart-icon', { scale: 1.2, duration: 0.2, ease: 'back.out(2)' }, '-=0.2');
});
```

---

### Section 3: Ingredients Breakdown

**GSAP Animations:**

```typescript
// Chips entrance stagger from right
gsap.from('.ingredient-chip', {
  x: 100,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.ingredients-section',
    start: 'top 80%'
  }
});

// Chip hover: photo zone highlight
$('.ingredient-chip').on('mouseenter', function() {
  const ingredientId = $(this).data('ingredient');
  const photoZone = $(`.photo-zone[data-ingredient="${ingredientId}"]`);

  gsap.to(photoZone, {
    opacity: 0.8,
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  });

  gsap.to(this, {
    scale: 1.1,
    backgroundColor: '#E0723E',
    color: '#FFF',
    duration: 0.3,
    ease: 'power2.out'
  });
});
```

---

## 🎯 Implementation Order

### Recommended Build Sequence

**Week 1: Global Plate System**
- Build PlateSystem component (desktop cursor + mobile chip)
- Implement magnetic attraction logic
- Test reduced motion fallbacks

**Week 2-3: Home Page**
- Hero Stage with path drop
- Pinned Story Rail (3 scenes)
- Menu Sampler carousel
- Follow existing `Home page plan.md`

**Week 4: Menu Page + Dish Detail**
- Filter sidebar with dish grid
- Dish detail with Flip transition
- Ingredient breakdown animations

**Week 5: Restaurant Page**
- All 6 sections
- Chef's Pick with rotating plate
- Atmosphere gallery with parallax

**Week 6: Catering Page**
- Plate → platter morph
- Interactive configurator
- Timeline section

**Week 7: Events Page**
- Multi-step form with stepper
- Progress ring animations
- Past events gallery

**Week 8: About Page**
- Timeline with draggable plate
- Values marquee
- Team grid

---

## 📝 Notes

**Performance:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Use `will-change` sparingly
- Pause offscreen ScrollTriggers
- Pre-size hero images
- Lazy-load below-the-fold content

**Accessibility:**
- All interactive elements remain usable without motion
- Plate never hides cursor for keyboard users
- Focus outlines always visible
- Reduced motion alternatives for all animations

**RTL Considerations:**
- All text entrances from right → left
- Transform origins: `100% 50%` (right edge)
- Horizontal scrolls move rightward
- Carousels use negative xPercent for leftward motion

---

**Last Updated:** 2025-01-23
**Status:** Ready for implementation
