# **CMS Plan — Custom Code \+ Mantine (RTL Hebrew Restaurant)**

**Update for your constraints** (applies to everything below):

* **DB**: MongoDB (Mongoose), not Postgres/Prisma.

* **Storage**: Cloudflare **R2** for media (signed uploads, variants pipeline).

* **Auth**: **No user accounts/roles**. A single **password gate** protects `/admin/*` (cookie-based session). No invite/users/audit UI.

* **Locale**: **Hebrew only**. Remove all `*_en` fields and i18n toggles. Keep RTL everywhere.

* Keep SEO, caching, preview, revalidate. Keep animation presets in CMS.

Target: simple, fast, code‑based CMS built into the Next.js app, with Mantine UI for admin. All changeable content editable via admin. RTL Hebrew first, with future i18n hooks.

---

## **1\) Product Goals**

* **Single codebase**: public site \+ admin at `/admin`.

* **Zero vendor lock‑in**: our own DB (Postgres/Prisma) \+ R2/S3 for media.

* **Fast publishing**: draft → preview → publish (with schedule). One‑click revalidate.

* **Safety**: roles, audit log, version history, soft delete.

* **Awwwards‑style controls**: per‑section animation knobs (non‑developer friendly) without breaking design.

---

## **2\) Key Entities & Schema (MongoDB / Mongoose)**

### **Collections & Indexes**

* Use **string ObjectIds**. Create unique indexes for slugs per collection.

* Common fields: `_id`, `createdAt`, `updatedAt` (timestamps), `status`, `publishAt`.

### **Dish (collection: `dishes`)**

const DishSchema \= new Schema({  
  title\_he: { type: String, required: true },  
  slug: { type: String, required: true, unique: true },  
  type: { type: String, enum: \['RESTAURANT','CATERING','EVENT'\], required: true },  
  categoryId: { type: ObjectId, ref: 'Category' },  
  description\_he: {}, // rich text JSON  
  price: { type: Number },  
  currency: { type: String, default: 'ILS' },  
  spiceLevel: { type: Number, min:0, max:3 },  
  isVegan: Boolean, isVegetarian: Boolean, isGlutenFree: Boolean,  
  allergens: \[String\],  
  mediaIds: \[{ type: ObjectId, ref: 'Media' }\],  
  badges: \[String\],  
  availability: { type: String, enum:\['AVAILABLE','OUT\_OF\_STOCK','SEASONAL'\], default:'AVAILABLE' },  
  nutrition: {}, options: {},  
  seoId: { type: ObjectId, ref: 'SeoMeta' },  
  status: { type: String, enum:\['DRAFT','PUBLISHED','SCHEDULED'\], default:'DRAFT' },  
  publishAt: Date  
},{ timestamps:true });  
DishSchema.index({ slug: 1 }, { unique: true });

### **Category (`categories`)**

const CategorySchema \= new Schema({  
  name\_he: { type: String, required: true },  
  slug: { type: String, required: true, unique: true },  
  typeScope: { type: String, enum:\['RESTAURANT','CATERING','EVENT'\], required: true },  
  order: { type: Number, default: 0 }  
},{ timestamps:true });

### **Bundle (`bundles`) — מגשי אירוח / אירועים**

const BundleSchema \= new Schema({  
  title\_he: { type: String, required: true },  
  slug: { type: String, required: true, unique: true },  
  description\_he: {},  
  basePricePerPerson: Number,  
  minPersons: { type: Number, default: 10 },  
  maxPersons: Number,  
  includes: {}, // e.g., { mains:3, salads:2, desserts:1 }  
  allowedDishIds: \[{ type: ObjectId, ref: 'Dish' }\],  
  mediaIds: \[{ type: ObjectId, ref: 'Media' }\],  
  seoId: { type: ObjectId, ref: 'SeoMeta' },  
  status: { type: String, enum:\['DRAFT','PUBLISHED','SCHEDULED'\], default:'DRAFT' },  
  publishAt: Date  
},{ timestamps:true });

### **Menu (`menus`)**

