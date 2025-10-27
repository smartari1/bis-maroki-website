awesome concept. here’s a crisp, build-ready motion plan that turns a **plate** (צלחת) into the hero object: it’s both the custom cursor on desktop and a playful, tactile object that drives navigation and micro-interactions—balanced for RTL Hebrew and great mobile UX.

# **Core motion system (global)**

**GSAP stack**

* **Core**: `gsap`, `timeline`, `context` (React), `matchMedia`.

* **Plugins**:  
   `ScrollTrigger` (scroll choreography), `Flip` (layout morphs), `MotionPathPlugin` (plate path moves), `InertiaPlugin` (throw & ease), `Draggable` (mobile/desktop dragging), `ScrollToPlugin` (smart jumps), `TextPlugin` (headline reveals), `Observer` (gesture shortcuts), `SplitText` (hero typography flourish), `MorphSVGPlugin` (SVG garnish).

* **Accessibility & RTL**

  * Respect `prefers-reduced-motion` with a `matchMedia` branch; switch animations to fades/instant layout.

  * Hebrew RTL: set logical `transform-origin` (e.g., `100% 50%`) so reveals swipe **right→left**. Directional easing should feel native (entrances from the **right**).

* **Performance guardrails**

  * Use GPU transforms only (`x/y/scale/rotation`, `opacity`).

  * Pre-size hero images; lazyload below the fold; `will-change` sparingly; pause offscreen `ScrollTrigger`s; `gsap.ticker.lagSmoothing(500, 33)`.

* **Plate (cursor/object)**

  * Desktop: custom cursor hidden; SVG/PNG plate follows with slight lag (`lerp` via `gsap.quickTo`) and **magnetic** attraction near interactive elements (links, CTAs).

  * Mobile: plate becomes a **draggable chip** pinned to corner; swipe/throw to trigger mini actions (open menu, peek item, scroll next section) powered by `Draggable + Inertia`.

  * **States:** idle (gentle float \+ parallax garnish), hover (tilt/shine), press (scale-down \+ “clink” SFX if audio allowed), success (confetti of sesame/parsley SVGs).

---

# **Information architecture (CMS-aware)**

Single `Dish` model with `type: ['restaurant','מגשי אירוח','event']` and shared fields (title, price, media, tags, spice, allergens). This mirrors your real menu content (e.g., פטה כבד, טורטייה בשר טחון, קובות, שניצל, סלטים, קינוחים; טריי/אירוח items, ילדים/אירוע bundles) so we can animate real data, not placeholders.

---

# **Page-by-page animation blueprint**

## **1\) Home (דף הבית)**

**Narrative:** “From the plate outward.”

1. **Hero “plate stage”**

   * The plate drops in along a curved **MotionPath** from the top-right (RTL friendly), settles with a soft bounce (`ease: 'out(1.2, 0.8)'`), and casts a dynamic shadow.

   * Headline (SplitText) reveals letter groups from right to left, staggered with a spice-dust wipe (SVG mask).

2. **Interactive menu teaser**

   * Hover/drag plate over category chips (בשרים, סלטים, קובה, קינוחים) to **magnetically snap** and preview items as looping mini scenes (gif/webm): e.g., פטה כבד → a short gleam; קובה → steam puff.

3. **Scroll storytelling**

   * `ScrollTrigger` pins the hero; as you scroll, the plate **guides** you through three beats:

     * **חומרי גלם**: plate tilts; garnish sprinkles sweep across text blocks (clipPath reveals).

     * **אש ועשן**: parallax flame/smoke layers subtly move; plate picks up a char mark texture.

     * **אירוח/אירועים**: plate duplicates (Flip) into **tray** layout to hint at מגשי אירוח.

4. **Call to action strip**

   * Plate nudges the primary CTA button on approach (scale \+ border highlight) to encourage click.

**Mobile adaptations**

* No custom cursor; plate docked as a floating button. Swipe right-to-left across hero to cycle beats; haptic cues on iOS/Android if allowed.

## **2\) Menu list (כל המנות)**

**Goal:** fast scanning with delightful depth—never cluttered.

* **Filter toggle → Flip transitions**  
   Tapping filters (קטגוריה/כשרות/חריפות/מחיר) morphs the grid with `Flip`—cards keep visual continuity as they reorder.

* **Card entrances**  
   RTL “slide-in from right” with small overshoot; images scale from 0.96→1 on settle.

* **Plate-assisted focus**  
   Hovering a card draws a subtle arc line from the plate to the card; the plate edge reflects the hero color of the category (e.g., קובה=deep red, סלטים=green).

* **Infinite scroll sentinel**  
   When sentinel enters view, stagger next batch with `ScrollTrigger.batch()`.

**Data examples (mapped to CMS)**

* *Restaurant type*: פטה כבד, סיגר מרוקאי חריף, קובה סלק, חציל בטחינה, שניצל/כריכים, קינוחים כמו בקלאווה/שמרים.

* *מגשי אירוח type*: קומבינציות כריכים \+ סלטים \+ קינוחים, מינימום הזמנה 10–20, תמחור פר-אדם.

## **3\) Menu item experience (דף מנה)**

**Micro-journey:** approach → examine → decide.

* **Hero morph**  
   From list click, the card **Flip**s to full screen; plate rotates behind as a halo.

