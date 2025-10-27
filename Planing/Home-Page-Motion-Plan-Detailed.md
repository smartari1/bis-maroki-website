# Home Page — Surgical Motion Plan (GSAP MCP-Powered)

**Project:** ביס מרוקאי Restaurant Website
**Framework:** Next.js 14+ (App Router) + React 18 + GSAP 3.12+ + Tailwind CSS
**Direction:** RTL Hebrew-first
**Target:** Awwwards-level premium experience with 60fps performance
**Inspiration:** More Nutrition Matcha website motion patterns

---

## 🎯 Motion Philosophy

**Key Principles:**
- **Performance-First:** Only `transform` and `opacity` animations (GPU-accelerated)
- **RTL-Native:** All entrances from right, transform origins at `100% 50%`
- **Premium Elastic Easing:** `back.out(1.7)` for bounces, `power3.out` for smooth
- **Accessibility-First:** Full reduced motion support, keyboard navigation
- **Mobile-Optimized:** Touch-friendly interactions, momentum scrolling
- **60fps Guarantee:** `force3D: true`, `will-change` CSS, proper cleanup

**Inspiration Analysis from More Nutrition:**
- SplitText character reveals with custom easing
- ScrollTrigger pinned sections with scrub control
- DrawSVG for decorative elements
- InertiaPlugin for momentum-based carousels
- CustomEase for brand-specific motion curves
- Sophisticated loading state management

---

## 📐 Page Structure & Z-Index Layers

```
z-index hierarchy:
- 50: PlateSystem (global cursor/chip)
- 40: Sticky mobile CTA
- 30: Navigation header
- 20: Interactive UI elements (buttons, cards)
- 15: Particles and garnish
- 10: Content images and text
- 5: Decorative elements
- 0: Background layers
```

---

## 🎬 SECTION 1: HERO STAGE (0-100vh)

### Visual Hierarchy (Top to Bottom)
1. **Floating Garnish Particles** (z-index: 15)
2. **Plate SVG** (z-index: 20) — Interactive, animated
3. **Headline Text** (z-index: 10) — SplitText reveal
4. **Subtext** (z-index: 10)
5. **CTA Button Pair** (z-index: 20)
6. **Background Layers** (z-index: 0) — Cloth texture with parallax

---

### 1.1 Plate Drop Animation (0-0.9s)

**Element:** `#hero-plate` (SVG, ~200x200px)

**Initial State:**
```jsx
// CSS
.hero-plate {
  position: absolute;
  top: -100px;
  right: -50px;
  width: 200px;
  height: 200px;
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
}
```

**Animation Sequence:**
```jsx
// React component with useGSAP
const plateTimeline = gsap.timeline({
  defaults: { ease: "power3.out" }
});

// 1. Curved path drop with MotionPathPlugin
plateTimeline.from("#hero-plate", {
  duration: 0.9,
  motionPath: {
    path: "#hero-drop-path", // SVG path: M 100,-100 Q 50,150 0,300
    align: "#hero-drop-path",
    autoRotate: true, // Subtle rotation along path
    alignOrigin: [0.5, 0.5]
  },
  scale: 0.85,
  opacity: 0,
  ease: "power2.in", // Acceleration on drop
  force3D: true
});

// 2. Elastic bounce landing
plateTimeline.to("#hero-plate", {
  duration: 0.5,
  scale: 1,
  ease: "back.out(1.7)", // Elastic overshoot
  force3D: true
}, "-=0.2"); // Overlap for smooth transition

// 3. Settle into idle float
plateTimeline.to("#hero-plate", {
  duration: 2,
  y: "+=4",
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  force3D: true
}, "+=0.1");
```

**SVG Path Definition:**
```jsx
// public/assets/paths/hero-drop-path.svg
<svg viewBox="0 0 100 400" style={{ position: 'absolute', opacity: 0 }}>
  <path
    id="hero-drop-path"
    d="M 85,-50 Q 70,100 60,200 T 50,320"
    fill="none"
  />
</svg>
```

**Mobile Variation:**
- No path flight (too complex for small screens)
- Simple fade+scale entrance: `from: { scale: 0.8, opacity: 0 }, duration: 0.6`
- Plate positioned bottom-left as draggable chip

**Reduced Motion:**
```jsx
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  gsap.set("#hero-plate", { opacity: 1, scale: 1, x: 0, y: 0 });
  // No animation, static position
});
```

---

### 1.2 Headline SplitText Reveal (0.35-1.2s)

**Element:** `<h1 id="hero-headline">טעם מרוקאי אמיתי בלב תל אביב</h1>`

**Tailwind Classes:**
```jsx
<h1
  id="hero-headline"
  className="text-6xl md:text-8xl font-bold text-brand-black leading-tight"
  style={{ direction: 'rtl' }}
>
  טעם מרוקאי אמיתי בלב תל אביב
</h1>
```

**Animation Sequence:**

**Phase 1: Word-Level Entrance (0.35-0.8s)**
```jsx
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

// Split text into words and characters (RTL-aware)
const split = new SplitText("#hero-headline", {
  type: "words,chars",
  wordsClass: "word",
  charsClass: "char"
});

// Words slide in from RIGHT (RTL)
gsap.from(split.words, {
  duration: 0.7,
  x: 60, // From right
  opacity: 0,
  rotationZ: 3, // Subtle rotation
  transformOrigin: "100% 50%", // RTL origin
  stagger: {
    amount: 0.3,
    from: "end", // RTL: start from last word (rightmost)
    ease: "power2.out"
  },
  ease: "back.out(2)", // Premium elastic bounce
  force3D: true
}, 0.35); // Start at 0.35s
```

**Phase 2: Character-Level Cascade (0.45-1.2s)**
```jsx
// Characters cascade with tighter stagger
gsap.from(split.chars, {
  duration: 0.5,
  x: 15, // Smaller distance for characters
  opacity: 0,
  scale: 0.9,
  stagger: {
    amount: 0.4,
    from: "end", // RTL: start from right
    ease: "power1.inOut"
  },
  ease: "power3.out",
  force3D: true
}, 0.45); // Start slightly after words
```

