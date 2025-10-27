# ביס מרוקאי (Moroccan Restaurant Website)

## Project Overview

A premium Moroccan restaurant website featuring an Awwwards-style motion system with a unique "plate" (צלחת) cursor/object that drives interactions. The site serves as both a restaurant menu showcase and booking platform for catering (מגשי אירוח) and events (אירועים).

**Target Users:**
- Restaurant customers browsing the menu
- Event planners booking catering services
- Restaurant staff managing content via custom CMS

**Business Context:**
Hebrew-first RTL design showcasing authentic Moroccan street food including פטה כבד, קובה soups, טורטייה בשר טחון, כריכים, salads, and desserts like בקלאווה.

**Tech Stack:**
- **Frontend:** Next.js 14+ (App Router), React 18, GSAP (ScrollTrigger, Flip, MotionPath, Draggable, Inertia, SplitText, MorphSVG), Anime.js for UI animations, Tailwind CSS
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** MongoDB with Mongoose ODM
- **Storage:** Cloudflare R2 (media assets with variants pipeline)
- **CMS:** Custom built-in admin with Mantine UI (RTL)
- **Infrastructure:** Vercel hosting, Cloudflare (DNS, domain, R2 bucket)
- **Forms:** Zod validation
- **Icons:** Streamline HQ

## Project Context

This is a single-codebase Next.js application combining:
1. Public-facing restaurant website with premium animations
2. Built-in CMS at `/admin` for content management
3. Three content scopes: RESTAURANT (menu items), CATERING (מגשי אירוח bundles), EVENT (אירועים packages)