const MenuItem \= new Schema({  
  kind: { type: String, enum:\['DISH','BUNDLE'\], required: true },  
  refId: { type: ObjectId, required: true },  
  label: String,  
  priceOverride: Number,  
}, { \_id:false });  
const MenuSchema \= new Schema({  
  title: { type: String, required: true },  
  slug: { type: String, required: true, unique: true },  
  scope: { type: String, enum:\['HOME','RESTAURANT','CATERING','EVENTS','CUSTOM'\], required: true },  
  items: \[MenuItem\]  
},{ timestamps:true });

### **PageContent (`pages`)**

const PageSchema \= new Schema({  
  page: { type: String, enum:\['HOME','ABOUT','RESTAURANT','CATERING','EVENTS'\], unique: true },  
  sections: \[Schema.Types.Mixed\], // typed blocks  
  seoId: { type: ObjectId, ref: 'SeoMeta' },  
  status: { type: String, enum:\['DRAFT','PUBLISHED','SCHEDULED'\], default:'DRAFT' },  
  publishAt: Date  
},{ timestamps:true });

### **HeroScene (`hero_scenes`)**

const HeroSceneSchema \= new Schema({  
  headline\_he: { type: String, required: true },  
  sub\_he: String,  
  platePath: String,  
  garnishSpriteIds: \[{ type: ObjectId, ref: 'Media' }\],  
  ctaPrimary: { label:String, url:String },  
  ctaSecondary: { label:String, url:String },  
  theme: {}, animation: {},  
  status: { type: String, enum:\['DRAFT','PUBLISHED','SCHEDULED'\], default:'DRAFT' },  
  publishAt: Date  
},{ timestamps:true });

### **MediaAsset (`media`)**

const MediaSchema \= new Schema({  
  kind: { type: String, enum:\['IMAGE','VIDEO','SVG','AUDIO'\], required: true },  
  fileKey: { type: String, required: true }, // R2 key  
  url: { type: String, required: true },  
  width: Number, height: Number, duration: Number,  
  alt\_he: String,  
  focalPoint: { x:Number, y:Number },  
  thumbnailUrl: String, blurDataUrl: String, meta: {}  
},{ timestamps:true });

### **SeoMeta (`seo_meta`)**

const SeoMetaSchema \= new Schema({  
  title: String, description: String, canonicalUrl: String,  
  ogImageId: { type: ObjectId, ref: 'Media' }, noindex: Boolean, jsonLd: {}  
},{ timestamps:true });

### **NavigationMenu (`navigation_menus`)**

const NavItem \= new Schema({ label\_he:String, url:String, target:String }, { \_id:false });  
const NavigationSchema \= new Schema({ name:String, items:\[NavItem\] }, { timestamps:true });

### **Settings (`settings`) — singleton**

const SettingsSchema \= new Schema({  
  brand:{ name\_he:String, logoId:{ type:ObjectId, ref:'Media' } },  
  contact:{ phone:String, whatsapp:String, email:String },  
  location:{ address\_he:String, lat:Number, lng:Number },  
  hours:{}, legal:{},  
  ui:{ rtl:{ type:Boolean, default:true }, theme:{} },  
  plateConfig:{ magnetStrength:Number, cursorSize:Number, reducedMotionDefault:Boolean }  
},{ timestamps:true });

---

## **3\) PageContent: Block Types (for Home & others)**

Each block has `id`, `type`, `order`, `visibility`, `animationPreset`, and `data`.

* **Hero**: headline/sub, plate path ref, ctas, background layers, animation knobs (entrance delay, SplitText stagger, CTA border draw, garnish density).

* **StoryRail**: scenes A/B/C with per‑scene text, images, tint, smoke strength, parallax depths, plate morph toggle.

* **MenuSampler**: `menuId`, card layout, proximity effects (scale, zoom, glow), autoplay.

* **SocialProof**: quotes\[\], rating, autoplay interval, pauseOnPlate.

* **LocationCTA**: map image or embed, CTA labels/urls.

* **RichText**: prose sections with optional image.

* **Marquee**: list of values/phrases, speed, direction (RTL default), pause on hover.

