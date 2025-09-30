# IVolex Project TODO (Prioritized)

## 1) Developer Experience
- [ ] Add ESLint + Prettier configs and scripts
- [ ] Add Husky + lint-staged pre-commit hook
- [ ] Add TypeScript base config (gradual adoption)
- [ ] Create `.env.example` and centralize env usage in `src/config.ts`

## 2) App Architecture
- [ ] Introduce React Router; create routes: Home, Category, Product, Cart, Checkout
- [ ] Add global state for Cart (Context + reducer or Zustand)
- [ ] Add ErrorBoundary and wrap major sections

## 3) UI/UX & Accessibility
- [ ] Audit and fix alt text, labels, aria-* attributes
- [ ] Add focus styles and skip-to-content link
- [ ] Add responsive container component and verify breakpoints
- [ ] Loading states (Skeletons) and empty states

## 4) Performance
- [ ] Code-split heavy sections with React.lazy/Suspense
- [ ] Lazy-load non-critical images; convert assets to WebP (and/or AVIF)
- [ ] Add Vite compression plugin (gzip/brotli)
- [ ] Add bundle analyzer and reduce vendor size if needed

## 5) SEO
- [ ] Add SEO helper with `react-helmet-async`
- [ ] Add `robots.txt` and sitemap generation
- [ ] Add JSON-LD for key pages (products/categories)

## 6) Forms & Validation
- [ ] Add `react-hook-form` + `zod` for Newsletter/Contact
- [ ] Add toast notifications for success/error

## 7) Testing
- [ ] Setup Vitest + React Testing Library
- [ ] Add Playwright E2E smoke tests
- [ ] Add tests to CI workflow

## 8) CI/CD & Security
- [ ] Enhance GitHub Actions to run lint/test/build before deploy
- [ ] Add `npm audit` in CI; monthly dependency updates
- [ ] Strengthen Nginx security headers in `nginx.conf`

## 9) PWA & i18n (Optional)
- [ ] Add `vite-plugin-pwa`, manifest, icons
- [ ] Add `react-i18next` basics and translation files

## 10) Cleanup & Content
- [ ] Create `src/data/products.json` and types
- [ ] Centralize constants in `src/constants.ts`
- [ ] Document asset pipeline for responsive images