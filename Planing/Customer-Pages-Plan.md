# Customer-Facing Pages Plan — ביס מרוקאי
**Pages:** Restaurant, Catering, Events

---

## 🎯 Overview

Three distinct customer-facing pages, each with unique layouts and animations that reflect their purpose:

1. **Restaurant Page** (`/restaurant`) — Dine-in menu showcase with filtering
2. **Catering Page** (`/catering`) — Buffet packages with interactive configurator
3. **Events Page** (`/events`) — Special event packages with booking flow

**Design Philosophy:**
- Each page has a distinct visual identity while maintaining brand consistency
- Motion-first approach with GSAP-powered interactions
- Plate system adapts behavior per page (dining plate → serving platter → event platter)
- Hebrew-first RTL throughout
- Mobile-optimized with touch gestures

---

## 📄 Page 1: Restaurant Page (`/restaurant`)

**Purpose:** Showcase dine-in menu items with filtering and ordering capabilities

**Target User Actions:**
- Browse menu by category
- Filter by dietary preferences
- View dish details
- Place order (future: online ordering)
- See daily specials

### Page Structure

#### **Section 1: Hero — "המסעדה שלנו"**
**Layout:** Full viewport height, split design
- **Left Side (60%):** Large hero image of restaurant interior with warm lighting
- **Right Side (40%):** Text overlay with gradient backdrop
  - Title: "ביס מרוקאי — טעם של בית"
  - Subtitle: "מנות מרוקאיות אותנטיות בלב הרי ירושלים"
  - Hours badge: "פתוח: א׳-ה׳ 11:00-22:00, ו׳ 10:00-14:00"
  - Primary CTA: "לתפריט המלא" (scroll to menu)
  - Secondary CTA: "הזמנת שולחן"

**GSAP Animations:**
```typescript
// Plate drop from top with bounce
gsap.from('#plate', {
  y: -200,
  rotation: 360,
  scale: 0,
  duration: 1.2,
  ease: 'back.out(1.7)',
});

// Hero image parallax
ScrollTrigger.create({
  trigger: '.hero-section',
  start: 'top top',
  end: 'bottom top',
  scrub: 1,
  onUpdate: (self) => {
    gsap.to('.hero-image', { y: self.progress * 100 });
  },
});

// Text reveal with SplitText (RTL)
const split = new SplitText('.hero-title', { type: 'words, chars' });
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  rotationX: -90,
  stagger: { from: 'end', amount: 0.8 },
  ease: 'back.out(1.7)',
});
```

**Reduced Motion:** Fade-in only, no parallax

---

#### **Section 2: Daily Specials — "מנות היום"**
**Layout:** Horizontal scrolling carousel (RTL)
- 3-4 featured dishes with large images
- Daily special badge with animated shine effect
- Price prominently displayed
- Quick-add button with plate icon

**GSAP Animations:**
```typescript
// Draggable carousel with inertia
Draggable.create('.specials-carousel', {
  type: 'x',
  bounds: '.carousel-container',
  inertia: true,
  snap: { x: (value) => Math.round(value / cardWidth) * cardWidth },
});

// Card entrance stagger from right (RTL)
gsap.from('.special-card', {
  x: 150,
  opacity: 0,
  scale: 0.8,
  rotation: -5,
  stagger: { from: 'end', amount: 0.6 },
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.specials-section',
    start: 'top 80%',
  },
});

// Shine effect on daily badge
gsap.to('.daily-badge', {
  '--shine-x': '200%',
  duration: 2,
  ease: 'sine.inOut',
  repeat: -1,
  repeatDelay: 3,
});
```

---

#### **Section 3: Category Filter Bar (Sticky)**
**Layout:** Sticky bar below hero
- Horizontal category pills: "הכל", "עיקריות", "כריכים", "סלטים", "קינוחים", "שתייה"
- Active state with underline animation
- Smooth scroll to category section
- Filter count badge (e.g., "עיקריות (12)")

**GSAP Animations:**
```typescript
// Pin filter bar on scroll
ScrollTrigger.create({
  trigger: '.filter-bar',
  start: 'top 80px', // Below header
  endTrigger: '.menu-section',
  end: 'bottom top',
  pin: true,
  pinSpacing: false,
});

// Active pill underline pour (RTL)
gsap.to('.pill.active::after', {
  scaleX: 1,
  transformOrigin: '100% 50%', // Right edge
  duration: 0.4,
  ease: 'power3.out',
});

// Plate follows active pill
gsap.to('#plate', {
  x: () => activePill.offsetLeft + activePill.offsetWidth / 2,
  y: () => activePill.offsetTop - 20,
  duration: 0.5,
  ease: 'power3.out',
});
```

---