**Key Differentiators:**
- **Motion-First Design:** GSAP-powered animations are core to the experience, not decorative
- **Plate System:** A virtual "plate" object serves as both desktop cursor and mobile interaction driver
- **RTL Hebrew:** All content and UI are RTL-first with no i18n (Hebrew only)
- **No Auth Complexity:** Single password-gated admin (no user accounts)
- **Hardcoded Pages with Dynamic Content:** Page layouts/animations in code, content from database
- **Single Production Database:** Small project - one production database for all environments (dev, staging, prod)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                     │
├─────────────────────────────────────────────────────────────┤
│  Public Routes          │  Admin Routes (/admin/*)          │
│  - Home (/)            │  - Login (password gate)           │
│  - Menu (/menu)        │  - Dishes CRUD                     │
│  - Restaurant          │  - Categories                      │
│  - Catering            │  - Bundles (מגשי אירוח)            │
│  - Events              │  - Menus                           │
│  - About               │  - Media (R2 upload)               │
│                        │  - Settings                        │
├─────────────────────────────────────────────────────────────┤
│            Next.js API Routes (/api/*)                      │
│  Public:  /api/public/dishes, /api/public/menus            │
│  Admin:   /api/admin/* (CRUD, media sign, revalidate)      │
├─────────────────────────────────────────────────────────────┤
│  MongoDB (Mongoose)         │  Cloudflare R2                │
│  Collections:               │  - Original media files        │
│  - dishes                   │  - Generated variants          │
│  - categories               │    (thumb/card/hero)          │
│  - bundles                  │  - AVIF/WebP formats          │
│  - menus                    │                               │
│  - media                    │                               │
│  - seo_meta                 │                               │
│  - settings (singleton)     │                               │
└─────────────────────────────────────────────────────────────┘
```

### Motion System Architecture

**GSAP Plugin Stack:**
- `ScrollTrigger` - Scroll choreography and pinned sections
- `Flip` - Layout morphs (list → detail, plate → platter)
- `MotionPathPlugin` - Plate curved paths
- `InertiaPlugin` - Throw physics on mobile
- `Draggable` - Mobile plate chip interactions
- `ScrollToPlugin` - Smart section jumps
- `TextPlugin` - Numeric counters, price animations
- `Observer` - Gesture shortcuts
- `SplitText` - Hero headline reveals (letter-by-letter)
- `MorphSVGPlugin` - SVG shape transitions (plate → platter)

**Plate System (Global):**
- **Desktop:** Custom cursor with magnetic attraction to CTAs/links
- **Mobile:** Draggable chip in corner; swipe gestures trigger actions
- **States:** idle (float), hover (tilt/shine), press (scale), success (confetti)

### Content Model Philosophy

**Hardcoded Pages with Dynamic Content:**
- Page layouts, structure, and animations are defined in code
- Content (dishes, bundles, text) is pulled from the database
- Restaurant owner manages content via admin CMS
- Design/animation changes require developer involvement

**Database Models:**
- Single `Dish` model with `type` field supports all use cases:
  - `RESTAURANT` - Individual menu items (פטה כבד, קובה, כריכים)
  - `CATERING` - Items available in מגשי אירוח bundles
  - `EVENT` - Special event-only items
- `Bundle` model handles מגשי אירוח with per-person pricing and composition rules (e.g., 3 mains + 2 salads + dessert)
- `Menu` model for organizing dishes into curated collections
- `Settings` singleton for global content (brand, contact, hours)

## Directory Structure

```
/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx             # Home page (hero + story rail)
│   │   ├── menu/
│   │   │   ├── page.tsx         # Menu list with filters
│   │   │   └── [slug]/page.tsx  # Individual dish page
│   │   ├── restaurant/page.tsx  # Restaurant info page
│   │   ├── catering/page.tsx    # מגשי אירוח page
│   │   ├── events/page.tsx      # אירועים page
│   │   └── about/page.tsx       # About page
│   ├── admin/                    # Admin routes (password-gated)
│   │   ├── layout.tsx           # Mantine RTL layout
│   │   ├── login/page.tsx       # Password gate
│   │   ├── dashboard/page.tsx   # Admin dashboard
│   │   ├── dishes/              # Dish CRUD
│   │   ├── bundles/             # Bundle CRUD
│   │   ├── menus/               # Menu composer
│   │   └── media/               # Media library
│   ├── api/
│   │   ├── public/              # Public cached endpoints
│   │   │   ├── dishes/
│   │   │   │   ├── route.ts    # GET list with filters
│   │   │   │   └── [slug]/route.ts
│   │   │   └── menus/[slug]/route.ts
│   │   └── admin/               # Admin CRUD + utils
│   │       ├── dishes/route.ts
│   │       ├── media/
│   │       │   ├── sign/route.ts      # R2 signed upload
│   │       │   └── finalize/route.ts  # Variant generation
│   │       └── revalidate/route.ts
│   ├── layout.tsx               # Root layout (fonts, RTL)
│   └── globals.css              # Tailwind + CSS vars
├── components/
│   ├── motion/                  # GSAP-powered components
│   │   ├── PlateSystem.tsx     # Global plate cursor/chip
│   │   ├── HeroStage.tsx       # Home hero with path drop
│   │   ├── StoryRail.tsx       # Pinned A→B→C scenes
│   │   ├── MenuSampler.tsx     # Carousel with plate magnet
│   │   └── useGsapTimeline.ts  # Reusable GSAP hook
│   ├── admin/                   # Mantine admin components
│   │   ├── AdminShell.tsx      # RTL sidebar layout
│   │   ├── DishEditor.tsx
│   │   ├── BundleForm.tsx
│   │   ├── MenuForm.tsx
│   │   └── MediaPicker.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── DishCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── CtaButton.tsx
│   └── layout/
│       ├── Header.tsx           # RTL nav (animated underlines)
│       └── Footer.tsx
├── lib/
│   ├── db/
│   │   ├── mongoose.ts          # MongoDB connection
│   │   └── models/              # Mongoose schemas
│   │       ├── Dish.ts
│   │       ├── Bundle.ts
│   │       ├── Menu.ts
│   │       ├── Media.ts
│   │       ├── Category.ts
│   │       ├── SeoMeta.ts
│   │       └── Settings.ts
│   ├── r2/
│   │   ├── client.ts            # Cloudflare R2 SDK
│   │   ├── upload.ts            # Signed upload logic
│   │   └── variants.ts          # Image processing pipeline
│   ├── auth/
│   │   └── gate.ts              # Password HMAC verification
│   ├── validation/              # Zod schemas
│   │   ├── dish.schema.ts
│   │   └── bundle.schema.ts
│   └── utils/
│       ├── gsap-helpers.ts      # GSAP utility functions
│       ├── rtl.ts               # RTL text helpers
│       └── slugify.ts           # Hebrew → Latin slug
├── public/
│   ├── assets/
│   │   ├── plate.svg            # Plate cursor variants
│   │   ├── garnish/             # Sesame/parsley sprites
│   │   └── paths/               # Hero drop paths (SVG)
│   └── fonts/                   # Hebrew web fonts
├── middleware.ts                # Admin auth check
└── package.json
```

## Development Guidelines

### Code Style & Conventions

**TypeScript:**
- Strict mode enabled
- Explicit return types for functions
- Use `interface` for object shapes, `type` for unions
- Mongoose models use `Document` types

**React:**
- Functional components only
- Use `use client` directive for client-side motion components
- Server components by default in App Router
- Custom hooks prefixed with `use` (e.g., `useGsapPlate`)

**Naming:**
- Components: PascalCase (`DishCard.tsx`)
- Utilities: camelCase (`slugify.ts`)
- Constants: UPPER_SNAKE_CASE
- CSS variables: `--brand-beige`, `--text-gray`

**RTL Conventions:**
- All text content in Hebrew (`_he` suffix in DB)
- Transform origins biased to right: `transformOrigin: '100% 50%'`
- Entrances default from right → left
- Horizontal reveals/carousels move rightward by default

### GSAP Best Practices

**Performance:**
- Only animate `transform` (x/y/scale/rotation) and `opacity`
- Use `will-change` sparingly, remove after animation
- Pause/destroy off-screen `ScrollTrigger` instances
- Pre-size hero images; lazy-load below fold
- `gsap.ticker.lagSmoothing(500, 33)` set globally

**Reduced Motion:**
```typescript
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  // Replace path flights with fades
  // Remove pinned sections
  // Keep plate static
});
```

**Timeline Cleanup:**
```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Create timelines here
  }, scope);
  return () => ctx.revert(); // Cleanup on unmount
}, []);
```

**Accessibility:**
- All interactive elements remain usable without motion
- Plate never hides cursor for keyboard users
- Focus outlines always visible
- Provide motionless affordances (icons, labels)

### MongoDB/Mongoose Patterns

**Connection:**
```typescript
// lib/db/mongoose.ts
// Singleton connection with caching for serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
```

**Indexes:**
- Unique indexes on all slug fields
- Compound index: `{ type: 1, categoryId: 1, status: 1 }` for dish lists
- Create indexes in model definitions

**Validation:**
- Use Mongoose schema validation AND Zod for API payloads
- Sanitize rich text HTML (strip scripts)
- Enum constraints on status, type fields

### Admin Security Rules

- Single password in `ADMIN_SECRET` env var
- HMAC-signed cookie (`admin_session`) with 12h expiry
- Rate limit: 5 attempts / 10 minutes on `/admin/login`
- CSRF token on admin POSTs
- Same-site cookies
- Optional IP allowlist in production

## Common Tasks

### Setup & Installation

```bash
# Clone repo
git clone <repo-url>
cd moroccan-restaurant

# Install dependencies
npm install

# Set up environment variables (see Environment Variables section)
cp .env.example .env.local

# MongoDB Atlas connection is already configured in .env.local
# Note: We use a single production database for all environments

# Seed database with initial data
npm run db:seed

# Start dev server
npm run dev
```

**Prerequisites:**
- Node.js 20+
- MongoDB Atlas account (production database only)
- Cloudflare R2 bucket configured
- **Note:** All GSAP plugins (including SplitText, MorphSVG, Flip, InertiaPlugin) are FREE to use - no Club membership required!

**Important:** This is a small project using a single production database. Be cautious when making data changes during development.

### Running the Project

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Start production server (after build)
npm start

# Admin login
# Navigate to http://localhost:3000/admin/login
# Use password from ADMIN_SECRET env var
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test:watch

# E2E tests (Playwright)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Specific test file
npm test -- path/to/test.test.ts
```

**Testing Strategy:**
- **Unit:** Zod schema validation, utility functions
- **Integration:** API routes with mock MongoDB
- **E2E:** Admin CRUD flows, publish workflow, preview mode
- **Visual:** Chromatic-style diffs for hero and story rail animations

### Deployment

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables Required:**
- `MONGODB_URI`
- `ADMIN_SECRET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_ACCOUNT_ID`
- `PUBLIC_BASE_URL`
- **Note:** No GSAP_BONUS_KEY needed - all plugins are free!

**Build Configuration:**
- Output: Standalone
- Node.js: 20.x
- Build command: `npm run build`
- Install command: `npm install`

**Post-Deployment:**
1. Run seed script to populate initial data
2. Upload media assets via admin
3. Configure DNS in Cloudflare
4. Test password gate and admin access
5. Enable ISR revalidation webhooks

### Content Management Workflows

**Creating a New Dish:**
1. Login to `/admin/login`
2. Navigate to Dishes → New
3. Fill in Hebrew title, slug (auto-transliterated), type (RESTAURANT/CATERING/EVENT)
4. Upload media to R2 (generates variants automatically)
5. Set price, spice level, allergens, badges
6. Add to category
7. Save as DRAFT → Preview → Publish
8. System auto-revalidates menu pages

**Building a מגש אירוח (Catering Bundle):**
1. Navigate to Bundles → New
2. Set title, base price per person, min/max persons
3. Define composition: `{ mains: 3, salads: 2, desserts: 1 }`
4. Upload platter hero image
5. Save → revalidates `/catering` page

**Updating Global Settings:**
1. Navigate to Settings
2. Update brand info (name, logo)
3. Update contact details (phone, WhatsApp, email)
4. Update location and hours
5. Changes automatically reflect on all pages

## Key Files & Their Purpose

### Motion System

**`components/motion/PlateSystem.tsx`**
- Global plate cursor/chip implementation
- Handles desktop follow logic with `gsap.quickTo`
- Mobile draggable with `Inertia` and `Draggable`
- Magnetic attraction to interactive elements
- State management (idle, hover, press, success)

**`components/motion/useGsapTimeline.ts`**
- Reusable hook for GSAP timeline creation
- Auto-cleanup with `gsap.context`
- Reduced motion branch logic
- Scoped to component ref

**`lib/utils/gsap-helpers.ts`**
- Common GSAP patterns (underline pour, button press, card entrance)
- RTL-aware entrance directions
- Magnetic pull calculations
- Specular sweep utilities

### Database Models

**`lib/db/models/Dish.ts`**
- Main content model with type discrimination
- Supports RESTAURANT, CATERING, EVENT
- References to Category, Media, SeoMeta
- Status workflow: DRAFT → SCHEDULED → PUBLISHED
- Slug uniqueness enforced

**`lib/db/models/Settings.ts`**
- Singleton for global site configuration
- Brand information (name, logo)
- Contact details (phone, WhatsApp, email)
- Location and operating hours
- Used across all hardcoded pages

### API Routes

**`app/api/public/dishes/route.ts`**
- Public GET endpoint with query filters (type, category, search)
- Cached at edge (5m TTL)
- Returns published dishes only
- Includes populated media and category

**`app/api/admin/media/sign/route.ts`**
- Generates signed R2 upload URLs
- 15-minute expiry
- Returns presigned PUT URL for direct upload

**`app/api/admin/media/finalize/route.ts`**
- Post-upload processing
- Generates variants (thumb: 150px, card: 800px, hero: 1600px)
- Creates AVIF and WebP formats
- Generates blurDataURL with sharp
- Stores Media document with all URLs

## Database Schema

### Core Collections

**dishes:**
```typescript
{
  _id: ObjectId,
  title_he: string,
  slug: string (unique),
  type: 'RESTAURANT' | 'CATERING' | 'EVENT',
  categoryId: ObjectId (ref: categories),
  description_he: RichText JSON,
  price: number,
  currency: 'ILS',
  spiceLevel: 0-3,
  isVegan: boolean,
  isVegetarian: boolean,
  isGlutenFree: boolean,
  allergens: string[],
  mediaIds: ObjectId[] (ref: media),
  badges: string[],
  availability: 'AVAILABLE' | 'OUT_OF_STOCK' | 'SEASONAL',
  nutrition: object,
  options: object,
  seoId: ObjectId (ref: seo_meta),
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
  publishAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**bundles:**
```typescript
{
  _id: ObjectId,
  title_he: string,
  slug: string (unique),
  description_he: RichText JSON,
  basePricePerPerson: number,
  minPersons: number (default: 10),
  maxPersons: number,
  includes: { mains: number, salads: number, desserts: number },
  allowedDishIds: ObjectId[] (ref: dishes),
  mediaIds: ObjectId[] (ref: media),
  seoId: ObjectId (ref: seo_meta),
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
  publishAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**media:**
```typescript
{
  _id: ObjectId,
  kind: 'IMAGE' | 'VIDEO' | 'SVG' | 'AUDIO',
  fileKey: string (R2 key),
  url: string (public URL),
  width: number,
  height: number,
  duration: number (video/audio),
  alt_he: string,
  focalPoint: { x: number, y: number },
  thumbnailUrl: string,
  blurDataUrl: string,
  meta: object,
  createdAt: Date,
  updatedAt: Date
}
```

### Key Indexes

```javascript
// Unique slugs
dishes: { slug: 1 } unique
bundles: { slug: 1 } unique
menus: { slug: 1 } unique

// Query optimization
dishes: { type: 1, categoryId: 1, status: 1 }
dishes: { status: 1, publishAt: 1 }
```

## Environment Variables

```bash
# Database - Single Production DB (used for all environments)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bismaroki-prod?retryWrites=true&w=majority&appName=bisMaroco
# Note: Small project - ONE production database for dev/staging/prod. Be careful with data changes!

# Admin Security
ADMIN_SECRET=your-strong-secret-key-here
# Used for HMAC cookie signing; rotate quarterly

# Cloudflare R2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=moroccan-restaurant-media
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# App Config
PUBLIC_BASE_URL=https://moroccan-restaurant.com
NODE_ENV=development

# GSAP - All plugins are FREE to use!
# No GSAP_BONUS_KEY required - SplitText, MorphSVG, Flip, InertiaPlugin are all free!

# Optional
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=600000
ADMIN_IP_ALLOWLIST=1.2.3.4,5.6.7.8
```

## Dependencies & Integrations

### Core Dependencies

**Frontend:**
- `next@14+` - React framework with App Router
- `react@18` - UI library
- `gsap@3.12+` - Animation engine
- `@gsap/react` - GSAP React wrapper
- `gsap/dist/*` - Premium plugins (Club membership required)
- `animejs@3+` - UI micro-animations
- `tailwindcss@3+` - Utility CSS
- `zod@3+` - Schema validation

**Admin UI:**
- `@mantine/core@7+` - Component library
- `@mantine/form` - Form state management
- `@mantine/hooks` - Utility hooks
- `@dnd-kit/core`, `@dnd-kit/sortable` - Drag-drop

**Database:**
- `mongoose@8+` - MongoDB ODM
- `mongodb@6+` - MongoDB driver

**Storage:**
- `@aws-sdk/client-s3` - R2 compatible client
- `@aws-sdk/s3-request-presigner` - Signed URL generation
- `sharp@0.33+` - Image processing

**Validation:**
- `zod@3+` - Runtime validation
- `dompurify` - HTML sanitization (server-side)
- `isomorphic-dompurify` - Universal sanitization

### External Services

**Cloudflare R2:**
- S3-compatible object storage
- Used for all media assets
- Variant generation pipeline
- Public bucket with CDN

**Vercel:**
- Hosting platform
- ISR (Incremental Static Regeneration)
- Edge caching (5m default for public APIs)
- Automatic deployments on push

**MongoDB Atlas (Recommended):**
- Hosted MongoDB
- Automatic backups
- Global distribution
- Connection pooling

### GSAP License - ALL PLUGINS FREE! 🎉

**All GSAP Plugins Are Free to Use:**
This project uses GSAP plugins - ALL of which are completely FREE (no Club membership required):
- SplitText (hero headline reveals)
- MorphSVG (plate → platter transitions)
- Flip (layout morphs)
- InertiaPlugin (mobile throw physics)
- ScrollTrigger
- Draggable
- MotionPathPlugin
- Observer
- TextPlugin
- ScrollToPlugin

See documentation at: https://greensock.com/docs/

## Known Issues & Gotchas

### GSAP-Specific

**Issue:** SplitText breaks with RTL Hebrew text wrapping
**Solution:** Pre-wrap text in `<span dir="rtl">` and apply SplitText to inner text. Force `direction: rtl` on split elements.

**Issue:** MotionPath autoRotate causes plate to flip upside-down on RTL curves
**Solution:** Set `autoRotate: false` and manually calculate rotation based on path tangent, adjusting for RTL.

**Issue:** ScrollTrigger pins cause layout shift on mobile when address bar hides
**Solution:** Use `pinnedContainer` option and set `anticipatePin: 1`. Add viewport meta tag with `interactive-widget=resizes-content`.

**Issue:** Flip animations judder when animating between pages
**Solution:** Use `absoluteOnLeave: true` in Flip config. Keep plate element in persistent layout wrapper outside page transitions.

### MongoDB/Mongoose

**Issue:** Mongoose connection times out in Vercel serverless functions
**Solution:** Use connection pooling with cached connection pattern. Set `serverSelectionTimeoutMS: 5000` in connection options.

**Issue:** Unique index errors on slug field during seed
**Solution:** Clear database before seeding or use `upsert` with `findOneAndUpdate` pattern.

**Issue:** Populated references return null for unpublished content
**Solution:** Add `{ status: 'PUBLISHED' }` filter in populate options or filter after populate.

### R2/Media

**Issue:** Variant generation times out on large images (>5MB)
**Solution:** Use streaming upload and resize in chunks. Add timeout to 60s in Vercel function config.

**Issue:** AVIF encoding fails on some PNG images with transparency
**Solution:** Convert to WebP instead for transparency. Use JPEG for opaque images before AVIF conversion.

**Issue:** Focal point calculations are incorrect for portrait images
**Solution:** Ensure `width > height` check before calculating x/y percentages. Swap dimensions for portrait.

### Admin/CMS

**Issue:** Block reordering causes animation glitches on preview
**Solution:** Force re-mount of animation components after reorder by changing React key to `${block.id}-${block.order}`.

**Issue:** Password rate limiting triggers false positives on Vercel preview deploys
**Solution:** Use deployment URL as rate limit key, not IP. Or disable rate limiting in preview environments.

**Issue:** Rich text editor inserts scripts despite sanitization
**Solution:** Run `dompurify.sanitize()` on both client and server. Configure to strip all `<script>` tags and `on*` handlers.

### RTL/Hebrew

**Issue:** Form validation messages show LTR in RTL layout
**Solution:** Wrap all error messages in `<bdi dir="rtl">` or set `dir="auto"` on form elements.

**Issue:** Numbers in Hebrew text flip direction
**Solution:** Wrap numbers in `<span dir="ltr">` or use Unicode directionality marks (U+200E LRM).

**Issue:** Underline animations pour from wrong direction
**Solution:** Always set `transformOrigin: '100% 50%'` (right edge) for RTL animations. Default is left edge.

### Performance

**Issue:** Home page initial load is slow (>3s FCP)
**Solution:** Preload hero image, defer GSAP premium plugins to after hero, use `loading="lazy"` below fold.

**Issue:** Scroll jank when multiple ScrollTriggers are active
**Solution:** Pause ScrollTriggers when elements are off-screen using `start: "top bottom+=100px"` to delay registration.

**Issue:** Mobile performance degrades with particles and parallax
**Solution:** Reduce particle count on mobile (`matchMedia`), disable parallax on `@media (hover: none)`.

## Additional Resources

### Documentation

- **GSAP Docs:** https://greensock.com/docs/
- **GSAP RTL Guide:** https://greensock.com/docs/v3/HelperFunctions/observers/IntersectionObserver
- **Next.js App Router:** https://nextjs.org/docs/app
- **Mongoose ODM:** https://mongoosejs.com/docs/
- **Mantine UI:** https://mantine.dev/
- **Cloudflare R2:** https://developers.cloudflare.com/r2/

### Internal Resources

- **Brand Guidelines:** See `ביס_מרוקאי___Brand_Color___Design_System.md`
- **Full Motion Plan:** See `full_pages_ui_plan.md`
- **Home Page Spec:** See `Home_page_plan.md`
- **CMS Architecture:** See `CMS_Plan.md`

### Design Tokens

**CSS Variables (from design system):**
```css
:root {
  --brand-beige: #F5E4D2;
  --brand-black: #1A1A1A;
  --brand-red: #D34A2F;
  --brand-orange: #E0723E;
  --brand-brown: #7C4A27;
  --brand-cream: #FFF6ED;
  --brand-green: #4F6A3C;
  --text-gray: #3E3E3E;
  --border-light: #E7D7C3;
  --border-strong: #C7A88C;
  --shadow-sm: 0 1px 2px rgba(60,30,10,0.08);
  --shadow-md: 0 3px 6px rgba(60,30,10,0.12);
  --shadow-lg: 0 8px 16px rgba(60,30,10,0.16);
}
```

### Common GSAP Patterns

**RTL Underline Pour:**
```typescript
gsap.fromTo(element, 
  { scaleX: 0, transformOrigin: '100% 50%' },
  { scaleX: 1, duration: 0.35, ease: 'power2.out' }
);
```

**Plate Magnetic Pull:**
```typescript
const magnet = (target: HTMLElement) => {
  target.addEventListener('mouseenter', () => {
    const rect = target.getBoundingClientRect();
    gsap.to('#plate', {
      x: rect.right - 20,
      y: rect.top + rect.height / 2,
      duration: 0.35,
      ease: 'power3.out'
    });
  });
};
```

**Flip Transition (List → Detail):**
```typescript
const state = Flip.getState('.dish-card');
// DOM changes happen here
Flip.from(state, {
  duration: 0.6,
  ease: 'power2.inOut',
  absolute: true,
  onEnter: elements => gsap.from(elements, { opacity: 0 })
});
```

### Troubleshooting Common Errors

**"Cannot find module '@gsap/*'"**
→ GSAP plugins not installed. Run `npm install gsap` (all plugins are free!).

**"MongoServerError: E11000 duplicate key error"**
→ Slug already exists. Check unique constraint on slug field. Clear DB or use different slug.

**"R2 SignatureDoesNotMatch error"**
→ R2 credentials incorrect or expired. Verify R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.

**"Admin session expired"**
→ Cookie expired after 12h idle. Re-login at `/admin/login`.

**"GSAP ScrollTrigger not triggering on mobile"**
→ Viewport height calculation incorrect. Use `start: "top bottom"` instead of fixed pixel values.

### Development Tips

1. **Use GSAP DevTools** in development (Chrome extension) to debug timelines
2. **Check RTL rendering** in both Chrome DevTools device emulation and real devices
3. **Test with reduced motion** enabled in OS settings to ensure fallbacks work
4. **Preview mode password** is same as admin password (set in `ADMIN_SECRET`)
5. **MongoDB Compass** recommended for viewing/editing data during development
6. **R2 Console** useful for verifying uploads and checking variants
7. **Vercel Preview URLs** auto-deploy on PR; use for stakeholder reviews
8. **Animation timing** can be globally slowed with `gsap.globalTimeline.timeScale(0.5)` for debugging

### Content Examples (Real Menu Items)

**Restaurant Dishes:**
- פטה כבד (spice: 1)
- סיגר מרוקאי חריף (spice: 3)
- קובה סלק (vegan option available)
- חציל בטחינה (vegetarian)
- שניצל / כריכים
- קינוחים: בקלאווה, שמרים

**מגשי אירוח Bundles:**
- Standard: 3 עיקריות + 2 סלטים + קינוחי
- Premium: טורטייה אסאדו/מעורב + קרואסון סצ'ואן + ביס מרוקאי options
- Minimum 10 persons, pricing per person

**Event Packages:**
- ילדים/איבוד bundles with specific configurations
- Customizable bread options (חלה שניצל)

---

## Quick Start Checklist

- [ ] Node.js 20+ installed
- [ ] MongoDB running (local or Atlas URI in env)
- [ ] Cloudflare R2 bucket created and credentials added
- [ ] GSAP installed (all plugins are FREE - no membership needed!)
- [ ] `npm install` completed
- [ ] `.env.local` configured with all required variables
- [ ] `npm run db:seed` executed successfully
- [ ] `npm run dev` running on http://localhost:3000
- [ ] Admin login working at http://localhost:3000/admin/login
- [ ] Test plate cursor on desktop (hide native cursor, plate follows)
- [ ] Test mobile plate chip (draggable in corner)
- [ ] Upload test image to verify R2 pipeline
- [ ] Create test dish and publish
- [ ] Verify home page loads with hero animation

---

**Last Updated:** 2025-01-XX  
**Project Status:** In Development  
**Primary Contact:** Ari Kliger
- After each code session update the @Planing/memory/Master-Task-List.md with the task accomplished
- make sure the user facing texts are always in Hebrew!
- Development Approach:
  - Page layouts are hardcoded in /app/(public)/ routes
  - GSAP animations are defined in code by developers
  - Content (dishes, bundles, text) is pulled from database
  - Restaurant owner manages content only via admin
  - Design/animation changes require developer involvement (acceptable for small project)