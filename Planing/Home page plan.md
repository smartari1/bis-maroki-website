# **Home Page — Full Motion & Interaction Plan (RTL, Hebrew, Awwwards‑style)**

Goal: Craft a crisp, performant, tasteful "wow" landing in RTL where a **plate (צלחת)** is the hero object and also a playful cursor/driver for micro‑interactions. Desktop and mobile both feel premium. Accessibility and reduced‑motion options are first‑class.

---

## **0\) Global Principles**

**GSAP Plugins**: `ScrollTrigger`, `Flip`, `MotionPathPlugin`, `Draggable`, `InertiaPlugin`, `TextPlugin`, `Observer`, `SplitText`, `ScrollToPlugin`, `MorphSVGPlugin`.

**Directionality (RTL)**

* Default entrances: from **right → left**.

* Transform origins biased to right, e.g., `transformOrigin: '100% 50%'` for underlines and wipes.

* Horizontal reveals, carousels, and marquee all move **rightward** by default, with reverse on back/exit.

**Performance & A11y**

* Use only `transform` and `opacity` for motion; paint-safe.

* Image preloading for hero+first fold; `loading="lazy"` below fold.

* Pause/destroy off-screen `ScrollTrigger`s.

* Reduced motion: `matchMedia('(prefers-reduced-motion: reduce)')` → replace with fades, remove pins, keep timelines short.

* All interactive elements remain usable without motion (labels, icons, clear focus states).

**Timing & Taste**

* Primary scenes: 1.0–1.6s entrances; peaks ≤2.0s.

* Staggers: 0.02–0.06; Eases: `power3.out`, `expo.out` for hero, `back(1.4)` for playful bounces.

* Max 2 pinned sections to avoid fatigue.

---

## **1\) Page Skeleton**

1. **Top Navigation (RTL)**: Logo (right), links (אודות, תפריט, מגשי אירוח, אירועים, צור קשר), language switch, cart.

2. **Hero Stage**: Plate as lead; headline; CTA pair (הזמנה / מגשי אירוח); garnish layers.

3. **Scene A — Ingredients (חומרי גלם)**: fresh shots, micro‑particles.

4. **Scene B — Fire & Smoke (אש ועשן)**: warmth, char textures, subtle smoke.

5. **Scene C — Hosting/Trays (מגשי אירוח)**: platter morph, bundle hints.

6. **Sampler Carousel (טעימות מהתפריט)**: quick peeks of dishes.

7. **Social Proof & Press**: quotes, ratings.

8. **Location & CTA**: map hint, hours, reservation button.

9. **Footer**: links, small interactions.

Pinned: **Hero** (light pin at start), **3‑scene story rail** (A→B→C) as a single pinned region.

---

## **2\) The Plate System (Global)**

**Desktop Cursor Mode**

* Hide native cursor; render SVG/PNG plate following pointer with eased lag.

* Magnetic zones (nav links, CTAs, carousel cards): plate subtly pulls toward targets, rotates 2‑4°, scales to 0.98 on press.

* States: `idle` (slow float y±2px), `hover` (specular highlight sweep), `press` (micro squash), `success` (one‑shot sesame/parsley burst).

**Mobile Draggable Mode**

* Plate lives as a floating chip (bottom‑left in RTL). `Draggable` with `Inertia`.

* Short throw toward edge triggers contextual action (open nav, next card, scroll step). Haptics if available.

**Pseudo‑config**

// desktop follow  
const x \= gsap.quickTo('\#plate', 'x', { duration: 0.25, ease: 'power3' });  
const y \= gsap.quickTo('\#plate', 'y', { duration: 0.25, ease: 'power3' });  
window.addEventListener('mousemove', e \=\> { x(e.clientX); y(e.clientY); });

// magnetic  
function magnet(el){  
  el.addEventListener('mouseenter', ()=\> gsap.to('\#plate', { duration:0.35, rotation:3, scale:1.04 }));  
  el.addEventListener('mouseleave', ()=\> gsap.to('\#plate', { duration:0.35, rotation:0, scale:1 }));  
}

Reduced motion: plate static; only hover scale 1.01 and soft shadow.

---

## **3\) Top Navigation (RTL)**

**Entrance (page load)**

* Logo from right (x: \+40 → 0, opacity 0 → 1, 0.6s).

* Links stagger right→left (stagger 0.04, 0.5s each). Underlines pre‑clipped from right.

* Cart badge counts tween with `TextPlugin`.

**Hover & Focus**

* Underline “pours” in from right via `scaleX` with `transformOrigin: '100% 50%'`.

* Plate proximity nudges underline thickness \+ glow.

**Mobile**

