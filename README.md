# IVolex – Leather E‑Commerce MVP

Pixel-perfect MVP mirroring the provided design. Built with React + Vite + Tailwind.

## Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion
- lucide-react

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint source (after setup)
npm run lint:fix  # fix lint issues (after setup)
npm run format    # format with Prettier (after setup)
npm run test      # unit tests (after setup)
npm run e2e       # e2e tests (after setup)
```

## Project Structure (key)
- `src/main.jsx` – app bootstrap
- `src/ui/App.jsx` – page composition
- `src/ui/sections/*` – feature sections
- `src/ui/components/*` – reusable components
- `src/ui/contexts/*` – context providers
- `public/images` – public assets
- `assets/` – source/original assets

## Roadmap & Tasks
See `SUMMARY.md` (overview) and `TODO.md` (actionable, prioritized list).

## Production Build & Deploy

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the project settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. The `vercel.json` file handles SPA routing
4. Deploy and enjoy!

### Manual Deployment
- Build: `npm run build` (outputs to `dist/`)
- Nginx example in `nginx.conf`
- GitHub Pages workflow: `.github/workflows/deploy-gh-pages.yml`

## Notes
- Replace placeholder images in `public/images` with final assets.
- Use environment variables via Vite (e.g., `VITE_*`). A `.env.example` will be added.