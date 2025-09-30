# IVolex Summary

## Project
- Name: IVolex – Leather E‑Commerce MVP
- Stack: React 18, Vite 5, Tailwind 3, Framer Motion, lucide-react
- Build: Vite, deployable to static hosting (Nginx, GitHub Pages)

## Current Structure (key)
- `src/main.jsx`: App bootstrap
- `src/ui/App.jsx`: Composed sections (Header, Hero, Categories, Trending, CustomCTA, Features, Testimonials, Newsletter, Footer)
- `tailwind.config.js`: Custom brand palette and shadows
- `vite.config.js`: Basic React plugin only
- `public/images`, `assets/`: Image assets
- `dist/`: Build output

## Known Gaps
- Linting/formatting not configured
- No routing; single-page composed sections only
- No TypeScript types or base config
- No tests (unit/e2e) or CI quality gates
- Minimal SEO head management
- No code-splitting or image optimization strategy
- No form validation/toasts
- Repo metadata file is missing

## Roadmap (high-level)
1. DX: ESLint/Prettier, Husky, TypeScript base
2. Architecture: Router, Cart state, ErrorBoundary
3. UX/A11y: Focus, labels/aria, responsive polish, loaders
4. Perf: Lazy sections, lazy images, compression, analyze bundle
5. SEO: Helmet, robots/sitemap, JSON-LD
6. Forms: RHF + Zod, toasts
7. Testing: Vitest/RTL, Playwright, CI integration
8. Security: Headers, audit
9. Optional: PWA, i18n

## Quick Start (current)
- `npm install`
- `npm run dev`

## Production
- Build: `npm run build`
- Nginx example and GitHub Pages workflow provided