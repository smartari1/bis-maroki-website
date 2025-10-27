# **ביס מרוקאי — Brand Color & Design System**

Derived from the logo and Instagram visual language: warm Moroccan street-food energy, authentic yet modern. No dark mode; single light theme. Colors reflect sun-baked spice, grilled textures, and bold contrasts. RTL Hebrew as default.

---

## **1\) Core Brand Palette**

| Role | Token | HEX | Description |
| ----- | ----- | ----- | ----- |
| **Primary Base** | `--brand-beige` | `#F5E4D2` | Background tone (matches logo background). Warm neutral, evokes bread/pita tone. |
| **Primary Text** | `--brand-black` | `#1A1A1A` | For main typography. Deep ink-black, used for headlines and body. |
| **Accent Red** | `--brand-red` | `#D34A2F` | From logo diamond dots. Energetic, spicy tone. Used for highlights, hover, CTAs. |
| **Accent Burnt Orange** | `--brand-orange` | `#E0723E` | Secondary spice hue; subtle gradients with red. |
| **Warm Brown** | `--brand-brown` | `#7C4A27` | For food tones, dividers, and hover overlays. |
| **Soft Cream** | `--brand-cream` | `#FFF6ED` | Lighter surface section background (contrast with beige). |
| **Herb Green** | `--brand-green` | `#4F6A3C` | Accent for freshness (used in parsley/garnish cues, status good). |
| **Charcoal Gray** | `--text-gray` | `#3E3E3E` | Secondary text, labels, muted info. |

---

## **2\) Extended Palette (Functional Tokens)**

| Function | Token | HEX | Usage |
| ----- | ----- | ----- | ----- |
| **Success** | `--color-success` | `#4E8A4E` | Small status chips or confirmations. |
| **Warning** | `--color-warning` | `#E3A53B` | Caution messages, limited use. |
| **Error** | `--color-error` | `#C74444` | Validation errors. |
| **Border Light** | `--border-light` | `#E7D7C3` | Subtle lines, card separators. |
| **Border Strong** | `--border-strong` | `#C7A88C` | Emphasis lines or buttons. |

---

## **3\) Typography \+ Color Pairing**

**Headlines (Hero / Section titles)**

* Color: `var(--brand-black)`

* Accent letter dots or separators in `var(--brand-red)`.

**Body Text**

* Color: `var(--text-gray)` (80–90% opacity for soft contrast).

**Links & CTAs**

* Default: `var(--brand-black)`

* Hover: `var(--brand-red)` \+ underline animation from right.

**Buttons**

* Primary: background `var(--brand-red)`, text `#FFFFFF`

  * Hover: gradient `linear-gradient(90deg, #D34A2F, #E0723E)`

  * Active: slightly darker `#B93F25`

* Secondary: border `var(--brand-brown)` on `--brand-beige` background.

**Disabled/Muted States**

* Text `#999`

* Background `#EFE7DE`

---

## **4\) Surfaces & Backgrounds**

| Layer | Color | Notes |
| ----- | ----- | ----- |
| **Page Background** | `var(--brand-beige)` | main page background color. |
| **Section Alternate** | `var(--brand-cream)` | used to separate blocks gently. |
| **Cards** | `#FFFFFF` | solid white for menu cards or modals. |
| **Hover Overlay** | `rgba(0,0,0,0.05)` | minimal shadow or overlay for interactive depth. |

---

## **5\) Shadows & Depth**

Minimal, soft shadows with warm tone.

\--shadow-sm: 0 1px 2px rgba(60,30,10,0.08);  
\--shadow-md: 0 3px 6px rgba(60,30,10,0.12);  
\--shadow-lg: 0 8px 16px rgba(60,30,10,0.16);

Use only on cards and modals. Avoid cold blue/gray shadows.

---

## **6\) Imagery Integration**

**Photography** from Instagram feed drives the warmth:

* Backgrounds neutral (beige/cream) to let rich food colors pop.

* No strong gradients behind dishes.

* For overlays/text on photos → use `rgba(0,0,0,0.4)` mask or warm brown gradient.

**Image frames / borders**

* Thin `var(--border-strong)` line for gallery thumbnails.

* Hover: light `--brand-orange` tint overlay.

---

## **7\) Logo Handling**

**Logo Background:** always on `#F5E4D2` or white.  
 **Logo Elements:** red/orange must remain unchanged. Do not recolor.  
 **Minimum Contrast:** maintain 4.5:1 with background.

---

## **8\) GSAP Animation Colors**

Integrate with motion plan:

* **Plate highlight** reflection uses `--brand-red` → `--brand-orange` gradient.

* **Garnish particles** alternate between `--brand-green` and `--brand-brown`.

* **CTA hover glow** uses soft `--brand-orange` outer glow.

* **Scene transitions** fade backgrounds between `--brand-beige` and `--brand-cream`.

---

## **9\) Accessibility & Contrast**

* Minimum body text contrast: 4.5:1 vs. background.

* Accent red used sparingly on light beige—prefer pairing with darker text or outlines.

* Keep readability across phones and outdoor light conditions.

---

## **10\) System Usage Tokens (CSS Variables)**

:root {  
  \--brand-beige: \#F5E4D2;  
  \--brand-black: \#1A1A1A;  
  \--brand-red: \#D34A2F;  
  \--brand-orange: \#E0723E;  
  \--brand-brown: \#7C4A27;  
  \--brand-cream: \#FFF6ED;  
  \--brand-green: \#4F6A3C;  
  \--text-gray: \#3E3E3E;  
  \--border-light: \#E7D7C3;  
  \--border-strong: \#C7A88C;  
  \--color-success: \#4E8A4E;  
  \--color-warning: \#E3A53B;  
  \--color-error: \#C74444;  
  \--shadow-sm: 0 1px 2px rgba(60,30,10,0.08);  
  \--shadow-md: 0 3px 6px rgba(60,30,10,0.12);  
  \--shadow-lg: 0 8px 16px rgba(60,30,10,0.16);  
}

---

## **11\) Implementation Guidelines**

* Keep overall **warm hue bias**: avoid pure white or blue-gray.

* Limit bright red usage to \<10% of screen area.

* Use beige and cream as breathing space.

* Ensure food photography dominates color emotion; UI should frame, not compete.

---

## **12\) Testing**

* Visual test on iPhone sunlight and Android OLED for color accuracy.

* Use Chrome devtools to emulate color vision deficiencies.

* Adjust saturation ±10% if needed for readability.

---

**Result:** A cohesive, warm, appetizing brand feel — spicy Moroccan vibes translated into modern digital surfaces that feel premium yet authentic.

