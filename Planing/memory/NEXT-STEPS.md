# 🚀 Next Steps - ביס מרוקאי Development

**Updated:** 2025-10-23 (After Session 3)
**Current Progress:** ~45% Complete

---

## 📊 Current Status

### ✅ **Completed (Session 1-3):**
- Database models (100%)
- Validation schemas (100%)
- Authentication system (100%)
- Public API endpoints (100%)
- Hebrew localization (100%)
- Data seeding (40% - media, categories, dishes)
- Project infrastructure (100%)

### ⏳ **In Progress:**
- Admin CRUD API routes (0%)
- Media upload system (0%)
- Admin UI (0%)
- Frontend pages (0%)

---

## 🎯 Session 4 Priorities (High Priority)

### **1. Admin CRUD API Routes** 🔥
Complete the protected admin API for content management.

#### **Dishes CRUD**
```typescript
POST   /api/admin/dishes          // Create new dish
GET    /api/admin/dishes          // List all (including drafts)
GET    /api/admin/dishes/[id]     // Get single dish
PUT    /api/admin/dishes/[id]     // Update dish
DELETE /api/admin/dishes/[id]     // Delete dish (soft)
POST   /api/admin/dishes/[id]/publish  // Publish dish
```

**What to Build:**
- [ ] Create `/app/api/admin/dishes/route.ts` (POST, GET)
- [ ] Create `/app/api/admin/dishes/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Create `/app/api/admin/dishes/[id]/publish/route.ts` (POST)
- [ ] Integrate Zod validation from `dish.schema.ts`
- [ ] Add ISR revalidation after mutations
- [ ] Create revision tracking on updates
- [ ] Add slug auto-generation from Hebrew title
- [ ] Return Hebrew error messages

**Example Implementation:**
```typescript
// POST /api/admin/dishes
import { createDishSchema } from '@/lib/validation';
import { isAuthenticated } from '@/lib/auth';
import { successResponse, handleApiError } from '@/lib/api/responses';

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const validation = createDishSchema.safeParse(body);

  if (!validation.success) {
    return validationErrorResponse(validation.error);
  }

  // Create dish logic...
  // Trigger revalidation...

  return successResponse(dish, undefined, 201);
}
```

#### **Categories CRUD**
```typescript
POST   /api/admin/categories
GET    /api/admin/categories
PUT    /api/admin/categories/[id]
DELETE /api/admin/categories/[id]
POST   /api/admin/categories/reorder  // Drag-drop reordering
```

#### **Bundles CRUD**
```typescript
POST   /api/admin/bundles
GET    /api/admin/bundles
PUT    /api/admin/bundles/[id]
DELETE /api/admin/bundles/[id]
POST   /api/admin/bundles/[id]/publish
```

**Estimated Time:** 4-6 hours

---

### **2. ISR Revalidation System** 🔥
Automatically revalidate public pages when content changes.

**What to Build:**
- [ ] Create `/app/api/admin/revalidate/route.ts`
- [ ] Create `/lib/revalidation/paths.ts` - Map entities to paths
- [ ] Integrate revalidation into all mutation endpoints
- [ ] Add revalidation result logging
- [ ] Handle revalidation errors gracefully

**Example Implementation:**
```typescript
// lib/revalidation/paths.ts
export function getPathsToRevalidate(entityType: string, entity: any) {
  const paths: string[] = [];

  switch (entityType) {
    case 'dish':
      paths.push('/api/public/dishes');
      paths.push(`/api/public/dishes/${entity.slug}`);
      if (entity.type === 'RESTAURANT') {
        paths.push('/menu');
      }
      break;
    case 'category':
      paths.push('/api/public/categories');
      break;
    // ... more cases
  }

  return paths;
}
```

**Usage in Admin Routes:**
```typescript
// After creating/updating dish
import { revalidatePath } from 'next/cache';
import { getPathsToRevalidate } from '@/lib/revalidation/paths';

const paths = getPathsToRevalidate('dish', dish);
for (const path of paths) {
  revalidatePath(path);
}
```

**Estimated Time:** 2-3 hours

---

### **3. R2 Media Upload System** 🔥
Enable image uploads with variant generation.

#### **Signed Upload URL Generation**
```typescript
POST /api/admin/media/sign
```

**What to Build:**
- [ ] Create `/app/api/admin/media/sign/route.ts`
- [ ] Generate presigned R2 upload URL (15 min expiry)
- [ ] Validate file type (images only)
- [ ] Validate file size (max 50MB)
- [ ] Return upload instructions

**Example Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://...",
    "fileKey": "uploads/abc123.jpg",
    "expiresIn": 900
  }
}
```