Animation presets (editable): `duration`, `ease`, `stagger`, `entranceDirection`, `clipMask`, `parallaxDepth`, `pin`.

---

## **4\) Admin UX (Mantine)**

**Gatekeeping (no auth, single password)**

* `/admin/login` page with a single **password** field.

* On success, set cookie: `admin_session` (JWT‑less, HMAC‑signed { issuedAt, nonce }).

* Middleware at `/admin/**` verifies HMAC using `ADMIN_SECRET`. Expire after 12h idle.

* Add simple **rate limit** (5 attempts / 10 minutes) and optional IP allowlist.

**Layout**

* RTL sidebar: לוח בקרה, מנות, קטגוריות, מגשי אירוח, תפריטים, עמודים, מדיה, ניווט, SEO, הגדרות.

* Top bar: חיפוש, תצוגה מקדימה, פרסום.

**Screens** (trimmed to essentials)

1. **Dashboard**: Drafts, Scheduled, Recently edited, Broken media.

2. **Dishes**: table \+ editor tabs (כללי, מדיה, תגיות/אלרגנים, SEO, היסטוריה קצרה).

3. **Bundles**: מגשי אירוח/אירועים — קומפוזר חזותי עם מגבלות.

4. **Menus**: גרירה לסידור פריטים.

5. **Pages**: קומפוזר בלוקים \+ כיוונוני אנימציה.

6. **Media**: העלאה ל‑R2, חיתוך, נקודת מיקוד, יצירת וריאנטים.

7. **Navigation / SEO / Settings**: בסיסי בלבד.

**History**

* No multi‑user audit. Keep **lightweight versioning**: each save stores previous document JSON to a `revisions` sub‑collection capped to last 20\.

---

## **5\) Workflow: Draft → Preview → Publish**

* Status: `DRAFT` → `SCHEDULED` (optional `publishAt`) → `PUBLISHED`.

* **Preview**: `/api/preview?token=...` sets Next.js preview mode (password‑gated).

* **Publish**: set status/date; call ISR `revalidatePath` for impacted routes.

* **Rollback**: restore from `revisions` snapshot.

---

## **6\) Validation Rules**

* Dish must have `title_he`, `type`, and either `price` or belong to a Bundle with price logic.

* Slugs are unique per scope (Dish, Bundle, Page).

* Category type must match Dish.type.

* Hero headline length guard (e.g., ≤ 60 chars HE) for layout.

* Media: at least one image with min width 1600px for hero, 800px for cards.

---

## **7\) Delivery Layer (API \+ Caching)**

**API Routes (Next.js Route Handlers)**

* Public GETs (cached at edge for 5m; SWR):

  * `GET /api/public/dishes?type=&category=&q=`

  * `GET /api/public/dishes/[slug]`

  * `GET /api/public/menus/[slug]`

  * `GET /api/public/pages/[page]`

* Admin CRUD under `/api/admin/*` (password‑gated via middleware); all POST/PUT/PATCH validate with zod and sanitize HTML.

**Revalidation**

* Dish → `/menu`, item route, home sampler.

* Bundle → catering/events pages & samplers.

* Pages/Hero → home route.

**Indexes**

* `dishes.slug` unique, `categories.slug` unique, `menus.slug` unique.

* Useful compound: `{ type:1, categoryId:1, status:1 }` for dish lists.

---

## **8\) Media Pipeline (R2)**

* Admin requests **signed upload URL** from `/api/admin/media/sign` → PUT directly to R2.

* On finalize (`/api/admin/media/finalize`), a server job:

  * Generates variants (thumb/card/hero), AVIF/WebP, blurDataURL.

  * Writes Media doc with `fileKey`, `url` (public bucket or proxy route), dimensions, focalPoint.

* Optional: serve via `/images/[key]` proxy to set cache headers and strip query leakage.

---

## **9\) Security (without accounts)**

* Password gate with strong `ADMIN_SECRET` (env) \+ HMAC cookie; rotate secret quarterly.

* Rate limit login; lockout after 5 failures; optional IP allowlist.

* CSRF token on admin POSTs; same‑site cookies; disable `X‑Powered‑By`.