#### **Section 4: Menu Grid — "התפריט שלנו"**
**Layout:** Masonry-style grid (3 columns desktop, 2 tablet, 1 mobile)
- Each category as a subsection with heading
- Dish cards with image, title, description (truncated), price, dietary badges
- Hover effect: image zoom + info overlay
- Click: Flip to dish detail modal

**GSAP Animations:**
```typescript
// Batch entrance for cards
ScrollTrigger.batch('.dish-card', {
  onEnter: (batch) => {
    gsap.from(batch, {
      y: 60,
      opacity: 0,
      scale: 0.9,
      rotation: -3,
      stagger: { from: 'end', amount: 0.4 },
      ease: 'back.out(1.7)',
    });
  },
  start: 'top 85%',
});

// Hover: image zoom + overlay
const card = document.querySelector('.dish-card');
card.addEventListener('mouseenter', () => {
  gsap.to(card.querySelector('img'), { scale: 1.1, duration: 0.4 });
  gsap.to(card.querySelector('.info-overlay'), { opacity: 1, y: 0 });
});

// Click: Flip to modal
card.addEventListener('click', () => {
  const state = Flip.getState(card);
  // Move card to modal position
  modal.appendChild(card);
  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    absolute: true,
  });
});
```

---

#### **Section 5: Dish Detail Modal**
**Layout:** Full-screen overlay with close button
- Large hero image (with zoom/pan on hover)
- Title, description, price
- Ingredient chips (clickable to highlight allergens)
- Nutrition info (expandable accordion)
- Portion size selector (if applicable)
- Add to order button (future feature)

**GSAP Animations:**
```typescript
// Modal open with backdrop blur
gsap.from('.modal-backdrop', { opacity: 0, duration: 0.3 });
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
  stagger: { from: 'center', amount: 0.4 },
  ease: 'back.out(2)',
});

// Image zoom on hover
const img = document.querySelector('.modal-image');
img.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = img.getBoundingClientRect();
  const x = ((e.clientX - left) / width - 0.5) * 20;
  const y = ((e.clientY - top) / height - 0.5) * 20;
  gsap.to(img, { x, y, scale: 1.2, duration: 0.3 });
});
```

---

#### **Section 6: Call to Action — "הזמינו עכשיו"**
**Layout:** Full-width banner with gradient background
- Phone number with click-to-call
- WhatsApp button
- Location link (opens in maps)
- Hours summary

**GSAP Animations:**
```typescript
// CTA entrance with scale bounce
gsap.from('.cta-banner', {
  scale: 0.9,
  opacity: 0,
  y: 30,
  duration: 0.6,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.cta-banner',
    start: 'top 90%',
  },
});

// Phone number pulse on scroll into view
gsap.to('.phone-number', {
  scale: 1.05,
  duration: 0.5,
  ease: 'sine.inOut',
  repeat: 3,
  yoyo: true,
  scrollTrigger: {
    trigger: '.cta-banner',
    start: 'top 80%',
  },
});
```

---

### Data Requirements (Restaurant Page)

**API Endpoint:** `/api/public/dishes?menuId=<restaurant-menu-id>`

**Response Shape:**
```typescript
interface RestaurantPageData {
  dishes: {
    _id: string;
    title_he: string;
    slug: string;
    description_he: RichText;
    price: number;
    categoryIds: { _id: string; name_he: string; slug: string }[];
    spiceLevel: number;
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    allergens: string[];
    mediaIds: { url: string; thumbnailUrl: string; alt_he: string }[];
    badges: string[]; // e.g., ["מומלץ", "חדש"]
  }[];
  categories: Category[];
  dailySpecials: Dish[]; // Dishes with badge "מנת היום"
}
```

---

### Mobile Considerations (Restaurant Page)

**Adjustments:**
- Hero: Stack text over image (not side-by-side)
- Filter bar: Horizontal scroll with snap-to-pill
- Menu grid: Single column
- Dish cards: Taller cards with more info visible without hover
- Plate chip: Bottom-left corner, draggable to navigate categories
- Modal: Full-screen with scroll (not overlay)

---

## 📄 Page 2: Catering Page (`/catering`)

**Purpose:** Showcase buffet-style catering packages for events (120₪/person)

**Target User Actions:**
- Explore package options
- Configure person count and item selection
- Calculate total price
- Request quote via WhatsApp
- Download menu PDF

### Page Structure

#### **Section 1: Hero — "מגשי אירוח בשריים"**
**Layout:** Full viewport with animated serving platter
- Large platter illustration (SVG) in center
- Items "drop" onto platter on page load
- Title: "מגשי אירוח משתלמים"
- Subtitle: "החל מ-120₪ לאדם | מינימום 10 סועדים"
- Key benefits: "הכנה טרייה", "משלוח חינם מעל 20 סועדים", "מגוון רחב"
- Primary CTA: "צור את המגש שלך"