**Phase 3: Specular Highlight Sweep (On Hover)**
```jsx
// Add gradient mask for shine effect
const headlineEl = document.querySelector("#hero-headline");

// Create pseudo-element with CSS
// CSS:
.hero-headline {
  position: relative;
  overflow: hidden;
}

.hero-headline::before {
  content: '';
  position: absolute;
  top: 0;
  right: -100%; /* RTL: start from right */
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.3) 50%,
    transparent
  );
  transition: none;
  pointer-events: none;
}

// GSAP hover animation
headlineEl.addEventListener("mouseenter", () => {
  gsap.fromTo(".hero-headline::before",
    { xPercent: 100 }, // Start off-screen right
    {
      xPercent: -100, // Sweep to left
      duration: 0.8,
      ease: "power2.inOut"
    }
  );
});
```

**Mobile Variation:**
- Reduce font size: `text-5xl` (64px)
- Shorter entrance distance: `x: 30`
- Faster timing: `duration: 0.5`

**Reduced Motion:**
```jsx
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  gsap.set([split.words, split.chars], { opacity: 1, x: 0, scale: 1 });
  // No hover effect
});
```

---

### 1.3 Subtext Fade-Up (1.0-1.5s)

**Element:** `<p id="hero-subtext">מבשלים באהבה, מגישים בסטייל</p>`

**Tailwind Classes:**
```jsx
<p
  id="hero-subtext"
  className="text-xl md:text-2xl text-text-gray mt-6 max-w-2xl"
  style={{ direction: 'rtl' }}
>
  מבשלים באהבה, מגישים בסטייל
</p>
```

**Animation:**
```jsx
gsap.from("#hero-subtext", {
  duration: 0.6,
  y: 20, // Lift from below
  opacity: 0,
  scale: 0.95,
  ease: "power3.out",
  force3D: true
}, 1.0); // Start at 1.0s
```

**Mobile:** Same animation, slightly faster (`duration: 0.5`)

---

### 1.4 CTA Button Pair (1.1-1.6s)

**Elements:**
```jsx
<div className="flex gap-4 mt-8 justify-end" style={{ direction: 'rtl' }}>
  <button className="cta cta-primary" data-magnetic>
    הזמנה עכשיו
  </button>
  <button className="cta cta-secondary" data-magnetic>
    מגשי אירוח
  </button>
</div>
```

**Tailwind Classes:**
```jsx
// Base button styles
.cta {
  @apply px-8 py-4 rounded-lg text-lg font-semibold;
  @apply transition-all duration-300;
  @apply relative overflow-hidden;
  will-change: transform;
  transform: translateZ(0);
}

.cta-primary {
  @apply bg-brand-red text-white;
  @apply hover:bg-brand-orange;
}

.cta-secondary {
  @apply border-2 border-brand-brown text-brand-brown;
  @apply hover:bg-brand-brown hover:text-white;
}
```

**Animation Sequence:**

**Entrance (1.1-1.6s):**
```jsx
gsap.from(".cta", {
  duration: 0.6,
  y: 20,
  opacity: 0,
  scale: 0.9,
  stagger: {
    amount: 0.15,
    from: "end" // RTL: right button first
  },
  ease: "back.out(1.7)", // Elastic bounce
  force3D: true
}, 1.1);
```

**Border Draw Animation (CSS):**
```css
/* Animated border draw effect */
.cta {
  position: relative;
  border: 2px solid transparent;
}

.cta::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(90deg, var(--brand-red), var(--brand-orange));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.cta:hover::before {
  opacity: 1;
  animation: border-draw 0.6s ease-out forwards;
}

@keyframes border-draw {
  from {
    clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); /* Start from right */
  }
  to {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); /* Draw clockwise */
  }
}
```

**Magnetic Plate Interaction:**
```jsx
// Hover state with GSAP
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    // Scale button
    gsap.to(btn, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.4)"
    });

    // Pull plate toward button
    const rect = btn.getBoundingClientRect();
    gsap.to("#hero-plate", {
      x: rect.right - 30,
      y: rect.top + rect.height / 2,
      rotation: 4,
      duration: 0.4,
      ease: "power3.out"
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { scale: 1, duration: 0.3 });
    gsap.to("#hero-plate", { rotation: 0, duration: 0.4 });
  });
});
```

**Press Animation:**
```jsx
btn.addEventListener('mousedown', () => {
  gsap.to(btn, {
    scale: 0.97,
    duration: 0.1
  });
});

btn.addEventListener('mouseup', () => {
  gsap.to(btn, {
    scale: 1.05,
    duration: 0.2,
    ease: "back.out(2)"
  });
});
```

---

### 1.5 Garnish Particles (Continuous Loop)

**Elements:** 6-10 SVG particles (sesame seeds, parsley leaves)

**Structure:**
```jsx
<div id="garnish-container" className="absolute inset-0 pointer-events-none">
  {[...Array(8)].map((_, i) => (
    <div
      key={i}
      className="garnish-particle"
      style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        right: `${Math.random() * 100}%`, // RTL positioning
        width: '20px',
        height: '20px',
        opacity: 0.3
      }}
    >
      <img src={`/assets/garnish/particle-${i % 3}.svg`} alt="" />
    </div>
  ))}
</div>
```

**Animation:**
```jsx
// Staggered entrance (0.5-1.5s)
gsap.from(".garnish-particle", {
  duration: 1.2,
  scale: 0,
  opacity: 0,
  rotation: () => gsap.utils.random(-180, 180),
  stagger: {
    amount: 0.8,
    from: "random"
  },
  ease: "back.out(1.7)",
  force3D: true
}, 0.5);

// Continuous drift loop
gsap.to(".garnish-particle", {
  duration: () => gsap.utils.random(4, 8), // Random duration per particle
  y: () => gsap.utils.random(-30, -60), // Float upward
  x: () => gsap.utils.random(-20, 20), // Gentle side drift
  rotation: () => gsap.utils.random(-45, 45),
  opacity: () => gsap.utils.random(0.1, 0.4),
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  stagger: {
    each: 0.5,
    from: "random"
  },
  force3D: true
});
```

**Mobile:** Reduce particle count to 4-6 for performance

---

### 1.6 Background Parallax Layers (Continuous)

