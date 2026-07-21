# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Centaurus Boosters** website — a Next.js static site for a high school athletics booster club. Content is managed via TinaCMS (cloud-backed headless CMS). The site deploys to Vercel as a fully static export (`output: 'export'`).

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

- `src/components/next-sections/` — page section components, one file per homepage section. These receive slices of the `page` data object as props.
- `src/components/tina/editable.js` — re-exports TinaCMS hooks and provides `makeSafeTina` and `EditableRichText` utilities.

### Styling

Design tokens (colors, fonts, radius) live in `src/styles/global.css`; the section class vocabulary (`.section`, `.kicker`, `.section-title`, `.btn`, `.card`, per-section blocks, mobile rules) lives in `src/styles/components.css`. Tailwind CSS is **not** used — styles are plain CSS. Components must not contain hex colors or `style={{...}}` except for genuinely dynamic values (currently: the hero slide transform and the stat-band column count). See `docs/EDITING.md` for the editing guide (CMS tasks and the copy-a-section workflow).

### TinaCMS Admin Gotchas (tinacms 3.9.4)

**`page` collection `allowedActions` interacts with visual editing routing.** `tina/config.ts` defines `page` as `global: true` with a custom `ui.router: () => '/'` (this is what powers live/visual editing) and `ui.allowedActions: { create: false, delete: false }`.

TinaCMS's `GetCollection.tsx` auto-redirects into the live visual-editing overlay (`/~/...`) whenever a collection has *all* of: exactly one document, `create` **and** `delete` both disabled, and a `ui.router`. That's why clicking "Home Page" in the admin sidebar drops into visual-editing mode (live iframe, empty sidebar) instead of opening a plain form directly.