#### **Post-Upload Processing**
```typescript
POST /api/admin/media/finalize
```

**What to Build:**
- [ ] Create `/app/api/admin/media/finalize/route.ts`
- [ ] Download original from R2
- [ ] Generate 3 variants (thumb: 200px, card: 800px, hero: 1600px)
- [ ] Convert to AVIF and WebP
- [ ] Generate blurDataURL placeholder
- [ ] Extract dimensions with `sharp`
- [ ] Upload variants back to R2
- [ ] Create Media document in MongoDB
- [ ] Return all variant URLs

**Example Media Document:**
```typescript
{
  kind: 'IMAGE',
  fileKey: 'uploads/abc123.jpg',
  url: 'https://r2.../abc123.jpg',
  width: 1920,
  height: 1080,
  variants: {
    thumb: { url: '...', width: 200, height: 113 },
    card: { url: '...', width: 800, height: 450 },
    hero: { url: '...', width: 1600, height: 900 }
  },
  formats: {
    avif: { original: '...', thumb: '...', card: '...', hero: '...' },
    webp: { original: '...', thumb: '...', card: '...', hero: '...' }
  },
  blurDataUrl: 'data:image/jpeg;base64,...',
  alt_he: '',
  focalPoint: { x: 0.5, y: 0.5 }
}
```

**Required Dependencies:**
```bash
npm install sharp @aws-sdk/s3-request-presigner
```

**Estimated Time:** 6-8 hours

---

## 🎯 Session 5 Priorities (Medium Priority)

### **4. Admin UI Shell (Mantine)**
Set up the admin panel foundation.

**What to Build:**
- [ ] Create `/app/admin/layout.tsx` with Mantine RTL theme
- [ ] Create `/app/admin/page.tsx` (redirect to dashboard)
- [ ] Create `/app/admin/login/page.tsx` with Hebrew form
- [ ] Create `/app/admin/dashboard/page.tsx`
- [ ] Create `/components/admin/AdminShell.tsx` with sidebar
- [ ] Configure Mantine color scheme (brand colors)
- [ ] Add RTL support and Hebrew font
- [ ] Create navigation menu component

**Mantine RTL Configuration:**
```typescript
// app/admin/layout.tsx
import { MantineProvider, createTheme, DirectionProvider } from '@mantine/core';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const rtlCache = createCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
});

const theme = createTheme({
  dir: 'rtl',
  primaryColor: 'orange',
  colors: {
    brand: ['#FFF6ED', '#F5E4D2', '#E0723E', '#D34A2F', '#7C4A27', ...],
  },
});

export default function AdminLayout({ children }) {
  return (
    <DirectionProvider initialDirection="rtl">
      <CacheProvider value={rtlCache}>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </CacheProvider>
    </DirectionProvider>
  );
}
```

**Estimated Time:** 4-6 hours

---

### **5. Dishes Admin Page**
First complete admin CRUD interface.

**What to Build:**
- [ ] Create `/app/admin/dishes/page.tsx` (list view)
- [ ] Create `/app/admin/dishes/new/page.tsx` (create form)
- [ ] Create `/app/admin/dishes/[id]/page.tsx` (edit form)
- [ ] Create `/components/admin/DishForm.tsx`
- [ ] Create `/components/admin/DishTable.tsx` with DataTable
- [ ] Add filters (type, category, status)
- [ ] Add search functionality
- [ ] Add bulk actions (delete, publish)
- [ ] Integrate with admin CRUD APIs

**Form Features:**
- Hebrew-first form labels
- Rich text editor for description (TipTap)
- Image picker with preview
- Category dropdown (populated from API)
- Spice level slider (0-3)
- Dietary checkboxes (vegan, vegetarian, gluten-free)
- Allergens tag input
- Price input with ILS currency
- Status selector (DRAFT, SCHEDULED, PUBLISHED)
- Save, Preview, Publish buttons

**Estimated Time:** 8-10 hours

---

## 🎯 Session 6 Priorities (Lower Priority)

### **6. Additional Admin Pages**
- [ ] Categories management (`/admin/categories`)
- [ ] Bundles management (`/admin/bundles`)
- [ ] Media library (`/admin/media`)
- [ ] Settings page (`/admin/settings`)