**Structure:**
```jsx
<div className="hero-bg absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
  <div className="parallax-layer parallax-far" style={{ backgroundImage: 'url(/assets/textures/cloth-far.jpg)' }}></div>
  <div className="parallax-layer parallax-mid" style={{ backgroundImage: 'url(/assets/textures/wood-mid.jpg)' }}></div>
  <div className="parallax-layer parallax-near" style={{ backgroundImage: 'url(/assets/textures/steam-overlay.png)' }}></div>
</div>
```

**CSS:**
```css
.parallax-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  will-change: transform;
  transform: translateZ(0);
}
```

**Parallax Animation (Mouse Movement):**
```jsx
const heroSection = document.querySelector("#hero-stage");

heroSection.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  const { width, height } = heroSection.getBoundingClientRect();

  const xPercent = (clientX / width - 0.5) * 2; // -1 to 1
  const yPercent = (clientY / height - 0.5) * 2;

  // Different speeds for depth effect
  gsap.to(".parallax-far", {
    x: xPercent * -10,
    y: yPercent * -10,
    duration: 0.8,
    ease: "power2.out"
  });

  gsap.to(".parallax-mid", {
    x: xPercent * -20,
    y: yPercent * -20,
    duration: 0.6,
    ease: "power2.out"
  });

  gsap.to(".parallax-near", {
    x: xPercent * -30,
    y: yPercent * -30,
    duration: 0.4,
    ease: "power2.out"
  });
});
```

**Mobile:** Disable mouse parallax, use scroll-based parallax instead:
```jsx
gsap.to(".parallax-layer", {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero-stage",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});
```

---

## 🎬 SECTION 2: STORY RAIL (Pinned 100-400vh)

### Overall Structure

**Single pinned container with 3 micro-scenes:**
- Scene A (0-33%): Ingredients (חומרי גלם)
- Scene B (33-66%): Fire & Smoke (אש ועשן)
- Scene C (66-100%): Hosting/Trays (מגשי אירוח)

**ScrollTrigger Setup:**
```jsx
const storyRail = gsap.timeline({
  scrollTrigger: {
    trigger: "#story-rail",
    start: "top top",
    end: "+=300%", // 3x viewport height
    pin: true,
    scrub: 1.2, // Smooth scrubbing
    anticipatePin: 1,
    refreshPriority: 1,
    force3D: true
  }
});
```

---

### 2.1 Scene A: Ingredients (0-33% of scroll)

**Visual Elements:**
1. Background tint: Warm beige gradient
2. 4-5 ingredient images (herbs, vegetables) at different parallax depths
3. Text block (right side, RTL)
4. Plate with subtle tilt
5. Floating sesame particles

**Layout:**
```jsx
<div id="scene-a" className="absolute inset-0 opacity-0">
  <div className="scene-bg bg-gradient-to-br from-brand-cream to-brand-beige"></div>

  <div className="ingredient-images">
    <img className="ingredient img-cilantro" src="/assets/ingredients/cilantro.jpg" />
    <img className="ingredient img-tomato" src="/assets/ingredients/tomato.jpg" />
    <img className="ingredient img-spices" src="/assets/ingredients/spices.jpg" />
    <img className="ingredient img-pepper" src="/assets/ingredients/pepper.jpg" />
  </div>

  <div className="scene-text" style={{ direction: 'rtl' }}>
    <h2>חומרי גלם טריים מהשוק</h2>
    <p>כל בוקר, אנחנו בוחרים את הירקות והתבלינים הטובים ביותר</p>
  </div>
</div>
```

**Animation Timeline:**

**Entrance (0-10% of scene):**
```jsx
// Fade in scene background
storyRail.to("#scene-a", {
  opacity: 1,
  duration: 0.5,
  ease: "power2.inOut"
}, 0);

// Images slide in from right at different speeds (parallax)
const ingredientImages = [
  { el: ".img-cilantro", depth: 1, delay: 0 },
  { el: ".img-tomato", depth: 0.7, delay: 0.1 },
  { el: ".img-spices", depth: 1.3, delay: 0.05 },
  { el: ".img-pepper", depth: 0.9, delay: 0.15 }
];

ingredientImages.forEach(({ el, depth, delay }) => {
  storyRail.from(el, {
    x: 100 * depth, // Right to left, proportional to depth
    y: gsap.utils.random(-20, 20) * depth, // Slight vertical variation
    opacity: 0,
    scale: 0.9,
    rotation: gsap.utils.random(-5, 5),
    duration: 0.8,
    ease: "power3.out",
    force3D: true
  }, delay);
});

// Text reveal with clipPath mask (from right)
storyRail.from(".scene-text", {
  clipPath: "inset(0 100% 0 0)", // RTL: clip from right
  duration: 0.9,
  ease: "power2.inOut"
}, 0.2);

// Text content fade in
storyRail.from(".scene-text h2, .scene-text p", {
  x: 30, // From right
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: "power3.out"
}, 0.4);

// Plate tilt
storyRail.to("#hero-plate", {
  rotation: -3,
  x: "+=10",
  duration: 1,
  ease: "power2.inOut"
}, 0);

// Particles float upward
storyRail.to(".garnish-particle", {
  y: "-=40",
  opacity: 0.6,
  duration: 1.5,
  ease: "power1.out",
  stagger: 0.05
}, 0.3);
```

**Hold Phase (10-90% of scene):**
```jsx
// Gentle continuous motion
storyRail.to(".ingredient", {
  y: "+=10",
  duration: 2,
  ease: "sine.inOut",
  stagger: {
    each: 0.15,
    yoyo: true,
    repeat: -1
  }
}, "scene-a-hold");
```

**Exit (90-100% of scene):**
```jsx
// Fade out scene
storyRail.to("#scene-a", {
  opacity: 0,
  duration: 0.5,
  ease: "power2.inOut"
}, "scene-a-exit");

// Images slide out to left
storyRail.to(".ingredient", {
  x: -100,
  opacity: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: "power2.in"
}, "scene-a-exit");
```

---

### 2.2 Scene B: Fire & Smoke (33-66% of scroll)