**GSAP Animations:**
```typescript
// Platter entrance with elastic bounce
gsap.from('.platter-base', {
  scale: 0,
  rotation: 360,
  duration: 1,
  ease: 'elastic.out(1, 0.5)',
});

// Items drop onto platter one by one
const items = ['.item-1', '.item-2', '.item-3', '.item-4', '.item-5'];
gsap.from(items, {
  y: -300,
  rotation: () => gsap.utils.random(-180, 180),
  opacity: 0,
  stagger: {
    each: 0.15,
    from: 'random',
  },
  ease: 'bounce.out',
  duration: 1.2,
});

// Floating garnish particles (sesame seeds)
items.forEach((item) => {
  gsap.to(`${item} .garnish`, {
    y: '+=10',
    rotation: '+=5',
    duration: 2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
});

// Title reveal with SplitText
const split = new SplitText('.hero-title', { type: 'words' });
gsap.from(split.words, {
  opacity: 0,
  scale: 0.5,
  y: 50,
  stagger: { from: 'end', amount: 0.6 },
  ease: 'back.out(2)',
});
```

---

#### **Section 2: Package Overview — "איך זה עובד?"**
**Layout:** 3-step process with animated icons
- Step 1: "בחרו מספר סועדים" (slider 10-100)
- Step 2: "הרכיבו את התפריט" (3 עיקריות + 2 סלטים + קינוח)
- Step 3: "שלחו הזמנה בוואטסאפ" (instant quote)

**GSAP Animations:**
```typescript
// Steps entrance with stagger from right (RTL)
gsap.from('.step', {
  x: 100,
  opacity: 0,
  stagger: { from: 'end', amount: 0.5 },
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.steps-section',
    start: 'top 70%',
  },
});

// Step number count-up animation
ScrollTrigger.create({
  trigger: '.steps-section',
  start: 'top 70%',
  onEnter: () => {
    document.querySelectorAll('.step-number').forEach((el, i) => {
      gsap.from(el, {
        textContent: 0,
        duration: 1,
        ease: 'power2.out',
        snap: { textContent: 1 },
        delay: i * 0.2,
      });
    });
  },
});

// Icon pulse on hover
document.querySelectorAll('.step-icon').forEach((icon) => {
  icon.addEventListener('mouseenter', () => {
    gsap.to(icon, {
      scale: 1.15,
      rotation: 5,
      duration: 0.3,
      ease: 'back.out(3)',
    });
  });
});
```

---

#### **Section 3: Interactive Configurator — "הרכיבו את המגש"**
**Layout:** Two-panel layout (60/40 split)

**Left Panel (60%):** Visual platter builder
- SVG platter with slots for items
- Drag-and-drop items from right panel
- Real-time item count badges
- Visual weight/balance indicator (for fun)

**Right Panel (40%):** Item selection menu
- Category tabs: "עיקריות", "סלטים", "קינוחים"
- Scrollable item list with images
- Checkboxes with max selection enforcement (3/2/1)
- Selected items highlighted with green checkmark

**Bottom Bar (Sticky):** Price calculator
- Person count slider (10-100)
- Total price: "סה״כ: 1,200₪" (updates live)
- "שלח הזמנה בוואטסאפ" button (pre-filled message)

**GSAP Animations:**
```typescript
// Configurator entrance with split animation
gsap.from('.left-panel', { x: -50, opacity: 0, duration: 0.6, ease: 'power3.out' });
gsap.from('.right-panel', { x: 50, opacity: 0, duration: 0.6, ease: 'power3.out' });

// Drag-and-drop with Draggable + Inertia
Draggable.create('.item-card', {
  type: 'x,y',
  bounds: '.configurator',
  inertia: true,
  onDragStart: function() {
    gsap.to(this.target, { scale: 1.1, rotation: 5, duration: 0.2 });
  },
  onDragEnd: function() {
    // Check if dropped on platter
    if (Draggable.hitTest(this.target, '.platter-slot', '50%')) {
      // Snap to slot with Flip animation
      const state = Flip.getState(this.target);
      slot.appendChild(this.target);
      Flip.from(state, { duration: 0.5, ease: 'power2.inOut' });

      // Success animation
      gsap.from('.platter-slot .item-card', {
        scale: 0,
        rotation: 360,
        ease: 'back.out(2)',
      });
    } else {
      // Return to original position
      gsap.to(this.target, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.4 });
    }
  },
});

// Price counter animation
function updatePrice(newTotal) {
  gsap.to('.price-display', {
    textContent: newTotal,
    duration: 0.5,
    ease: 'power2.out',
    snap: { textContent: 1 },
    onUpdate: function() {
      this.targets()[0].textContent = `₪${Math.round(this.targets()[0].textContent)}`;
    },
  });
}

// Person count slider with live feedback
const slider = document.querySelector('.person-slider');
slider.addEventListener('input', (e) => {
  const count = e.target.value;
  updatePrice(count * 120);

  // Animate platter size based on count
  gsap.to('.platter-base', {
    scale: 0.8 + (count / 100) * 0.4, // Scale from 0.8 to 1.2
    duration: 0.3,
  });
});

// WhatsApp button pulse when valid configuration
function checkConfigValid() {
  if (selectedItems.length === 6 && personCount >= 10) {
    gsap.to('.whatsapp-button', {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(37, 211, 102, 0.6)',
      duration: 0.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }
}
```

