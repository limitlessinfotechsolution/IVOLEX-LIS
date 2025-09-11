# IVOLEX – Leather E‑Commerce MVP (1:1)

Pixel-perfect MVP that mirrors the provided design.

## Tech
- React + Vite
- Tailwind CSS
- Framer Motion
- lucide-react

## Quick Start
```bash
npm install
npm run dev
```

## Notes
- Images are placeholders in `/public/images`. Replace with your assets to match the exact design.
- All sections and copy match the reference: Header, Hero, Featured Categories, Trending Products, Custom CTA, Features, Testimonials, Newsletter, Footer.


## Production Build & Deploy (No Docker)

### 1) Local production build (creates ivolex-dist.zip)
```bash
# from project root
chmod +x build-prod.sh
./build-prod.sh
# result: ivolex-dist.zip (contains `dist/` ready to serve)
```

### 2) Serve with Nginx (example)
1. Copy the contents of `dist/` to your web root, e.g. `/var/www/ivolex`:
   ```bash
   unzip ivolex-dist.zip -d /tmp && sudo rsync -a /tmp/dist/ /var/www/ivolex/
   ```
2. Place the provided `nginx.conf` into `/etc/nginx/sites-available/ivolex` and symlink to `sites-enabled`:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/ivolex
   sudo ln -s /etc/nginx/sites-available/ivolex /etc/nginx/sites-enabled/ivolex
   sudo nginx -t && sudo systemctl reload nginx
   ```
3. Replace `server_name` in `nginx.conf` with your domain and ensure DNS points to your server.

### 3) Optional: CI/CD via GitHub Pages
- A GitHub Actions workflow `.github/workflows/deploy-gh-pages.yml` is included. Push to `main` to automatically build and publish `dist/` to GitHub Pages.
- This method doesn't require a Dockerfile—GitHub Pages will serve the static site.