**Visual Elements:**
1. Background: Warm gradient with tint shift (orange/red)
2. Two smoke layers drifting upward (PNG with transparency)
3. Char texture overlay (multiply blend mode)
4. Text block (center)
5. Fire glow at bottom
6. Plate with heat distortion effect

**Layout:**
```jsx
<div id="scene-b" className="absolute inset-0 opacity-0">
  <div className="scene-bg bg-gradient-to-t from-brand-red via-brand-orange to-brand-brown"></div>

  <div className="smoke-container">
    <img className="smoke-layer smoke-1" src="/assets/effects/smoke-1.png" />
    <img className="smoke-layer smoke-2" src="/assets/effects/smoke-2.png" />
  </div>

  <div className="char-overlay" style={{ mixBlendMode: 'multiply', opacity: 0 }}></div>

  <div className="fire-glow absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-orange/40 to-transparent"></div>

  <div className="scene-text text-center text-white">
    <h2>אש איטית, טעם מושלם</h2>
    <p>כל מנה מתבשלת בסבלנות על להבה נמוכה</p>
  </div>
</div>
```

**Animation Timeline:**

**Entrance (33-36% of full timeline):**
```jsx
// Fade in scene with temperature tint
storyRail.to("#scene-b", {
  opacity: 1,
  duration: 0.5,
  ease: "power2.inOut"
}, "scene-b-start");

// Background color shift (warm tint)
storyRail.to("#story-rail", {
  filter: "sepia(0.15) saturate(1.2)",
  duration: 1,
  ease: "power2.inOut"
}, "scene-b-start");

// Char texture fade in
storyRail.to(".char-overlay", {
  opacity: 0.3,
  duration: 1,
  ease: "power2.inOut"
}, "scene-b-start+=0.2");

// Text pop with back ease
storyRail.from(".scene-text h2", {
  scale: 0.8,
  opacity: 0,
  y: 30,
  duration: 0.6,
  ease: "back.out(1.7)",
  force3D: true
}, "scene-b-start+=0.3");

storyRail.from(".scene-text p", {
  opacity: 0,
  y: 20,
  duration: 0.5,
  ease: "power3.out"
}, "scene-b-start+=0.5");

// Fire glow pulse
storyRail.from(".fire-glow", {
  opacity: 0,
  scale: 0.9,
  duration: 0.8,
  ease: "power2.out"
}, "scene-b-start+=0.4");
```

**Smoke Drift Loop (continuous during scene):**
```jsx
// Smoke layer 1 (slower)
gsap.to(".smoke-1", {
  y: -80,
  x: 10,
  opacity: 0.25,
  duration: 8,
  repeat: -1,
  ease: "sine.inOut",
  yoyo: true,
  force3D: true
});

// Smoke layer 2 (faster)
gsap.to(".smoke-2", {
  y: -120,
  x: -15,
  opacity: 0.18,
  duration: 6,
  repeat: -1,
  ease: "sine.inOut",
  yoyo: true,
  force3D: true
});
```

**Plate Heat Distortion (subtle):**
```jsx
storyRail.to("#hero-plate", {
  rotation: 0,
  scale: 1.02,
  filter: "blur(0.5px)", // Subtle heat distortion
  duration: 1,
  ease: "power2.inOut"
}, "scene-b-start");
```

**Exit (63-66% of full timeline):**
```jsx
// Fade out scene
storyRail.to("#scene-b", {
  opacity: 0,
  duration: 0.5,
  ease: "power2.inOut"
}, "scene-b-exit");

// Remove temperature tint
storyRail.to("#story-rail", {
  filter: "none",
  duration: 0.8,
  ease: "power2.inOut"
}, "scene-b-exit");
```

---

### 2.3 Scene C: Hosting/Trays (66-100% of scroll)

**Visual Elements:**
1. Background: Clean gradient (cream to beige)
2. Plate morphs to platter (wider, elongated)
3. 3x3 grid of bundle icon cards
4. Primary CTA button (large)
5. Decorative patterns

**Layout:**
```jsx
<div id="scene-c" className="absolute inset-0 opacity-0">
  <div className="scene-bg bg-gradient-to-br from-brand-cream to-brand-beige"></div>

  <div id="platter" className="absolute opacity-0">
    <img src="/assets/platter.svg" alt="" />
  </div>

  <div className="bundle-grid grid grid-cols-3 gap-4 max-w-2xl mx-auto">
    {bundles.map((bundle, i) => (
      <div key={i} className="bundle-card" data-proximity>
        <img src={bundle.icon} />
        <h3>{bundle.title}</h3>
      </div>
    ))}
  </div>

  <button className="cta cta-primary cta-large mt-8" data-magnetic>
    גלה את מגשי האירוח
  </button>
</div>
```

**Animation Timeline:**

**Entrance + Plate → Platter Morph (66-70%):**
```jsx
// Fade in scene
storyRail.to("#scene-c", {
  opacity: 1,
  duration: 0.5,
  ease: "power2.inOut"
}, "scene-c-start");

// Option 1: MorphSVG (premium plugin)
storyRail.to("#hero-plate", {
  morphSVG: "#platter",
  duration: 1.2,
  ease: "power2.inOut",
  force3D: true
}, "scene-c-start");

// Option 2: Flip animation (free alternative)
// First: hide plate, show platter
const state = Flip.getState("#hero-plate");
document.querySelector("#hero-plate").style.display = "none";
document.querySelector("#platter").style.display = "block";

Flip.from(state, {
  duration: 1.2,
  ease: "power2.inOut",
  absolute: true,
  force3D: true
});
```

**Bundle Cards Entrance (70-75%):**
```jsx
// Cards slide in from right with stagger
storyRail.from(".bundle-card", {
  x: 80, // From right
  opacity: 0,
  scale: 0.9,
  rotation: 3,
  stagger: {
    amount: 0.6,
    grid: [3, 3],
    from: "end", // RTL: start from right
    ease: "power1.inOut"
  },
  duration: 0.8,
  ease: "back.out(1.7)",
  force3D: true
}, "scene-c-cards");
```

**CTA Entrance (75-80%):**
```jsx
storyRail.from(".cta-large", {
  scale: 0.8,
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "back.out(2)",
  force3D: true
}, "scene-c-cta");
```