---

#### **Section 4: Sample Menus — "תפריטים מומלצים"**
**Layout:** 3 preset menu cards (horizontal scroll on mobile)
- **Classic:** "ביס מרוקאי + טורטייה אסאדו + קרואסון סצ'ואן + 2 סלטים + קינוח"
- **Premium:** "בייגל קורנדביף + פרנה אנטריקוט + סביח + מיקס סלטים + קינוח מיוחד"
- **Vegetarian:** "סביח + חציל בטחינה + 3 סלטים טבעוניים + פירות העונה"

Each card:
- Full item list
- Price per person
- "בחר תפריט זה" button (pre-fills configurator)

**GSAP Animations:**
```typescript
// Cards entrance with 3D flip
gsap.from('.menu-card', {
  rotationY: -90,
  opacity: 0,
  stagger: { from: 'end', amount: 0.5 },
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.sample-menus',
    start: 'top 70%',
  },
});

// Card hover with 3D tilt
document.querySelectorAll('.menu-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 10;
    const y = ((e.clientY - top) / height - 0.5) * -10;
    gsap.to(card, { rotationY: x, rotationX: y, duration: 0.3 });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5 });
  });
});

// "Select this menu" button click
document.querySelectorAll('.select-menu-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Animate items flying to configurator
    const items = btn.closest('.menu-card').querySelectorAll('.item-thumbnail');
    items.forEach((item, i) => {
      const clone = item.cloneNode(true);
      document.body.appendChild(clone);

      const targetSlot = document.querySelector(`.platter-slot:nth-child(${i + 1})`);
      const state = Flip.getState(clone);
      targetSlot.appendChild(clone);
      Flip.from(state, {
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.inOut',
        absolute: true,
      });
    });

    // Scroll to configurator
    gsap.to(window, { scrollTo: '.configurator', duration: 1, ease: 'power3.inOut' });
  });
});
```

---

#### **Section 5: Gallery — "מה הלקוחות שלנו מקבלים"**
**Layout:** Masonry gallery of past catering events
- Real photos of platters and setups
- Hover: zoom + event details overlay (date, person count, testimonial)
- Lightbox on click with full-screen gallery

**GSAP Animations:**
```typescript
// Gallery items entrance with random stagger
ScrollTrigger.batch('.gallery-item', {
  onEnter: (batch) => {
    gsap.from(batch, {
      scale: 0,
      opacity: 0,
      rotation: () => gsap.utils.random(-15, 15),
      stagger: { amount: 0.8, from: 'random' },
      ease: 'back.out(1.7)',
    });
  },
  start: 'top 80%',
});

// Lightbox open with backdrop
function openLightbox(index) {
  gsap.to('.lightbox-backdrop', { opacity: 1, duration: 0.3 });
  gsap.from('.lightbox-image', {
    scale: 0.5,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)',
  });
}
```

---

#### **Section 6: Testimonials — "מה אומרים עלינו"**
**Layout:** Horizontal auto-scrolling ticker (infinite loop)
- Testimonial cards with customer name, event type, rating (5 stars)
- Pause on hover
- Speed adjusts based on cursor proximity

**GSAP Animations:**
```typescript
// Infinite horizontal scroll
const ticker = gsap.to('.testimonials-track', {
  x: '-50%',
  duration: 30,
  ease: 'none',
  repeat: -1,
});

// Pause on hover
document.querySelector('.testimonials-track').addEventListener('mouseenter', () => {
  ticker.pause();
});

// Speed up based on cursor distance
Observer.create({
  target: '.testimonials-section',
  type: 'pointer',
  onMove: (self) => {
    const distance = Math.abs(self.y - self.target.offsetHeight / 2);
    const speed = gsap.utils.mapRange(0, 200, 2, 0.5, distance);
    ticker.timeScale(speed);
  },
});
```

---