* **360/zoom**  
   On hover/drag, image pans subtly; spice grains animate on `mousemove` (clipped).

* **Ingredient chips**  
   Stagger in from the right; hovering a chip highlights the relevant zone on the photo (masked glow).

* **Portion/price interactions**  
   Toggling “מגש/מנה אישית/אירוע” animates weight/price counters with `TextPlugin`.

* **Add to order**  
   On click, plate skims along a path to the cart icon, leaving a brief “sauce trail”.

**Examples**  
 Kubeh soups (סלק/חמוסטה) show a rising steam loop; tortillas and כריכים show parchment slide-under; שניצל shows crisp crumb sparkle.

## **4\) About (אודות)**

**Texture & warmth, light on motion.**

* **Timeline of the kitchen**  
   `ScrollTrigger` reveals photos right→left with gentle parallax; plate acts as a **scrubber**—dragging it scrubs the timeline (Observer \+ Draggable).

* **Values marquee**  
   Horizontal RTL marquee (calibrated for reduced motion); tap/hover pauses.

## **5\) Restaurant page (מסעדה)**

* **Sections:** אווירה, תפריט נבחר, מנות היום, הזמנה לשולחן.

* **“Chef’s pick” spin**  
   Plate spins 120° to highlight 3 featured dishes; small **clink** when a pick locks in (scale/shine).

* **Live badges**  
   “מנה חדשה/אזלה” badges pop (scale 0.8→1.0 bounce) on data change.

**Tie to content**  
 Feature popular starters (פטה כבד, סיגרים), קובה, סלטים, וכריכים like חלה שניצל.

## **6\) מגשי אירוח page (שירות נפרד)**

* **Tray morph**  
   Plate **morphs to a platter** (Flip or MorphSVG) revealing a grid of “per-person” bundles; scrolling cycles **3-item bundle → 2-item light** offers.

* **Configurator**  
   As users tick salad/dessert options, the platter fills with thumbnails that slide into place; totals count up smoothly.

**Tie to content**  
 Bundles with 3 עיקריות \+ 2 סלטים \+ קינוחים, מינימום הזמנה ותוספות—exactly as בפרטי מגשי אירוח.

## **7\) Events ordering (אירועים)**

* **Flow**  
   Stepper with a progress **ring** around a mini-plate icon. Each step (מיקום/תאריך/כמות/תפריט) slides in from the right; on back, animate the exact reverse (feels native RTL).

* **Preset menus**  
   Selecting “אירוע קל/בינוני/פרימיום” animates trays assembling from chosen items (Flip between presets).

---

# **Micro-interactions library (sprinkle, not overkill)**

* **Link hover**: subtle underline that “pours” in from the right.

* **Buttons**: border draws clockwise; on press, a quick inner shadow.

* **Tabs/filters**: plate pings the active tab with a micro-nudge.

* **Form fields**: label slides right→left by 4–6px on focus; validation shakes very lightly on error.

* **Loading states**: looping garnish swirl; cap to ≤600ms before showing skeletons.

---

# **Technical integration (Next.js \+ GSAP)**

**Component pattern**

 // useGsapPlate.ts  
export function useGsapPlate(refs) {  
  const ctx \= useGSAP(() \=\> {  
    // timelines & ScrollTriggers here  
  }, { scope: refs.root });  
  useEffect(() \=\> () \=\> ctx.revert(), \[\]);  
}

*   
* **Route transitions**  
   Keep the plate persistent in a layout; pages enter/exit underneath via `Flip` to maintain continuity.

* **Data-driven motion**  
   Category → hue mapping; spice level → particle intensity; availability → badge animation.

**Reduced motion**

 gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () \=\> {  
  gsap.globalTimeline.timeScale(0); // or skip registering certain triggers  
});

* 

---

# **Content hooks from your real menu (for authentic previews)**

* Starters & bites: פטה כבד, סיגר מרוקאי, טורטייה בשר טחון, קרואסון אסאדו; sides like חציל/כרובית; מרקי קובה (סלק/חמוסטה); שניצל וגרסאות כריכים; קינוחים (בקלאווה, שמרים).

* מגשי אירוח bundles: 3 עיקריות לאדם \+ סלטים \+ קינוחים; אופציות כריכים (ביס מרוקאי, טורטייה אסאדו/מעורב, קרואסון סצ'ואן, בייגל קורנדביף, פרנה אנטריקוט, סביח, המבורגר, קבב), תמחור ומינימום הזמנה.

---

# **Build sequence (6 focused sprints)**

1. **Motion foundations**: plate cursor/object, matchMedia, a11y/reduced-motion.

2. **Home**: hero path, 3-beat scroll story, CTA behaviors.

3. **Menu list**: Flip filters, card choreography, infinite loader.

4. **Menu item**: Flip from grid, ingredient chips, add-to-order animation.

5. **Restaurant & מגשי אירוח**: page-specific tray morphs, configurator.

6. **Events & About**: stepper, timeline scrubber, polish pass.

---

# **Guardrails (balance & taste)**

* Keep **hero timelines under 2s**; non-blocking—content accessible immediately.

* Limit **pinned** sections to 1–2 per page.

* Avoid constant parallax; prefer **scene-based** motion with clear starts/ends.

* Always provide **motionless affordances** (icons, labels) so meaning isn’t hidden in animation.