**Proximity Interactions (continuous):**
```jsx
// Cards lift when plate is nearby
document.querySelectorAll("[data-proximity]").forEach(card => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.to(card, {
          y: -8,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          duration: 0.4,
          ease: "power2.out"
        });
      },
      onLeave: () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          duration: 0.4
        });
      }
    }
  });
});
```

**CTA Magnetic Highlight:**
```jsx
// Plate pulls toward CTA when nearby
const ctaEl = document.querySelector(".cta-large");
const plateEl = document.querySelector("#platter");

ctaEl.addEventListener("mouseenter", () => {
  const rect = ctaEl.getBoundingClientRect();

  gsap.to(plateEl, {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    scale: 1.05,
    duration: 0.5,
    ease: "power3.out"
  });

  // Add glow to CTA
  gsap.to(ctaEl, {
    boxShadow: "0 0 30px rgba(211, 74, 47, 0.6)",
    duration: 0.3
  });
});
```

**Exit (95-100%):**
```jsx
// Platter returns to plate
storyRail.to("#platter", {
  morphSVG: "#hero-plate", // Or reverse Flip
  duration: 0.8,
  ease: "power2.inOut"
}, "scene-c-exit");

// Fade out scene
storyRail.to("#scene-c", {
  opacity: 0,
  duration: 0.5,
  ease: "power2.inOut"
}, "scene-c-exit+=0.3");
```

---

### 2.4 Mobile Alternative (Swipe-Based)

**Replace pinned scroll with swipeable cards:**

```jsx
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

// Mobile detection
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  // Horizontal swipe container
  Draggable.create("#story-rail", {
    type: "x",
    inertia: true,
    bounds: {
      minX: -window.innerWidth * 2, // 3 scenes = 2 full widths
      maxX: 0
    },
    snap: {
      x: (value) => Math.round(value / window.innerWidth) * window.innerWidth
    },
    onDragStart: () => {
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onDragEnd: function() {
      const currentScene = Math.abs(Math.round(this.x / window.innerWidth));
      // Update scene indicator dots
      updateSceneDots(currentScene);
    }
  });
}
```

---

## 🎬 SECTION 3: MENU SAMPLER (Horizontal Carousel)

### Structure

**6 dish cards in horizontal RTL carousel**

**Layout:**
```jsx
<section id="menu-sampler" className="py-20 overflow-hidden">
  <h2 className="text-5xl font-bold text-center mb-12">
    טעימות מהתפריט
  </h2>

  <div className="carousel-container relative">
    <div className="carousel-track flex gap-6" style={{ direction: 'rtl' }}>
      {dishes.map((dish, i) => (
        <div key={i} className="dish-card" data-card-index={i}>
          <div className="dish-image-wrapper">
            <img src={dish.image} className="dish-image" />
            <div className="gleam-overlay"></div>
          </div>
          <h3 className="dish-title">{dish.title}</h3>
          <p className="dish-price">{dish.price} ₪</p>
          {dish.badge && <span className="badge">{dish.badge}</span>}
        </div>
      ))}
    </div>

    <div className="carousel-dots flex gap-2 justify-center mt-8">
      {[...Array(6)].map((_, i) => (
        <button key={i} className="dot" data-index={i}></button>
      ))}
    </div>
  </div>

  <a href="/menu" className="cta cta-secondary mx-auto mt-8">
    לתפריט המלא
  </a>
</section>
```

**Tailwind Classes:**
```css
.dish-card {
  @apply relative flex-none w-80 bg-white rounded-xl overflow-hidden;
  @apply shadow-lg transition-all duration-300;
  will-change: transform;
  transform: translateZ(0);
}

.dish-image-wrapper {
  @apply relative w-full h-64 overflow-hidden;
}

.dish-image {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.gleam-overlay {
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent;
  @apply opacity-0 transition-opacity;
  transform: translateX(100%);
}

.dish-card:hover .gleam-overlay {
  animation: gleam-sweep 1.2s ease-out infinite;
}

@keyframes gleam-sweep {
  0% { transform: translateX(100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
}
```

---

### 3.1 Scroll Entrance Animation

```jsx
ScrollTrigger.batch(".dish-card", {
  onEnter: (cards) => {
    gsap.from(cards, {
      x: 150, // From right (RTL)
      opacity: 0,
      scale: 0.9,
      rotation: 5,
      stagger: {
        amount: 0.5,
        from: "end", // RTL: start from right
        ease: "power2.out"
      },
      duration: 0.8,
      ease: "back.out(1.7)",
      force3D: true,
      clearProps: "all"
    });
  },
  start: "top 80%",
  once: true
});
```

---

### 3.2 Draggable Carousel with Inertia

```jsx
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".dish-card");
const cardWidth = 320 + 24; // card width + gap

Draggable.create(track, {
  type: "x",
  inertia: true,
  bounds: {
    minX: -(cardWidth * (cards.length - 1)),
    maxX: 0
  },
  snap: {
    x: (value) => Math.round(value / cardWidth) * cardWidth // Snap to cards
  },
  onDrag: function() {
    const progress = Math.abs(this.x) / this.maxX;
    updateDots(Math.round(progress * (cards.length - 1)));
  },
  onThrowUpdate: function() {
    const progress = Math.abs(this.x) / this.maxX;
    updateDots(Math.round(progress * (cards.length - 1)));
  }
});

function updateDots(activeIndex) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === activeIndex);
  });
}
```

---

### 3.3 Hover Interactions

**Card Scale + Image Zoom:**
```jsx
cards.forEach(card => {
  const image = card.querySelector(".dish-image");

  card.addEventListener("mouseenter", () => {
    // Card scales up
    gsap.to(card, {
      scale: 1.02,
      y: -4,
      boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
      duration: 0.4,
      ease: "back.out(1.4)"
    });

    // Image zooms in
    gsap.to(image, {
      scale: 1.08,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      duration: 0.4
    });

    gsap.to(image, {
      scale: 1,
      duration: 0.6
    });
  });
});
```