### **7. Public Frontend Pages**
- [ ] Home page (`/`)
- [ ] Menu page (`/menu`)
- [ ] Single dish page (`/menu/[slug]`)
- [ ] About page (`/about`)

### **8. GSAP Animation System**
- [ ] Plate cursor system
- [ ] Hero stage animations
- [ ] Story rail (pinned scroll)
- [ ] Menu sampler carousel

---

## 📝 Technical Debt & Optimizations

### **Before Production:**
1. **R2 CORS Configuration**
   - Configure bucket CORS for direct uploads
   - Set up lifecycle rules for old variants
   - Configure CDN caching headers

2. **Error Monitoring**
   - Set up Sentry or similar
   - Add error boundaries
   - Log failed uploads and API errors

3. **Performance**
   - Optimize image loading
   - Implement lazy loading
   - Add loading skeletons
   - Optimize bundle size

4. **Testing**
   - Write E2E tests for admin flows
   - Test image upload pipeline
   - Test ISR revalidation
   - Test authentication edge cases

5. **Security Audit**
   - Review CSRF protection
   - Test rate limiting
   - Verify session expiry
   - Check for SQL/NoSQL injection

6. **Documentation**
   - Admin user guide
   - API documentation
   - Deployment guide
   - Environment setup guide

---

## 🎯 Definition of Done

### **For Session 4 (Admin CRUD & Media):**
- [ ] All dish CRUD endpoints working
- [ ] All category CRUD endpoints working
- [ ] All bundle CRUD endpoints working
- [ ] ISR revalidation triggering correctly
- [ ] Image upload with variant generation working
- [ ] Media documents created in MongoDB
- [ ] All endpoints return Hebrew error messages
- [ ] TypeScript compiles with no errors
- [ ] All tests pass

### **For Session 5 (Admin UI):**
- [ ] Admin login page functional
- [ ] Admin dashboard displays stats
- [ ] Dishes list page shows all dishes
- [ ] Dishes form creates/updates dishes
- [ ] Image picker uploads and displays images
- [ ] All forms validate with Hebrew errors
- [ ] RTL layout works correctly
- [ ] Navigation menu functional

---

## 🚀 Getting Started with Session 4

### **Step 1: Admin CRUD Routes**
Start with the dishes endpoint as a template:

```bash
# Create the route file
touch app/api/admin/dishes/route.ts
touch app/api/admin/dishes/[id]/route.ts
touch app/api/admin/dishes/[id]/publish/route.ts
```

### **Step 2: Test with curl**
```bash
# Create dish
curl -X POST http://localhost:3000/api/admin/dishes \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=YOUR_TOKEN" \
  -d '{"title_he":"בקלאווה","type":"RESTAURANT","categoryId":"...","price":18}'

# Update dish
curl -X PUT http://localhost:3000/api/admin/dishes/[id] \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=YOUR_TOKEN" \
  -d '{"price":20}'

# Publish dish
curl -X POST http://localhost:3000/api/admin/dishes/[id]/publish \
  -H "Cookie: admin_session=YOUR_TOKEN"
```

### **Step 3: Verify Revalidation**
Check that public API returns updated data after mutations.

---

## 📚 Resources & References

### **Documentation:**
- [Next.js 15 API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Mantine UI RTL](https://mantine.dev/guides/rtl/)
- [Cloudflare R2 API](https://developers.cloudflare.com/r2/api/s3/api/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [GSAP Documentation](https://greensock.com/docs/)

### **Internal Docs:**
- `/CLAUDE.md` - Full project specification
- `/TEST-RESULTS.md` - Session 3 test results
- `/Planing/memory/Session-3-Summary.md` - What we built
- `/Planing/memory/Master-Task-List.md` - Complete checklist

---

## 🎉 Let's Build!

The foundation is solid. Session 4 will complete the backend API layer, making the project ready for the admin UI. After Session 5, content creators will be able to manage the entire site without touching code.

**Estimated Timeline:**
- Session 4: 12-15 hours (Admin CRUD + Media)
- Session 5: 12-15 hours (Admin UI)
- Session 6: 20-25 hours (Frontend + Animations)
- **Total Remaining:** ~45-55 hours

**We're on track to have a fully functional CMS and public site within 2-3 more sessions!** 🚀