#### **Section 7: FAQ — "שאלות נפוצות"**
**Layout:** Accordion-style expandable items
- "מה כלול במחיר?"
- "כמה זמן לפני צריך להזמין?"
- "יש אפשרות להחלפת מנות?"
- "מה האפשרויות למשלוח?"

**GSAP Animations:**
```typescript
// Accordion expand/collapse
function toggleAccordion(item) {
  const content = item.querySelector('.accordion-content');
  const icon = item.querySelector('.accordion-icon');

  if (item.classList.contains('open')) {
    gsap.to(content, { height: 0, opacity: 0, duration: 0.3 });
    gsap.to(icon, { rotation: 0, duration: 0.3 });
  } else {
    gsap.to(content, { height: 'auto', opacity: 1, duration: 0.3 });
    gsap.to(icon, { rotation: 180, duration: 0.3 });
  }
}
```

---

### Data Requirements (Catering Page)

**API Endpoints:**
- `/api/public/dishes?menuId=<catering-menu-id>` — All catering items
- `/api/public/packages` — Preset menu configurations (optional)

**Response Shape:**
```typescript
interface CateringPageData {
  items: {
    _id: string;
    title_he: string;
    categoryIds: Category[];
    mediaIds: Media[];
    price: number; // Per platter or per person
  }[];
  presetMenus: {
    _id: string;
    name_he: string;
    description_he: string;
    dishIds: string[];
    pricePerPerson: number;
    minPersons: number;
  }[];
  pricingRules: {
    basePrice: 120; // ₪ per person
    minPersons: 10;
    freeDeliveryThreshold: 20; // persons
  };
}
```

---

### Mobile Considerations (Catering Page)

**Adjustments:**
- Configurator: Stack panels vertically (platter on top, items below)
- Drag-and-drop: Tap to select instead (checkbox interface)
- Platter: Fixed size, scrollable item slots
- Sample menus: Horizontal swipe carousel
- Gallery: 2-column grid instead of masonry
- Testimonials: Slower scroll speed

---

## 📄 Page 3: Events Page (`/events`)

**Purpose:** Showcase special event catering packages (170₪/person) with booking flow

**Target User Actions:**
- Explore event packages
- Calculate pricing for event size
- Fill out inquiry form (date, location, guest count, preferences)
- Submit booking request
- Download sample event menu PDF

### Page Structure

#### **Section 1: Hero — "אירועים מיוחדים"**
**Layout:** Full-screen cinematic with video background
- Background: Looping video of event setup / happy guests
- Overlay gradient (dark bottom for text readability)
- Title: "אירועים בסגנון מרוקאי אותנטי"
- Subtitle: "חתונות | אירועי חברה | בר/בת מצווה | יומולדת"
- Price badge: "החל מ-170₪ לאדם"
- Primary CTA: "תכנן את האירוע שלך"
- Secondary CTA: "צפה בגלריית אירועים"

**GSAP Animations:**
```typescript
// Video fade in with overlay
gsap.from('.hero-video', { opacity: 0, scale: 1.1, duration: 2, ease: 'power2.out' });
gsap.from('.hero-overlay', { opacity: 0, duration: 1.5 });

// Title entrance with dramatic scale
gsap.from('.hero-title', {
  scale: 0.5,
  opacity: 0,
  y: 100,
  duration: 1.2,
  ease: 'back.out(1.7)',
});

// Event type badges entrance
gsap.from('.event-type-badge', {
  scale: 0,
  opacity: 0,
  stagger: { from: 'center', amount: 0.6 },
  ease: 'back.out(2.5)',
  delay: 0.5,
});

// Price badge pulse
gsap.to('.price-badge', {
  scale: 1.05,
  boxShadow: '0 0 30px rgba(224, 114, 62, 0.8)',
  duration: 1,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
});

// CTA buttons with magnetic effect
document.querySelectorAll('.cta-button').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 20;
    const y = ((e.clientY - top) / height - 0.5) * 20;
    gsap.to(btn, { x, y, duration: 0.3 });
  });
});
```

---

#### **Section 2: Event Packages — "החבילות שלנו"**
**Layout:** 3 tiered packages with pricing cards

**Package 1: "חבילה קלאסית" (170₪)**
- 5 עיקריות + 3 סלטים + 2 קינוחים
- שתייה קלה
- מיקס נקניקיות + תוספות

**Package 2: "חבילה פרימיום" (220₪)**
- 7 עיקריות + 4 סלטים + 3 קינוחים
- שתייה מלאה + קפה
- חטיפים + פירות העונה
- ברמן אלכוהול

**Package 3: "חבילת יוקרה" (300₪)**
- 10 עיקריות + 6 סלטים + 4 קינוחים
- בר משקאות מלא
- תחנת קפה חי
- קוקטיילים + יינות
- מלצרים + ציוד מלא

