#!/bin/bash

echo "🚀 Initializing ביס מרוקאי Website Project..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "CLAUDE.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Initializing Next.js project...${NC}"
# Create package.json first
cat > package.json << 'EOF'
{
  "name": "bis-maroki-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:seed": "ts-node --compiler-options {\\\"module\\\":\\\"commonjs\\\"} scripts/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
EOF

echo -e "${GREEN}✓ package.json created${NC}"

echo -e "${BLUE}📦 Step 2: Installing Next.js core dependencies...${NC}"
npm install next@latest react@latest react-dom@latest

echo -e "${BLUE}📦 Step 3: Installing TypeScript and types...${NC}"
npm install --save-dev typescript @types/react @types/node @types/react-dom

echo -e "${BLUE}📦 Step 4: Installing Tailwind CSS...${NC}"
npm install --save-dev tailwindcss postcss autoprefixer
npm install tailwindcss-rtl

echo -e "${BLUE}📦 Step 5: Installing MongoDB and Mongoose...${NC}"
npm install mongoose mongodb
npm install --save-dev @types/mongoose

echo -e "${BLUE}📦 Step 6: Installing Mantine UI (RTL support)...${NC}"
npm install @mantine/core@7 @mantine/hooks@7 @mantine/form@7 @mantine/notifications@7 @mantine/modals@7 @mantine/dropzone@7 @mantine/dates@7 @mantine/tiptap@7
npm install @tabler/icons-react
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder

echo -e "${BLUE}📦 Step 7: Installing GSAP animation libraries...${NC}"
npm install gsap@latest
npm install --save-dev @types/gsap

echo -e "${BLUE}📦 Step 8: Installing Anime.js for UI animations...${NC}"
npm install animejs
npm install --save-dev @types/animejs

echo -e "${BLUE}📦 Step 9: Installing validation libraries (Zod)...${NC}"
npm install zod

echo -e "${BLUE}📦 Step 10: Installing Cloudflare R2 (AWS SDK)...${NC}"
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

echo -e "${BLUE}📦 Step 11: Installing image processing (Sharp)...${NC}"
npm install sharp
npm install --save-dev @types/sharp

echo -e "${BLUE}📦 Step 12: Installing security and sanitization...${NC}"
npm install isomorphic-dompurify
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken

echo -e "${BLUE}📦 Step 13: Installing drag-and-drop (for CMS)...${NC}"
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

echo -e "${BLUE}📦 Step 14: Installing date utilities...${NC}"
npm install date-fns

echo -e "${BLUE}📦 Step 15: Installing development tools...${NC}"
npm install --save-dev eslint eslint-config-next prettier eslint-config-prettier
npm install --save-dev husky lint-staged
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

echo -e "${BLUE}📦 Step 16: Installing testing frameworks...${NC}"
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @playwright/test
npm install --save-dev ts-node ts-jest
npm install --save-dev jest-environment-jsdom

echo -e "${BLUE}📦 Step 17: Installing utility libraries...${NC}"
npm install clsx
npm install slugify
npm install --save-dev @types/slugify

echo -e "${GREEN}✓ All packages installed successfully!${NC}"

echo -e "${BLUE}📝 Step 18: Creating configuration files...${NC}"

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

echo -e "${GREEN}✓ tsconfig.json created${NC}"

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-beige': '#F5E4D2',
        'brand-black': '#1A1A1A',
        'brand-red': '#D34A2F',
        'brand-orange': '#E0723E',
        'brand-brown': '#7C4A27',
        'brand-cream': '#FFF6ED',
        'brand-green': '#4F6A3C',
        'text-gray': '#3E3E3E',
        'border-light': '#E7D7C3',
        'border-strong': '#C7A88C',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(60,30,10,0.08)',
        'md': '0 3px 6px rgba(60,30,10,0.12)',
        'lg': '0 8px 16px rgba(60,30,10,0.16)',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
export default config
EOF

echo -e "${GREEN}✓ tailwind.config.ts created${NC}"

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo -e "${GREEN}✓ postcss.config.js created${NC}"

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
EOF

echo -e "${GREEN}✓ next.config.js created${NC}"

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF

echo -e "${GREEN}✓ .eslintrc.json created${NC}"

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

echo -e "${GREEN}✓ .prettierrc created${NC}"

# Create .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
Thumbs.db
EOF

echo -e "${GREEN}✓ .gitignore created${NC}"

# Create .env.example
cat > .env.example << 'EOF'
# Database
MONGODB_URI=mongodb://localhost:27017/bis-maroki
# or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Admin Security
ADMIN_SECRET=your-strong-secret-key-here-change-this
# Used for HMAC cookie signing; rotate quarterly

# Cloudflare R2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=bis-maroki-media
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# App Config
PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# GSAP (Premium Plugins) - Optional
GSAP_BONUS_KEY=your-club-greensock-key
# Required for SplitText, MorphSVG, Flip, InertiaPlugin

# Optional Security
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=600000
ADMIN_IP_ALLOWLIST=
EOF

echo -e "${GREEN}✓ .env.example created${NC}"

# Create .env.local with placeholder values
cat > .env.local << 'EOF'
# Database
MONGODB_URI=mongodb://localhost:27017/bis-maroki

# Admin Security
ADMIN_SECRET=change-this-secret-key-in-production

# Cloudflare R2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=bis-maroki-media
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# App Config
PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Optional Security
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=600000
EOF

echo -e "${GREEN}✓ .env.local created${NC}"

# Create jest.config.js
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
}

