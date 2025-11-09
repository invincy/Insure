# LIC Insurance Plans - Multi-Plan Web App

A fast, modern, PWA-ready mobile web application for LIC insurance plans built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Framer Motion** for smooth animations
- **next/image** optimized image loading
- Responsive design with mobile-first approach
- Static site generation (SSG) for all plan pages

## Project Structure

```
plan-733/
├── app/
│   ├── page.tsx                    # Home page
│   ├── plans/
│   │   ├── page.tsx                # Plans listing (all plans)
│   │   └── [planId]/
│   │       └── page.tsx            # Dynamic plan detail page
│   ├── profile/
│   │   └── page.tsx
│   └── services/
│       └── page.tsx
├── components/
│   ├── hero/                       # Shared hero components
│   ├── plan/
│   │   └── Plan733Interactive.tsx  # Plan 733 interactive experience
│   └── ui/
│       └── Navbar.tsx
├── data/
│   └── plans.ts                    # Central plan data (source of truth)
├── types/
│   └── plan.ts                     # TypeScript interfaces
├── config/
│   └── plan733Assets.ts            # Legacy asset config (deprecated, use data/plans.ts)
└── public/
    └── images/
        └── plans/
            ├── jeevnalakshya/      # Plan 733 assets
            └── <planId>/           # Future plan assets
```

## Features

- ✅ Dynamic plan routing with static generation
- ✅ Centralized plan data management
- ✅ Type-safe plan definitions
- ✅ Category-based plan filtering
- ✅ SEO-optimized with per-plan metadata
- ✅ Responsive & mobile-first UI
- ✅ Smooth animations with Framer Motion
- ✅ Accessible (ARIA, keyboard nav, reduced motion support)

## How to Add a New Plan

### Step 1: Add plan assets
Create a folder in `public/images/plans/<planId>/` and add:
- `coin.png` - Plan badge/coin image
- `path.png` - Golden path illustration
- `figures.png` - Character/family illustration
- `career.png`, `marriage.png`, `study.png`, `goals.png` - Goal icons
- `background.png` - Hero background
- `maturity.png`, `death.png`, `10sa.png` - Benefit pills (optional)

### Step 2: Add plan data
Edit `data/plans.ts` and add a new plan object:

```typescript
{
  id: '945',
  slug: '945',
  title: 'LIC Jeevan Umang',
  titleGujarati: 'જીવન ઉમંગ',
  subtitle: 'પ્લાન (945)',
  shortDescription: 'Whole life policy with income benefits',
  features: [
    'Lifetime coverage',
    'Regular income after premium payment',
    'Maturity benefit',
  ],
  assets: {
    coin: '/images/plans/jeevan-umang/coin.png',
    path: '/images/plans/jeevan-umang/path.png',
    // ... other assets
  },
  priceStarting: 8000,
  badge: 'નવું',
  category: 'endowment',
  meta: {
    title: 'LIC Jeevan Umang Plan 945 | Whole Life Insurance',
    description: 'Get lifetime coverage with regular income...',
  },
}
```

### Step 3: Build & test
```bash
npm run build
npm start
```

The new plan will automatically:
- Appear in the plans listing under its category
- Get a static page at `/plans/<planId>`
- Have SEO metadata configured
- Be fully navigable

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Performance Goals

- First route JS bundle ≤ 90KB gzipped
- Smooth 60fps animations
- No layout shift on load
- Optimized image loading with priority/lazy loading
- Reduced motion respect for accessibility

## Routes

- `/` - Home page
- `/plans` - All plans listing (filterable by category)
- `/plans/733` - Plan 733 (Jeevan Lakshya) interactive detail
- `/plans/<planId>` - Generic plan detail page
- `/profile` - User profile
- `/services` - Services page

## Plan Categories

- `child` - Child insurance plans (👶)
- `term` - Term insurance plans (🛡️)
- `endowment` - Endowment plans (🏦)
- `ulip` - ULIP/investment plans (📈)
- `annuity` - Pension/annuity plans (👴)

## Performance

- First route JS bundle ≤ 90KB gzipped
- Smooth 60fps animations
- Static generation for all plan pages
- Optimized images with next/image
- Reduced motion support

## Browser Support

- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+)
- Mobile-first responsive design
- Touch-friendly interactions

## Accessibility

- Keyboard navigation
- ARIA labels
- Reduced motion support (`prefers-reduced-motion`)
- Focus indicators
- Semantic HTML

---

**Next Steps:**
- Add more plans to `data/plans.ts`
- Create interactive experiences for other plans (like Plan 733)
- Implement premium calculator
- Add plan comparison feature
- Set up PWA with service worker