**Magnetic Plate Attraction:**
```jsx
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    const rect = card.getBoundingClientRect();
    const plateEl = document.querySelector("#hero-plate");

    gsap.to(plateEl, {
      x: rect.right - 40,
      y: rect.top + rect.height / 2,
      rotation: 8,
      scale: 1.1,
      duration: 0.5,
      ease: "power3.out"
    });
  });
});
```

---

### 3.4 Keyboard Navigation (RTL-Aware)

```jsx
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);

let currentIndex = 0;

Observer.create({
  target: track,
  type: "wheel,scroll,touch,pointer",
  onLeft: () => scrollToCard(currentIndex + 1), // Right arrow in RTL = forward
  onRight: () => scrollToCard(currentIndex - 1), // Left arrow in RTL = backward
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    scrollToCard(currentIndex + 1); // Forward in RTL
  } else if (e.key === "ArrowLeft") {
    scrollToCard(currentIndex - 1); // Backward in RTL
  }
});

function scrollToCard(index) {
  currentIndex = Math.max(0, Math.min(cards.length - 1, index));

  gsap.to(track, {
    x: -cardWidth * currentIndex,
    duration: 0.6,
    ease: "power3.out"
  });

  updateDots(currentIndex);
}
```

---

### 3.5 Mobile Swipe with Center Snap

```jsx
// Mobile-specific: swipeable with momentum
if (window.matchMedia("(max-width: 768px)").matches) {
  Draggable.create(track, {
    type: "x",
    inertia: {
      resistance: 300
    },
    snap: {
      x: (value) => Math.round(value / window.innerWidth) * window.innerWidth
    },
    onDragStart: () => {
      if (navigator.vibrate) navigator.vibrate(10);
    }
  });
}
```

---

## 🎬 SECTION 4: SOCIAL PROOF

### Structure

```jsx
<section id="social-proof" className="py-20 bg-brand-cream">
  <h2 id="proof-title" className="text-5xl font-bold text-center mb-16">
    מה אומרים עלינו
  </h2>

  <div className="testimonials-container max-w-6xl mx-auto">
    {/* Featured quote (large) */}
    <div className="featured-quote mb-12">
      <div className="quote-card quote-large">
        <div className="stars">{/* 5 stars */}</div>
        <blockquote className="text-2xl">{featuredQuote.text}</blockquote>
        <cite className="flex items-center gap-4 mt-6">
          <div className="avatar">{featuredQuote.avatar}</div>
          <span className="name">{featuredQuote.name}</span>
        </cite>
      </div>
    </div>

    {/* Grid of smaller quotes */}
    <div className="quotes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quotes.map((quote, i) => (
        <div key={i} className="quote-card">
          <div className="stars">{/* stars */}</div>
          <blockquote>{quote.text}</blockquote>
          <cite>
            <div className="avatar">{quote.avatar}</div>
            <span>{quote.name}</span>
          </cite>
        </div>
      ))}
    </div>
  </div>

  <div className="carousel-dots flex gap-2 justify-center mt-8">
    {quotes.map((_, i) => (
      <button key={i} className="dot"></button>
    ))}
  </div>

  <button className="cta cta-primary mx-auto mt-12">
    חוו את זה בעצמכם
  </button>
</section>
```

---

### 4.1 Section Title SplitText Reveal

```jsx
const titleSplit = new SplitText("#proof-title", {
  type: "words,chars",
  charsClass: "char"
});

ScrollTrigger.create({
  trigger: "#proof-title",
  start: "top 80%",
  onEnter: () => {
    gsap.from(titleSplit.chars, {
      opacity: 0,
      y: 20,
      rotation: () => gsap.utils.random(-2, 2), // Subtle rotation variance
      stagger: {
        amount: 0.5,
        from: "end", // RTL
        ease: "power1.inOut"
      },
      duration: 0.6,
      ease: "back.out(1.4)",
      force3D: true
    });
  },
  once: true
});
```

---

### 4.2 Quote Cards Entrance

```jsx
ScrollTrigger.batch(".quote-card", {
  onEnter: (cards) => {
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      stagger: {
        amount: 0.6,
        from: "random",
        ease: "power2.out"
      },
      duration: 0.8,
      ease: "back.out(1.7)",
      force3D: true
    });
  },
  start: "top 85%",
  once: true
});
```

---

### 4.3 Star Rating Animation

```jsx
// Animate stars filling (left to right, even in RTL)
const starContainers = document.querySelectorAll(".stars");

starContainers.forEach(container => {
  const stars = container.querySelectorAll(".star");

  ScrollTrigger.create({
    trigger: container,
    start: "top 85%",
    onEnter: () => {
      gsap.from(stars, {
        scale: 0,
        opacity: 0,
        rotation: -180,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(2)",
        force3D: true
      });
    },
    once: true
  });
});
```

**Star HTML/CSS:**
```jsx
<div className="stars flex gap-1 mb-4">
  {[...Array(5)].map((_, i) => (
    <svg key={i} className="star w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ))}
</div>
```

---

### 4.4 Auto-Advance Carousel (Featured Quote)

```jsx
let currentQuoteIndex = 0;
let autoplayInterval;

function showQuote(index) {
  const quotes = document.querySelectorAll(".featured-quote .quote-card");

  // Fade out current
  gsap.to(quotes[currentQuoteIndex], {
    opacity: 0,
    scale: 0.95,
    duration: 0.4,
    ease: "power2.in"
  });

  // Fade in next
  gsap.to(quotes[index], {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    delay: 0.2,
    ease: "back.out(1.4)"
  });

  currentQuoteIndex = index;
  updateDots(index);
}

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    const nextIndex = (currentQuoteIndex + 1) % quotes.length;
    showQuote(nextIndex);
  }, 5000); // 5 seconds per quote
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Pause on hover/plate proximity
const proofSection = document.querySelector("#social-proof");

proofSection.addEventListener("mouseenter", stopAutoplay);
proofSection.addEventListener("mouseleave", startAutoplay);

// Start autoplay on section enter
ScrollTrigger.create({
  trigger: "#social-proof",
  start: "top 50%",
  onEnter: startAutoplay,
  onLeaveBack: stopAutoplay
});
```

---

### 4.5 Customer Avatar Animation