* Validate/sanitize rich text; strip scripts in uploads (SVG safe‑list).

---

## **10\) RTL & Hebrew Only**

* Remove all `*_en` fields and toggles.

* Admin UI permanently RTL. Numbers left‑aligned in inputs.

* Slugs: use latin slugs only for stability (derive from Hebrew via transliteration in admin helper).

---

## **11\) Animation Controls (Non‑Dev Friendly)**

Expose key knobs without breaking design.

* **Hero**: headline stagger, plate path (pick from templates), CTA border speed, garnish density.

* **StoryRail scenes**: smoke strength (0–1), parallax depth per layer, temperature tint, plate morph on/off.

* **Sampler**: hover zoom %, proximity glow strength, autoplay interval.

* **Global**: reduced‑motion default, plate magnet strength, cursor size.

* Presets save as `AnimationPreset` JSON; allow per‑block override.

---

## **12\) Navigation & Routing**

* `NavigationMenu` drives header \+ footer; admin reorder changes reflect instantly.

* Support `Redirects` table for legacy URLs (source, destination, 301/302).

---

## **13\) Observability & Alerts**

* Error boundary logs to console \+ external provider.

* Image missing/404 detector lists in Dashboard.

* Webhook to Slack/Email when a scheduled publish succeeds/fails.

---

## **14\) Migrations & Seed**

* Initial seed: categories, example dishes, hero, menus, settings.

* Migration plan: Prisma migrations per release; backup before destructive changes.

---

## **15\) Testing & QA**

* Unit: schema validation (zod) for admin payloads.

* E2E: admin CRUD flows (Playwright), preview, publish, revalidate.

* Visual: Percy/Chromatic‑style diffs for home hero and story rail.

---

## **16\) Build Milestones (Mongo \+ R2 \+ Password Gate)**

1. **DB & Gate**: Mongoose setup, `/admin/login`, cookie middleware, rate limit.

2. **Admin Shell**: Mantine RTL layout, tables/forms, media upload to R2.

3. **Core Content**: Dishes, Categories, Bundles, Menus CRUD.

4. **Pages & Blocks**: Home composer \+ animation knobs.

5. **Publishing**: preview mode, schedule, ISR revalidation, simple revisions.

6. **Polish**: indexes, validation, security hardening, docs.

---

## **17\) Example Types (TS)**

export type DishType \= 'RESTAURANT'|'CATERING'|'EVENT';  
export interface Dish { id:string; title\_he:string; slug:string; type:DishType; categoryId:string; price?:number; media:Media\[\]; badges:string\[\]; availability:'AVAILABLE'|'OUT\_OF\_STOCK'|'SEASONAL'; seo?:SeoMeta; }  
export interface Bundle { id:string; title\_he:string; basePricePerPerson:number; minPersons:number; includes:{ mains:number; salads:number; desserts:number }; allowedDishIds:string\[\]; }  
export interface PageBlock { id:string; type:string; order:number; animationPreset?:AnimationPreset; data:Record\<string,any\>; }

---

## **18\) Admin Component Hints (Mantine)**

* Tables: `DataTable` (with RTL), `ActionIcon`, `Badge` for status.

* Forms: `TextInput`, `Textarea`, `NumberInput`, `Select`, `SegmentedControl`, `Switch`, `TagsInput`, `JsonInput` (advanced), `ColorInput`, `Slider` for animation knobs.

* Media: custom `FileButton` \+ cropper modal; `Dropzone` for multi‑upload.

* Reorder: `DndContext` (Sortable) for menus and blocks.

---

## **19\) Deployment Notes & Ops**

* Env: `MONGODB_URI`, `ADMIN_SECRET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ACCOUNT_ID`, `PUBLIC_BASE_URL`.

* Backups: nightly Mongo dump; R2 lifecycle rules (older variants to IA, keep originals).

* Logs/metrics: basic request log; error alerts via email/webhook.

---

## **20\) Deliverables**

* Prisma schema \+ seed script.

* Admin pages for all entities.

* Public API routes with caching \+ preview mode.

* Revalidation \+ webhooks.

* Documentation: content model, publishing workflow, and customization guide for animation presets.