* Burger icon morphs to close (MorphSVG). Slide‑in menu from the right.

---

## **4\) Hero Stage (Wow Moment)**

**Visual Layers** (top→bottom)

1. Plate (\#plate) — interactive, highlight reflection layer.

2. Headline (SplitText Hebrew), subtext, CTAs.

3. Garnish particles (sesame/parsley, SVG sprites).

4. Background: shallow parallax of food textures (cloth/wood/steam subtle).

**Initial Sequence (0–2.2s)**

1. **Plate Path Drop** (0–0.9s)

   * Plate travels along a **curved path** from top‑right, slight overshoot, lands with a soft bounce.

   * `MotionPathPlugin` with `curviness: 1.2`, `autoRotate: true` (tiny).

2. **Headline Reveal** (starts at 0.35s)

   * Split into words → letters (RTL). Words slide **from the right**, letters cascade with 12–18ms stagger.

   * A speculative **spice‑wipe mask** reveals fills.

3. **CTA Pair** (1.1–1.4s)

   * Buttons draw borders clockwise (RTL: start on right), fill fades 0.92 → 1.00.

4. **Garnish Drift** (ongoing loop)

   * 6–10 particles orbit at 0.4–0.8Hz; opacity pulse ≤0.2 amplitude.

**Hover / Play**

* Moving the mouse across headline triggers a **specular pass** (gradient mask sweep right→left, 0.5s throttled).

* CTA hover: plate edges reflect brand color; button text `y: -1px` micro lift.

**Code Sketch**

const tlHero \= gsap.timeline({ defaults:{ ease:'power3.out' }});  
tlHero  
  .from('\#plate', { duration:0.9, motionPath:{ path:'\#heroPath', autoRotate:true }, scale:0.92 })  
  .from('\#headline .word', { x:40, opacity:0, stagger:0.06, duration:0.7 }, 0.35)  
  .from('\#headline .char', { x:10, opacity:0, stagger:0.02, duration:0.5 }, 0.45)  
  .from('.cta', { opacity:0, y:12, stagger:0.08, duration:0.5 }, 1.1);

**Mobile Hero**

* Plate docked (bottom‑left). Swipe horizontally to change **hero beats** (see Section 5). Headline enters with shorter distances, no path flight.

---

## **5\) Pinned Story Rail: Three Beats (A → B → C)**

The hero pins; user scrolls to **scrub** a master timeline that progresses through three micro‑scenes. Plate persists between scenes for continuity.

**ScrollTrigger Setup**

let mm \= gsap.matchMedia();  
mm.add('(min-width: 1024px)', ()=\>{  
  ScrollTrigger.create({  
    animation: gsap.timeline({  
      scrollTrigger:{  
        trigger:'\#story', start:'top top', end:'+=250%', pin:true, scrub:1.2, anticipatePin:1  
      }  
    })  
  });  
});

### **Scene A — Ingredients (חומרי גלם)**

* **Images** (herbs, vegetables) slide in from the right at different depths (parallax y 4–20px).

* **Text** reveals via mask from right; accent underline pours.

* **Plate** tilts slightly; specular highlight sweeps.

* **Particles** (sesame) float upward; small drift randomness.

*Motion specifics*

* Text container: `clipPath: inset(0 100% 0 0)` → `inset(0 0% 0 0)` over 0.9s.

* Photo stack: `y:[24,16,8] → 0`, `opacity 0 → 1`, stagger 0.1.

* Plate: `rotation: -2° → 0°`, `x: +8 → 0`.

### **Scene B — Fire & Smoke (אש ועשן)**

* **Temperature Shift**: BG gradient warms slightly (filter/tint tween 3–4%).

* **Smoke Layers**: Two translucent PNG/SVG smoke layers drift upward (`y:-40` loop), opacity 0.15–0.25.

* **Char Texture**: Subtle multiply layer appears beneath plate.

* **Text** pops in with a small **back** ease (0.6s), entrance from right.

*Motion specifics*

* Use `gsap.to(smoke, { y: '+=40', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' })` (paused under reduced motion).

### **Scene C — Hosting / Trays (מגשי אירוח)**

* **Plate → Platter Morph**: SVG rim subtly stretches (MorphSVG) or use `Flip` between two assets.

* **Bundle Icons** slide in (right→left, 0.5s, stagger 0.06).

* **Mini Cards** raise on proximity to plate (shadow \+ 2px lift).

* CTA “מגשי אירוח” highlights when plate nears (magnetic \+ glow).

*Exit of Rail*

* Plate recenters, morph reverses to plate.

**Mobile**

* Replace pinned scrub with **swipe‑controlled** rail: each scene fills viewport; swipe right→left transitions scenes with `Flip`/opacity and 8–12px parallax.

---

## **6\) Menu Sampler (טעימות מהתפריט)**

**Layout**: Horizontal RTL carousel (rightmost item is next). Items: photo, name, small price.

**Interactions**

* **Plate Magnet**: Hovering an item pulls plate toward its edge; card scales 1.02, image zooms 1.04.

* **Peek Motion**: On hover, a short loop (steam/gleam) plays on the image mask.

* **Keyboard**: Arrow keys (in RTL: **Right Arrow** is forward) with `Observer`.

**Scroll Entrance**

* Container slides in from right (x: 60 → 0, 0.7s), cards stagger 0.05.

**Mobile**

* Swipeable via native momentum; center‑snap to items; plate chip can be flicked to advance one.

---

## **7\) Social Proof & Press (חוות דעת)**

**Entrance**

* Section title: SplitText slide from right; subtle letter rotation randomness (±1°).

* Quote cards: fade+lift 12px stagger.

**Loop**

* Auto‑advance quotes every 5s; plate proximity pauses autoplay.

**Reduced Motion**

* Static reveal, no auto‑advance (manual only).

---

## **8\) Location & CTA (מיקום ושעות)**

**Map Hint**

* Map thumbnail parallax (y: 8px) on scroll; pin icon bounces once on entrance (back ease, 0.5s).

**CTA Row**

* Primary (הזמנת שולחן) and secondary (הגעה/ניווט). Magnetic plate highlights the primary.

**Mobile**

* Sticky CTA at bottom appears after 60% scroll; slides in from right.

---

## **9\) Footer**

* Link underlines pour from right on hover/focus.

* Newsletter field: label moves 4px right on focus; success tick draws (SVG stroke) after submit.

---

## **10\) Micro‑Interactions (Reusable)**

* **Underline Pour**

gsap.fromTo(el, { scaleX:0, transformOrigin:'100% 50%' }, { scaleX:1, duration:0.35, ease:'power2.out' });

* **Button Press**

gsap.to(btn, { duration:0.08, y:1, boxShadow:'0 0 0 0 rgba(0,0,0,0.2)' });

* **Card In**

gsap.from(card, { x:30, opacity:0, duration:0.5, ease:'power3.out' });

* **Specular Sweep on Text** (gradient mask animate from right→left on hover / scroll arrival)

---

## **11\) Accessibility & Reduced Motion**

* `prefers-reduced-motion` → replace path flights with fades; remove pinned rail; plate static.

* Focus outlines are always visible; plate never hides cursor for keyboard users.

* Ensure contrast on glow/underlines meets WCAG; disable auto‑advance carousels.

---

## **12\) Asset & Tech Spec**

* **Plate**: SVG primary (2–3 variants for angle/highlight), fallback PNG @2x.

* **Garnish**: 6–8 SVG sprites, tiny (≤6kb each) for particles.

* **Images**: AVIF/WebP \+ JPG fallback; hero ≤320kb, subsequent ≤160kb; `srcset` responsive.

* **Z‑Index Layers**: plate 30, UI 20, particles 15, photos 10, background 0\.

* **State Machine**: CSS classes `is-hovered`, `is-pressed`, `is-success` toggled for plates and targets.

---

## **13\) Implementation Order (Home Page)**

1. **Shell**: RTL layout, nav, sections, plate object.

2. **Hero**: path flight, SplitText title, CTA polish.

3. **Pinned Rail**: A→B→C with scrub \+ mobile swipe alt.

4. **Sampler Carousel**: magnet interactions.

5. **Social Proof, Location, Footer**: entrances \+ microinteractions.

6. **Reduced Motion/A11y**, performance pass, QA.

---

## **14\) QA Checklist (Key Frames & Haptics)**

* Plate flight never blocks clicks; pointer events on plate are `none` where needed.

* Scroll framerate ≥ 55fps on mid‑range mobile; smoke disabled on low‑end.

* RTL arrow logic and swipe directions correct.

* Keyboard tab order matches visual order.

* Motion halts when window is unfocused.

---

## **15\) Optional “Awwwards‑grade” Flourishes (Use Sparingly)**

* **Audio micro‑SFX** (muted by default): single “clink” when plate lands; gentle crackle in Fire scene.

* **Cursor trails**: 2–3 frame ephemeral sauce/shine streaks at 5–8% opacity.

* **Color‑reactive Plate**: hero background hue subtly tints plate reflection per section.

Net effect: playful elegance with controlled, purposeful motion. The plate guides the eye, reinforces RTL reading flow, and always supports content—not the other way around.