```jsx
// Generate avatar circles with initials
function createAvatar(name) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const colors = ['#D34A2F', '#E0723E', '#4F6A3C', '#7C4A27'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return `
    <div class="avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style="background: ${bgColor}">
      ${initials}
    </div>
  `;
}

// Animate avatars on entrance
gsap.from(".avatar", {
  scale: 0,
  rotation: -180,
  stagger: 0.05,
  duration: 0.6,
  ease: "back.out(2)",
  scrollTrigger: {
    trigger: ".quote-card",
    start: "top 85%"
  }
});
```

---

### 4.6 Reduced Motion Alternative

```jsx
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  // No auto-advance
  clearInterval(autoplayInterval);

  // Simple fade entrance instead of complex animations
  gsap.set(".quote-card", { opacity: 1, scale: 1, y: 0 });
  gsap.set(".star", { opacity: 1, scale: 1, rotation: 0 });
});
```

---

## 🎬 SECTION 5: LOCATION & CTA

### Structure

```jsx
<section id="location-cta" className="py-20 relative overflow-hidden">
  {/* Map background with parallax */}
  <div className="map-container absolute inset-0 opacity-20">
    <img src="/assets/map-bg.jpg" className="map-bg w-full h-full object-cover" />
  </div>

  <div className="content relative z-10 max-w-4xl mx-auto">
    <h2 className="text-5xl font-bold text-center mb-12">בואו לבקר</h2>

    {/* Location pin with bounce */}
    <div className="pin-icon mx-auto w-16 h-16 mb-8">
      <svg className="w-full h-full text-brand-red" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </div>

    {/* Contact info cards */}
    <div className="contact-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="contact-card">
        <div className="icon">📍</div>
        <h3>כתובת</h3>
        <p>רחוב הרצל 45, תל אביב</p>
      </div>

      <div className="contact-card">
        <div className="icon">📞</div>
        <h3>טלפון</h3>
        <p>03-1234567</p>
      </div>

      <div className="contact-card">
        <div className="icon">💬</div>
        <h3>וואטסאפ</h3>
        <p>050-1234567</p>
      </div>
    </div>

    {/* Operating hours */}
    <div className="hours-display bg-white rounded-xl p-8 mb-12">
      <h3 className="text-2xl font-bold mb-4 text-center">שעות פתיחה</h3>
      <div className="hours-list space-y-2">
        {hours.map((day, i) => (
          <div key={i} className="flex justify-between">
            <span className="font-medium">{day.name}</span>
            <span className={day.closed ? 'text-brand-red' : ''}>{day.hours}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Primary CTA */}
    <div className="flex gap-4 justify-center">
      <button className="cta cta-primary cta-large" data-magnetic>
        הזמינו שולחן
      </button>
      <a href="waze://..." className="cta cta-secondary">
        נווט ב-Waze
      </a>
    </div>
  </div>

  {/* Mobile sticky CTA (appears after scroll) */}
  <div className="sticky-cta fixed bottom-0 inset-x-0 p-4 bg-white shadow-lg md:hidden" style={{ transform: 'translateY(100%)' }}>
    <button className="cta cta-primary w-full">
      הזמינו שולחן
    </button>
  </div>
</section>
```

---

### 5.1 Map Parallax Animation

```jsx
// Background map moves slower than content (parallax)
gsap.to(".map-bg", {
  yPercent: 20, // Move down as user scrolls
  ease: "none",
  scrollTrigger: {
    trigger: "#location-cta",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.5,
    refreshPriority: -1 // Lower priority for background
  }
});
```

---

### 5.2 Pin Icon Bounce Entrance

```jsx
ScrollTrigger.create({
  trigger: ".pin-icon",
  start: "top 80%",
  onEnter: () => {
    gsap.from(".pin-icon", {
      y: -50,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "back.out(2.5)", // Strong elastic bounce
      force3D: true
    });

    // Continuous float loop after entrance
    gsap.to(".pin-icon", {
      y: -8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8
    });
  },
  once: true
});
```

---

### 5.3 Contact Cards Stagger Entrance

```jsx
ScrollTrigger.batch(".contact-card", {
  onEnter: (cards) => {
    gsap.from(cards, {
      x: 80, // From right (RTL)
      opacity: 0,
      scale: 0.9,
      stagger: {
        amount: 0.3,
        from: "end", // RTL
        ease: "power2.out"
      },
      duration: 0.7,
      ease: "back.out(1.7)",
      force3D: true
    });
  },
  start: "top 85%",
  once: true
});
```

---

### 5.4 Operating Hours Display Animation

```jsx
const hoursList = document.querySelectorAll(".hours-list > div");

ScrollTrigger.create({
  trigger: ".hours-display",
  start: "top 85%",
  onEnter: () => {
    gsap.from(hoursList, {
      x: 40, // From right
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power3.out",
      force3D: true
    });
  },
  once: true
});
```

---

### 5.5 Primary CTA Magnetic Interaction

```jsx
const ctaLarge = document.querySelector(".cta-large");

ctaLarge.addEventListener("mouseenter", () => {
  const rect = ctaLarge.getBoundingClientRect();
  const plateEl = document.querySelector("#hero-plate");

  // Pull plate to CTA
  gsap.to(plateEl, {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    scale: 1.15,
    rotation: 10,
    duration: 0.5,
    ease: "power3.out"
  });

  // Add magnetic glow
  gsap.to(ctaLarge, {
    boxShadow: "0 0 40px rgba(211, 74, 47, 0.7), 0 8px 24px rgba(0,0,0,0.2)",
    scale: 1.05,
    duration: 0.3,
    ease: "back.out(1.4)"
  });
});

ctaLarge.addEventListener("mouseleave", () => {
  gsap.to(ctaLarge, {
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    scale: 1,
    duration: 0.3
  });
});
```

---

### 5.6 Mobile Sticky CTA (Scroll-Triggered)

```jsx
ScrollTrigger.create({
  trigger: "#location-cta",
  start: "top 60%", // When 60% of section is visible
  end: "bottom bottom",
  onEnter: () => {
    gsap.to(".sticky-cta", {
      y: 0, // Slide up from bottom
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  },
  onLeaveBack: () => {
    gsap.to(".sticky-cta", {
      y: "100%", // Slide back down
      duration: 0.4,
      ease: "power2.in"
    });
  }
});
```

