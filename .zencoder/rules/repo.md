# Repo Metadata

name: IVolex – Leather E‑Commerce MVP
stack:
  - React 18 + Vite 5
  - Tailwind CSS 3
  - Framer Motion
  - lucide-react
entry:
  - index.html
  - src/main.jsx
  - src/ui/App.jsx
build:
  tool: Vite
  outDir: dist
  scripts:
    - dev: vite
    - build: vite build
    - preview: vite preview

structure:
  src:
    - main.jsx
    - styles.css
    - ui/
      - App.jsx
      - components/*
      - contexts/*
      - sections/*
  public:
    - images/*
  assets:
    - original assets

deploy:
  - nginx.conf example provided
  - GitHub Pages workflow included

notes:
  - Initial MVP without linting/testing/TS; planned in TODO.md
  - Images currently placeholders; replace with production assets