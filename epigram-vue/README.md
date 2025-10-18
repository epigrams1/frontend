# Epigramia

Epigramia is a Vue 3 + TypeScript + Vite app for browsing random epigrams, saving favorites, and managing your own epigrams.

## Run with npm

- **Install dependencies**
```bash
npm ci
```
- **Start dev server** (with HMR)
```bash
npm run dev
```
- **Build for production** (outputs to `dist/`)
```bash
npm run build
```
- **Preview production build**
```bash
npm run preview
```

## Run with Docker

This project includes a multi-stage Dockerfile that builds the app and serves it with Nginx (SPA routing is handled via `try_files` in `nginx.conf`).

- **Build image**
```bash
docker build -t epigramia:latest .
```
- **Run container** (http://localhost:8080)
```bash
docker run --rm -p 8080:80 epigramia:latest
```

Files used:
- `Dockerfile` – build (Node 20 Alpine) + runtime (Nginx Alpine)
- `nginx.conf` – SPA fallback to `index.html`

## Structure (excerpt)

- `src/components/`
- `src/views/`
- `src/stores/`
- `src/utils/`
- `public/`
