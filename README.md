# ביס מרוקאי - Moroccan Restaurant Website

A premium Moroccan restaurant website featuring an Awwwards-style motion system with a unique "plate" (צלחת) cursor/object that drives interactions.

## 🚀 Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your MongoDB URI, R2 credentials, and admin secret

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Tech Stack

- **Frontend:** Next.js 14+, React 18, GSAP, Anime.js, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Storage:** Cloudflare R2
- **CMS:** Custom built-in admin with Mantine UI (RTL)

## 📁 Project Structure

See `CLAUDE.md` for detailed project documentation.

## 🔐 Admin Access

Access the admin panel at `/admin/login` using the password from `ADMIN_SECRET` env variable.

## 📚 Documentation

- Full project documentation: `CLAUDE.md`
- Master task list: `Planing/memory/Master-Task-List.md`
- Design system: `Planing/ביס מרוקאי — Brand Color & Design System.md`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run db:seed` - Seed database with initial data

## 📝 License

Private project - All rights reserved