---

## 🎨 CSS PERFORMANCE OPTIMIZATIONS

### Global Will-Change Rules

```css
/* Add to globals.css */

/* Animated elements during page load */
.hero-plate,
.garnish-particle,
.word,
.char,
.cta {
  will-change: transform, opacity;
}

/* Remove will-change after animations complete */
.animation-complete {
  will-change: auto;
}

/* Hover-specific */
.dish-card:hover,
.cta:hover {
  will-change: transform, box-shadow;
}

.dish-card:not(:hover) {
  will-change: auto;
}

/* ScrollTrigger elements */
[data-scroll-trigger] {
  will-change: transform, opacity;
}

/* Parallax layers */
.parallax-layer {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Draggable elements */
.carousel-track,
#story-rail {
  will-change: transform;
}

/* GPU acceleration for all animated content */
.animate-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

---

### Container Optimization

```css
/* Contain layout shifts */
.hero-stage,
.story-rail,
.menu-sampler,
.social-proof,
.location-cta {
  contain: layout style paint;
}

/* Optimize pin sections */
.pin-spacer {
  contain: layout;
}
```

---

## ♿ REDUCED MOTION ALTERNATIVES

### Global Reduced Motion CSS

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Disable GSAP animations */
  [data-gsap] {
    animation: none !important;
    transform: none !important;
  }

  /* Keep plate static */
  .hero-plate {
    position: static;
    transform: none;
  }

  /* No parallax */
  .parallax-layer {
    transform: none;
  }

  /* No carousels - show static grid */
  .carousel-track {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}
```

---

### GSAP Reduced Motion Detection

```jsx
// Add to global GSAP setup
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  // Disable all GSAP animations
  gsap.globalTimeline.pause();

  // Set all animated elements to final state
  gsap.set(".hero-plate, .word, .char, .cta, .dish-card", {
    clearProps: "all"
  });

  // Show all content immediately
  gsap.set("[data-animate]", {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
}

// Listen for preference changes
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
  if (e.matches) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.play();
  }
});
```

---

## 📱 MOBILE-SPECIFIC VARIATIONS

### Breakpoint Strategy

```jsx
const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)"
}, (context) => {
  const { isDesktop, isTablet, isMobile } = context.conditions;

  if (isMobile) {
    // Simplified animations for mobile
    gsap.from(".hero-headline", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });

    // No plate cursor on mobile
    gsap.set(".hero-plate", { display: "none" });

    // Replace Story Rail pin with swipe
    enableMobileSwipe();
  }

  if (isDesktop) {
    // Full animation suite
    initPlateSystem();
    initStoryRailPin();
    initParallax();
  }

  return () => {
    // Cleanup on breakpoint change
  };
});
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Setup (Week 1)
- [ ] Install GSAP + all plugins (ScrollTrigger, Flip, MotionPath, Draggable, Inertia, SplitText, MorphSVG)
- [ ] Create global GSAP context wrapper
- [ ] Set up reduced motion detection
- [ ] Create will-change CSS rules
- [ ] Set up matchMedia for responsive animations

### Phase 2: Hero Stage (Week 2)
- [ ] Create hero-drop-path.svg
- [ ] Implement plate drop with MotionPathPlugin
- [ ] Implement headline SplitText reveal
- [ ] Add subtext fade-up
- [ ] Create CTA border-draw animation
- [ ] Implement garnish particle system
- [ ] Add background parallax layers
- [ ] Test on mobile (simplified version)

### Phase 3: Story Rail (Week 3-4)
- [ ] Set up ScrollTrigger pinned section
- [ ] Build Scene A (Ingredients) with parallax images
- [ ] Build Scene B (Fire & Smoke) with smoke layers
- [ ] Build Scene C (Hosting/Trays) with plate morph
- [ ] Implement continuous plate rotation
- [ ] Add mobile swipe alternative
- [ ] Test scrub performance (60fps target)

### Phase 4: Menu Sampler (Week 5)
- [ ] Create dish card components
- [ ] Implement horizontal RTL carousel
- [ ] Add Draggable + Inertia physics
- [ ] Create hover interactions (scale + zoom)
- [ ] Add gleam effect animation
- [ ] Implement keyboard navigation
- [ ] Add magnetic plate attraction
- [ ] Mobile swipe with center-snap

### Phase 5: Social Proof (Week 6)
- [ ] Create testimonial components
- [ ] Implement SplitText title reveal
- [ ] Add quote cards stagger entrance
- [ ] Create star rating animation
- [ ] Build auto-advance carousel
- [ ] Add pause on proximity interaction
- [ ] Generate avatar circles

### Phase 6: Location CTA (Week 7)
- [ ] Add map background with parallax
- [ ] Create pin icon bounce animation
- [ ] Implement contact cards stagger
- [ ] Build operating hours display
- [ ] Add magnetic CTA interaction
- [ ] Create mobile sticky CTA

### Phase 7: Polish & Testing (Week 8)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Reduced motion testing
- [ ] Keyboard navigation testing
- [ ] RTL layout verification
- [ ] 60fps performance validation

---

## 🎯 PERFORMANCE TARGETS

- **First Contentful Paint (FCP):** < 1.2s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.5s
- **Frame Rate:** 60fps consistent during animations
- **Bundle Size:** GSAP + plugins < 150KB gzipped

---

## 📚 RESOURCES

- **GSAP Docs:** https://greensock.com/docs/
- **ScrollTrigger Guide:** https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **SplitText Demo:** https://greensock.com/docs/v3/Plugins/SplitText
- **RTL Best Practices:** https://rtlstyling.com/
- **Performance Monitoring:** Chrome DevTools Performance Panel
- **Accessibility Testing:** axe DevTools

---

**End of Surgical Motion Plan**

This plan provides frame-by-frame, property-by-property animation specifications for every element on the home page. Each section includes:
- Exact timing and duration values
- Specific easing functions
- RTL-aware transform origins and directions
- Mobile variations
- Reduced motion alternatives
- Performance optimizations
- CSS implementation details
- React component structure

Total estimated implementation time: **8 weeks** with one developer.