**Card Layout:**
- Large package name
- Price per person (prominent)
- Feature list with checkmarks
- "בחר חבילה" button
- Most popular badge on middle tier

**GSAP Animations:**
```typescript
// Cards entrance with 3D flip and stagger
gsap.from('.package-card', {
  rotationY: 90,
  opacity: 0,
  x: (i) => (i - 1) * 50, // Fan out from center
  stagger: { from: 'center', amount: 0.5 },
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.packages-section',
    start: 'top 70%',
  },
});

// Middle card (premium) slightly elevated
gsap.set('.package-card:nth-child(2)', { scale: 1.05, zIndex: 10 });

// Hover: lift card with shadow
document.querySelectorAll('.package-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -15,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      duration: 0.3,
      ease: 'power2.out',
    });
  });
});

// "Most popular" badge pulse
gsap.to('.popular-badge', {
  scale: 1.1,
  rotation: 5,
  duration: 0.6,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
});

// Feature list checkmarks entrance
ScrollTrigger.create({
  trigger: '.packages-section',
  start: 'top 60%',
  onEnter: () => {
    gsap.from('.feature-item', {
      x: -30,
      opacity: 0,
      stagger: 0.05,
      ease: 'power2.out',
    });

    // Checkmark draw animation
    gsap.from('.checkmark-icon path', {
      drawSVG: '0%',
      stagger: 0.05,
      ease: 'power2.inOut',
    });
  },
});
```

---

#### **Section 3: Event Timeline Calculator — "כמה יעלה האירוע שלך?"**
**Layout:** Interactive pricing calculator

**Step 1:** Event type selector (radio buttons with icons)
- חתונה, בר/בת מצווה, אירוע חברה, יומולדת, אחר

**Step 2:** Guest count slider (50-500)
- Visual representation with human icons filling up

**Step 3:** Package selection (cards from previous section)

**Step 4:** Add-ons (checkboxes)
- ברמן (500₪)
- תחנת קפה (300₪)
- DJ (1,500₪)
- קישוטים (800₪)

**Live Price Display:**
- Prominent total at bottom
- Breakdown tooltip (hover to see itemization)
- "הזמן ייעוץ חינם" button

**GSAP Animations:**
```typescript
// Step entrance with slide from right (RTL)
function goToStep(stepNumber) {
  // Exit current step
  gsap.to('.step.active', { x: 100, opacity: 0, duration: 0.4 });

  // Enter next step
  gsap.from(`.step-${stepNumber}`, {
    x: -100,
    opacity: 0,
    duration: 0.4,
    delay: 0.4,
    ease: 'power3.out',
  });
}

// Guest count slider with animated icons
const slider = document.querySelector('.guest-slider');
slider.addEventListener('input', (e) => {
  const count = parseInt(e.target.value);
  const iconsToShow = Math.min(Math.ceil(count / 10), 50); // Max 50 icons

  gsap.to('.guest-icon', {
    opacity: (i) => (i < iconsToShow ? 1 : 0.2),
    scale: (i) => (i < iconsToShow ? 1 : 0.8),
    stagger: 0.01,
    duration: 0.2,
  });

  updateTotalPrice();
});

// Price counter with dramatic count-up
function updateTotalPrice() {
  const total = calculateTotal();
  gsap.to('.price-display', {
    textContent: total,
    duration: 1,
    ease: 'power2.out',
    snap: { textContent: 10 }, // Round to nearest 10
    onUpdate: function() {
      const val = Math.round(this.targets()[0].textContent);
      this.targets()[0].textContent = `₪${val.toLocaleString('he-IL')}`;
    },
  });

  // Confetti burst if total > 10,000₪
  if (total > 10000) {
    triggerConfetti();
  }
}

// Add-on checkboxes with spring animation
document.querySelectorAll('.addon-checkbox').forEach((cb) => {
  cb.addEventListener('change', (e) => {
    const card = cb.closest('.addon-card');
    if (e.target.checked) {
      gsap.to(card, {
        backgroundColor: '#FFF6ED',
        borderColor: '#E0723E',
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(2)',
      });
    } else {
      gsap.to(card, {
        backgroundColor: '#ffffff',
        borderColor: '#E7D7C3',
        scale: 1,
        duration: 0.3,
      });
    }
    updateTotalPrice();
  });
});
```

---

#### **Section 4: Booking Form — "צור קשר לתיאום"**
**Layout:** Multi-step form with progress indicator

**Step 1: Event Details**
- Event date (date picker)
- Event location (text input + dropdown for common venues)
- Estimated guest count
- Event type (pre-filled from calculator)

**Step 2: Contact Information**
- Full name
- Phone number
- Email address
- Preferred contact method (WhatsApp / Phone / Email)