- **`create: false` kept (current setting):** menu click → live-editing mode. Sidebar stays empty until you click a `data-tina-field`-wired element in the iframe — but clicking *any* wired field opens the full page form (every section, via collapsible groups) in the sidebar with the live preview still visible alongside.
- **Removing `create: false`** flips this: menu click → plain full form opens immediately in the main panel, but with no live iframe while that form is open. (Safe to remove in isolation — `global` collections already block creating a second document via a separate check in `CollectionListPage.tsx`, so this doesn't actually enable multi-document creation.)

These two modes are mutually exclusive in 3.9.4 for a `global + router` collection — there's no built-in way to get an auto-populated sidebar form *and* the live iframe simultaneously (verified: no hidden trigger button exists in the admin chrome). We keep `create: false` to preserve the live-preview workflow.

Practical implication: any top-level `page` field needs `data-tina-field={tinaField(...)}` wiring in its rendering component to be reachable without first knowing to click something else in the live preview. `Programs.jsx` and `StatBand.jsx` had none and were effectively unreachable in the admin until wired.

**Media is backed by Vercel Blob, not TinaCloud's assets CDN.** `tina/config.ts`'s `media.loadCustomStore` points at `VercelBlobMediaStore` (`src/lib/tina-vercel-blob-store.ts`), which drives three routes: `src/pages/api/tina/media-upload.ts` (client-token upload via `@vercel/blob/client`'s `handleUpload`), `media-list.ts`, and `media-delete.ts`. All three require an authenticated admin session via `requireTinaSession` (`src/lib/tina-media-auth.ts`), the same NextAuth session used by the Tina GraphQL backend. Requires `BLOB_READ_WRITE_TOKEN` in the environment (alongside the existing Google/NextAuth vars) — without it, uploads/list/delete all fail.

- Every blob lives under the `tina-media/` prefix (`MEDIA_PREFIX` in `src/lib/tina-media-store-shared.ts`). Uploads are rejected server-side (`onBeforeGenerateToken`) if the pathname doesn't start with that prefix, and deletes are rejected (403) if `head(url)` resolves to a pathname outside it — this prevents an authenticated Tina session from deleting arbitrary blobs elsewhere in the store.
- `media-list.ts` uses `list({ mode: 'folded' })` so subfolders come back as `type: 'dir'` entries instead of flattening nested blobs into the root with slashes in the filename.
- Uploads use `addRandomSuffix: false` — re-uploading a file with the same name overwrites it rather than accumulating `-xxxxxxxx` suffixed copies. Fine for this project's small, curated media library; revisit if the library grows and accidental overwrites become a real risk.
- **One Blob store (`centaurus-boosters-media`) is connected to all three environments** (Production, Preview, Development) — local dev shares the same store as production, by deliberate choice (a separate `centaurus-boosters-media-dev` store was tried and then removed). If you ever need to change which environments a store is connected to, use the Storage tab's connection UI (disconnect/reconnect with the right environment checkboxes) rather than `vercel env rm` on the derived token — removing the env var directly does not update the store's connection record, so the two can drift out of sync (learned the hard way: `vercel env rm BLOB_READ_WRITE_TOKEN development` deleted the token for all three environments at once when it was one shared connection).
- **All of `public/assets`'s original images have been migrated to Blob** under `tina-media/` (same pathnames, e.g. `tina-media/logo-westbound.png`) — both the 9 Tina-managed sponsor logo fields in `home.json` and 5 hardcoded `<img>` tags in `Nav.jsx`/`FooterClient.jsx`/`HeroClient.jsx`/`CourseClient.jsx`/`GolfEventClient.jsx` that were never part of the Tina schema. The files still exist under `public/assets` as an offline backup, but nothing in the app reads from that path anymore — any new hardcoded image should go to Blob directly (`put()` from `@vercel/blob` with the `tina-media/` prefix), not `public/assets`.
- **Thumbnails always point at the full-resolution blob.** TinaCMS's Media Manager only shows an `<img>` preview (vs. a generic file icon) when `item.thumbnails["75x75"|"400x400"|"1000x1000"]` is set (`isImage()` check in its `ListMediaItem`/`GridMediaItem` components). Vercel Blob has no resizing, so `buildThumbnails()` (`src/lib/tina-media-store-shared.ts`) just reuses `blob.url` for every requested size — fine for a small media library; worth real resizing (e.g. `@vercel/og` or an image service) if it grows large enough for payload size to matter. Note the Media Manager's default **Grid view** crops thumbnails to a square (`object-cover` in Tina's own CSS, not driven by us) — switch to **List view** in the admin UI if you want to see the untouched aspect ratio.

**Debugging tip:** the shipped admin bundle is minified, but TinaCMS publishes readable TS source per version tag on GitHub: `gh api repos/tinacms/tinacms/contents/<path>?ref=tinacms@X.Y.Z`. Routing lives in `packages/tinacms/src/admin/`; media in `packages/tinacms/src/toolkit/core/media*.ts`.

**Local auth bypass.** Set `TINA_LOCAL_AUTH_BYPASS=true` in `.env` to skip Google sign-in entirely when testing the admin/media routes locally without Google OAuth credentials configured. `isAuthBypassEnabled()` (`src/lib/tina-auth-bypass.ts`) gates every auth check — `requireTinaSession`, the Tina GraphQL backend's `authProvider.isAuthorized`, and which client-side `authProvider` `tina/config.ts` picks (`LocalAuthProvider` from `tinacms` instead of `GoogleAuthProvider`). It's hard-gated behind `NODE_ENV !== 'production'` so it can't activate in a deployed build even if the var is set by mistake.

### Local environment variables

Use **only `.env`** for local dev, populated via `vercel env pull .env --environment=development` — do not use `.env.local`. `@tinacms/cli` hardcodes reading `.env` (`dotenv.config({ path: '.env' })` in its source), not `.env.local`; `next build`/`next dev` read both, so `.env` alone is sufficient for everything in this project (`tinacms build`/`tinacms dev` *and* `next build`/`next dev`). Splitting into `.env` + `.env.local` looks like a shared/personal-override pattern but isn't one here — both files are gitignored, so nothing is actually shared via git; it was only duplicate, driftable copies of the same secrets. Set all dev env vars in the Vercel project's **Development** environment (`vercel env add <NAME> development`) so they survive re-pulls, rather than hand-editing `.env` (which gets overwritten on the next pull).

### Deployment

The site deploys to Vercel as a static export (`out/` directory). The TinaCloud token must be set as `TINA_TOKEN` environment variable in Vercel. The TinaCMS admin UI is served at `/admin` (built into `public/admin`).
