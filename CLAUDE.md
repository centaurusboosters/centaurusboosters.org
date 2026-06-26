# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Centaurus Boosters** website — a Next.js static site for a high school athletics booster club. Content is managed via TinaCMS (cloud-backed headless CMS). The site deploys to Netlify as a fully static export (`output: 'export'`).

## Commands

```bash
# Local development (TinaCMS dev server + Next.js)
npm run dev

# Build for production (TinaCMS build + Next.js build)
npm run build

# Build without TinaCloud authentication (useful for local-only testing)
npm run build:local

# Next.js only (no TinaCMS, uses static JSON fallback)
npm run dev:next
```

No test suite exists in this project.

## Architecture

### Content Layer

All editable content lives in `src/data/home.json`. TinaCMS reads/writes this file through the schema defined in `tina/config.ts`. The schema defines a single `page` collection with fields for `tournament`, `site`, `contacts`, `sponsors`, `programs`, `stat_band`, `sponsor_benefits`, `get_involved`, `about`, and `grants`.

### Data Flow

`src/app/page.jsx` (server component) fetches content at build time via `getTinaDocument()` in `src/lib/tina-content.js`, which calls the generated TinaCloud client. The result is passed to `HomePage` as a `tina` prop.

`HomePage` (`src/components/next-sections/HomePage.jsx`) is a client component that calls `useTina(tina ?? makeSafeTina(...))`. The `makeSafeTina` fallback (in `src/components/tina/editable.js`) wraps the static JSON so the same `useTina` hook works both in production (live CMS data) and local dev without TinaCloud credentials.

### Tournament Toggle

`page.tournament.enabled` (boolean in `home.json`, toggled via TinaCMS) controls whether the golf tournament sections render. When `false`, tournament sections (`GolfEventClient`, `CourseClient`, `RegisterClient`, related footer content, stat band) are hidden entirely. This is the off-season mode.

### Component Structure

- `src/components/next-sections/` — page section components (one per homepage section). These receive slices of the `page` data object as props.
- `src/components/ui/` — reusable presentational components used inside the section components.
- `src/components/tina/editable.js` — re-exports TinaCMS hooks and provides `makeSafeTina` and `EditableRichText` utilities.

### Styling

Global CSS is in `src/styles/global.css`; component-specific utilities in `src/styles/components.css`. Tailwind CSS is **not** used — styles are plain CSS.

### Deployment

The site deploys to Vercel as a static export (`out/` directory). The TinaCloud token must be set as `TINA_TOKEN` environment variable in Vercel. The TinaCMS admin UI is served at `/admin` (built into `public/admin`).