**Step 3: Additional Details**
- Special dietary requirements (textarea)
- Specific requests (textarea)
- Preferred menu items (multi-select)
- Budget range (slider)

**Step 4: Review & Submit**
- Summary of all inputs
- Estimated price
- Terms acceptance checkbox
- Submit button → sends to WhatsApp or email

**GSAP Animations:**
```typescript
// Form steps with circular progress indicator
const totalSteps = 4;
let currentStep = 1;

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  gsap.to('.progress-bar', { width: `${progress}%`, duration: 0.5, ease: 'power2.out' });

  // Animate step numbers
  gsap.to('.step-indicator', {
    opacity: (i) => (i + 1 <= currentStep ? 1 : 0.3),
    scale: (i) => (i + 1 === currentStep ? 1.2 : 1),
    stagger: 0.1,
  });
}

// Form validation with shake animation
function validateField(field) {
  if (!field.value) {
    gsap.to(field, {
      x: [-10, 10, -10, 10, 0],
      duration: 0.4,
      ease: 'power1.inOut',
    });

    // Show error message
    gsap.from(field.nextElementSibling, {
      opacity: 0,
      y: -10,
      duration: 0.3,
    });

    return false;
  }
  return true;
}

// Success animation on submit
function onSubmitSuccess() {
  gsap.to('.form-container', { scale: 0.9, opacity: 0, duration: 0.5 });
  gsap.from('.success-message', {
    scale: 0,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(2)',
    delay: 0.5,
  });

  // Confetti burst
  triggerConfetti({ particleCount: 100, spread: 70 });
}
```

---

#### **Section 5: Past Events Gallery — "אירועים שערכנו"**
**Layout:** Full-width photo gallery with categories
- Filter buttons: "הכל", "חתונות", "אירועי חברה", "בר/בת מצווה"
- Masonry grid with hover effects
- Lightbox with full event details and testimonial

**GSAP Animations:**
```typescript
// Filter buttons with active state animation
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Deactivate others
    gsap.to('.filter-btn.active', { scale: 1, opacity: 0.7, duration: 0.3 });

    // Activate clicked
    gsap.to(btn, { scale: 1.1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });

    // Filter gallery with Flip
    const category = btn.dataset.category;
    const state = Flip.getState('.gallery-item');

    // Hide non-matching items
    document.querySelectorAll('.gallery-item').forEach((item) => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    // Animate layout change
    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      absolute: true,
      stagger: 0.05,
    });
  });
});

// Gallery hover with parallax image
document.querySelectorAll('.gallery-item').forEach((item) => {
  const img = item.querySelector('img');

  item.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = item.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 20;
    const y = ((e.clientY - top) / height - 0.5) * 20;
    gsap.to(img, { x, y, scale: 1.1, duration: 0.3 });
  });

  item.addEventListener('mouseleave', () => {
    gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.5 });
  });
});
```

---

#### **Section 6: Client Testimonials — "מה הלקוחות אומרים"**
**Layout:** Video testimonials carousel
- Auto-playing video (muted by default, play on click)
- Client name + event type overlay
- Star rating
- Previous/Next navigation
- Thumbnail strip at bottom

**GSAP Animations:**
```typescript
// Testimonial entrance with fade + scale
function showTestimonial(index) {
  // Exit current
  gsap.to('.testimonial.active', {
    opacity: 0,
    scale: 0.9,
    duration: 0.4,
    onComplete: () => {
      // Enter next
      gsap.from('.testimonial', {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.out',
      });
    },
  });
}

// Star rating fill animation
gsap.from('.star-icon', {
  scale: 0,
  rotation: -180,
  stagger: { each: 0.1, from: 'start' },
  ease: 'back.out(3)',
  scrollTrigger: {
    trigger: '.testimonials-section',
    start: 'top 70%',
  },
});
```

---

#### **Section 7: FAQ — "שאלות ותשובות"**
**Layout:** Same accordion as catering page but event-specific questions
- "כמה זמן לפני צריך להזמין אירוע?"
- "האם יש אפשרות לטעימה מראש?"
- "מה כולל המחיר?"
- "האם אתם מספקים ציוד?"

---

#### **Section 8: Final CTA — "מוכנים להתחיל?"**
**Layout:** Split layout
- Left: Large image of beautiful event setup
- Right: Contact information + CTA buttons
  - "הזמן שיחת ייעוץ חינם"
  - "שלח הודעה בוואטסאפ"
  - Phone number (large)
  - Office hours