module.exports = createJestConfig(customJestConfig)
EOF

echo -e "${GREEN}✓ jest.config.js created${NC}"

# Create jest.setup.js
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'
EOF

echo -e "${GREEN}✓ jest.setup.js created${NC}"

# Create playwright.config.ts
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
EOF

echo -e "${GREEN}✓ playwright.config.ts created${NC}"

echo -e "${BLUE}📁 Step 19: Creating project directory structure...${NC}"

# Create directory structure
mkdir -p app/{api/{admin,public},\(public\)/{menu,restaurant,catering,events,about},admin/{login,dashboard,dishes,bundles,categories,menus,pages,media,settings}}
mkdir -p components/{motion,admin,ui,layout}
mkdir -p lib/{db/models,r2,auth,validation,utils}
mkdir -p public/{assets/{plate,garnish,paths},fonts}
mkdir -p scripts
mkdir -p e2e
mkdir -p __tests__

echo -e "${GREEN}✓ Directory structure created${NC}"

echo -e "${BLUE}📝 Step 20: Creating initial app files...${NC}"

# Create app/layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ביס מרוקאי',
  description: 'מסעדת אוכל רחוב מרוקאי אותנטי',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
EOF

echo -e "${GREEN}✓ app/layout.tsx created${NC}"

# Create app/page.tsx
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold text-center">
        ביס מרוקאי
      </h1>
      <p className="text-center mt-4 text-gray-600">
        האתר בבניה - הפרויקט הותחל בהצלחה!
      </p>
    </main>
  )
}
EOF

echo -e "${GREEN}✓ app/page.tsx created${NC}"

# Create app/globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

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

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  direction: rtl;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

@layer base {
  html {
    @apply scroll-smooth;
  }
}
EOF

echo -e "${GREEN}✓ app/globals.css created${NC}"

# Create README.md
cat > README.md << 'EOF'
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
EOF

echo -e "${GREEN}✓ README.md created${NC}"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ Project initialization complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Update .env.local with your actual credentials"
echo -e "2. Start MongoDB if running locally"
echo -e "3. Run: ${BLUE}npm run dev${NC}"
echo -e "4. Open: ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📖 For full documentation, see CLAUDE.md${NC}"
echo ""
