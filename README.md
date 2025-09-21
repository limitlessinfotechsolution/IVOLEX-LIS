# IVOLEX – Leather E‑Commerce

Pixel-perfect MVP mirroring the provided design. Built with React + Vite + Tailwind.

## Domain Information
- **Primary Domain:** https://ivolex.com
- **Vercel Domain:** https://ivolex.vercel.com
- **Developer:** Limitless Infotech Solution Pvt Ltd.

## Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion
- lucide-react
- Express.js (API)

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run dev         # start dev server
npm run dev:api     # start API server in development
npm run build       # production build
npm run preview     # preview production build
npm run start       # start API server in production
npm run lint        # lint source (after setup)
npm run lint:fix    # fix lint issues (after setup)
npm run format      # format with Prettier (after setup)
npm run test        # unit tests (after setup)
npm run e2e         # e2e tests (after setup)
```

## Project Structure (key)
- `src/main.jsx` – app bootstrap
- `src/ui/App.jsx` – page composition
- `src/ui/sections/*` – feature sections
- `src/ui/components/*` – reusable components
- `src/ui/contexts/*` – context providers
- `src/api/*` – API server and routes
- `public/images` – public assets
- `assets/` – source/original assets

## API Documentation
See `API_DOCS.md` for detailed API documentation.

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

### Docker Deployment
Build and run with Docker:
```bash
docker-compose up --build
```

### Manual Deployment
- Build: `npm run build` (outputs to `dist/`)
- Nginx example in `nginx.conf`
- GitHub Pages workflow: `.github/workflows/deploy-gh-pages.yml`

## CI/CD Pipeline
The project includes a comprehensive CI/CD pipeline defined in `.github/workflows/ci-cd.yml` that includes:
- Testing and linting on multiple Node.js versions
- Security auditing
- Automatic deployment to GitHub Pages
- API deployment to cloud platforms

## Notes
- Replace placeholder images in `public/images` with final assets.
- Use environment variables via Vite (e.g., `VITE_*`). A `.env.example` will be added.