**GSAP Animations:**
```typescript
// Section entrance with parallax
gsap.from('.final-cta-image', {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.final-cta',
    start: 'top 70%',
  },
});

gsap.from('.cta-content', {
  x: 100,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.final-cta',
    start: 'top 70%',
  },
});

// CTA buttons with glow pulse
gsap.to('.cta-primary', {
  boxShadow: '0 0 30px rgba(224, 114, 62, 0.8)',
  duration: 1.5,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
});
```

---

### Data Requirements (Events Page)

**API Endpoints:**
- `/api/public/dishes?menuId=<events-menu-id>` — All event menu items
- `/api/public/packages?type=events` — Event package configurations
- `/api/public/gallery?category=events` — Past event photos

**Response Shape:**
```typescript
interface EventsPageData {
  packages: {
    _id: string;
    name_he: string;
    pricePerPerson: number;
    features: string[];
    dishIds: string[];
  }[];
  addOns: {
    _id: string;
    name_he: string;
    price: number;
    icon: string;
  }[];
  gallery: {
    _id: string;
    imageUrl: string;
    eventType: string;
    testimonial: string;
    clientName: string;
    rating: number;
  }[];
  faq: {
    question_he: string;
    answer_he: string;
  }[];
}
```

---

### Mobile Considerations (Events Page)

**Adjustments:**
- Hero: Video replaced with static image (performance)
- Packages: Vertical stack instead of 3-column
- Calculator: Single-column form with larger inputs
- Gallery: 2-column grid
- Testimonials: Full-width carousel with swipe
- Form: One question per screen (wizard UX)

---

## 🎨 Shared Design Elements Across All 3 Pages

### Global Plate Behavior Per Page

**Restaurant:** Dining plate (circular, medium size)
- Follows cursor on desktop
- Magnetic pull to dish cards
- Tilts on hover
- Bottom-right corner on mobile (draggable)

**Catering:** Serving platter (oval, larger)
- Morphs from plate on page load (MorphSVG)
- Used as drop zone in configurator
- Scales based on person count
- Center of configurator on mobile

**Events:** Event platter (large, ornate)
- Most decorative variant with patterns
- Follows cursor with slower lag (heavier feel)
- Transforms to confetti burst on form submit
- Bottom-center on mobile

### Transitions Between Pages

**Plate Morphing:**
When navigating between pages, plate morphs to appropriate shape:
```typescript
// Example: Restaurant → Catering
gsap.to('#plate path', {
  morphSVG: '#platter-path',
  duration: 1,
  ease: 'power2.inOut',
});
```

### Common Components

**1. Category Filter Pills** (reused across all pages)
**2. Dish Cards** (consistent design with variations)
**3. Price Display** (animated counter)
**4. WhatsApp CTA Button** (always sticky on mobile)
**5. Back to Top Button** (appears after scroll)

---

## 📱 Mobile-First Considerations

### Touch Gestures
- **Swipe right-to-left:** Next item in carousel
- **Swipe left-to-right:** Previous item
- **Long press on dish card:** Quick view modal
- **Pinch to zoom:** Gallery images
- **Pull to refresh:** Update prices/availability

### Performance Optimizations
- Lazy load images below fold
- Defer GSAP animations for off-screen elements
- Use `will-change` sparingly
- Reduce particle count on mobile
- Simplify complex SVG animations
- Video backgrounds: static images on mobile

---

## 🎬 Animation Performance Checklist

For all 3 pages:
- ✅ Only animate `transform` and `opacity`
- ✅ Use `force3D: true` for GPU acceleration
- ✅ Pause ScrollTriggers when off-screen
- ✅ Reduce motion fallbacks for accessibility
- ✅ Mobile: simpler animations, fewer particles
- ✅ Preload critical assets (hero images, fonts)
- ✅ Use `requestAnimationFrame` for custom animations

---

## 📊 Analytics & Tracking

Events to track on all pages:
- Scroll depth (25%, 50%, 75%, 100%)
- CTA button clicks (WhatsApp, Phone, Form submit)
- Time on page
- Device type (mobile vs desktop)
- Filter interactions (category, dietary)
- Configurator usage (catering/events)
- Form abandonment rate
- Dish card clicks

---

## 🚀 Implementation Priority

### Phase 1: Restaurant Page (Week 1)
- Core layout and sections
- Dish cards and filtering
- Modal detail view
- Basic GSAP animations

### Phase 2: Catering Page (Week 2)
- Interactive configurator
- Drag-and-drop or tap-to-select
- Price calculator
- Sample menus

### Phase 3: Events Page (Week 3)
- Package cards
- Multi-step form
- Timeline calculator
- Gallery

### Phase 4: Polish & Optimization (Week 4)
- Cross-page plate morphing
- Performance optimization
- Mobile gestures
- Reduced motion variants
- Analytics integration

---

**End of Customer Pages Plan**

Ready for implementation! 🎉
