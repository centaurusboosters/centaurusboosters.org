# Refactor Tina to a single "Home Page" document

## Context

The homepage at `/` aggregates content from **8 separate Tina collections** (sponsors, tournament, contacts, sponsor_benefits, get_involved, site, about, grants), each a singleton with `ui.router: () => '/'`. Visual/click-to-edit works, but the left **Collections sidebar is unusable**: clicking any collection redirects to `#/~/` and always shows the same default form ("About / Mission"). Research confirmed this is a known, **`wontfix`** TinaCMS limitation ([#4345](https://github.com/tinacms/tinacms/issues/4345)) — the first `useTina` call on a page wins the sidebar slot, and multiple singletons sharing one route cannot be switched. An anchor-based router (`router: () => '/#sponsors'`) does **not** work: Tina's admin is hash-routed (`#/~/…`), so the inner hash is stripped and the preview neither scrolls nor switches forms (verified). The endorsed fix is to model the page as **one collection**.

Because `tournament`, `site`, and `contacts` data are each reused across 4–5 sections, we use a **single structured document** (not reorderable blocks) so shared fields stay single-source. Outcome: one "Home Page" entry in the sidebar, one `useTina` call, fixed section order, click-to-edit on every field.

## Approach

Merge the 8 collections into **one `page` collection** backed by a single `src/data/home.json`, with fields grouped by domain (mirroring today's groupings). The homepage makes **one** `useTina` call in a new client wrapper and passes resolved slices down to presentational section components. Rich-text bodies (About + 2 Grants) become Tina `rich-text` fields stored as AST inside `home.json`.

## New schema — `tina/config.ts`

Replace all 8 collections with one:

```
name: 'page', label: 'Home Page', path: 'src/data', format: 'json',
match: { include: 'home' },
ui: { router: () => '/', global: true, allowedActions: { create: false, delete: false } },
fields: [ object 'tournament' {…current tournament.json fields…},
          object 'site' {copyright, social{facebook}, hero_mission{…}, donate{…}, sponsor_cta{…}},
          object 'contacts' {players{name,email}, sponsorship[] {name,email}},
          object 'sponsors' { items[] {name, image logo, alt, boolean enabled} },
          object 'sponsor_benefits' { items[] string },
          object 'get_involved' { items[] {title, description, link_label, form, form_title, coming_soon} },
          object 'about' { title, rich-text body },
          object 'grants' { items[] {audience, title, rich-text body, cta_label, form} } ]
```

`ui.global: true` moves it into the sidebar's "Site" section (single clean entry). `programs` and `forms` stay as plain static JSON (not CMS-managed, per existing plan).

## Data migration — `src/data/home.json` (new)

Merge the current files into one document under the keys above. Convert the three rich-text bodies (`about/index.mdx`, `grants/team-grants.mdx`, `grants/senior-scholarships.mdx`) from markdown to rich-text AST, e.g. `{ "type":"root","children":[{"type":"p","children":[{"type":"text","text":"…"}]}] }`. Grants `items` order = [team-grants, senior-scholarships] to preserve current per-card styling (applied by index in the component).

## Component changes — `src/components/next-sections/`

**New `HomePage.jsx`** (`'use client'`): calls `useTina` once with the page doc (falling back to static via `makeSafeTina('page', staticData)`), resolves `page`, and renders all sections passing slices (`page.tournament`, `page.site`, …). Holds the Hero carousel state currently in HeroClient (or keeps HeroClient as a child receiving props).

**`src/app/page.jsx`**: fetch once with `getTinaDocument('page', 'home.json')` (`src/lib/tina-content.js`, reused as-is), import `home.json` as static fallback, render `<Nav/> <HomePage tina={…} staticData={…}/> <FormModal/>` inside the `#top` wrapper.

**Refactor the 11 presentational components** (HeroClient, GolfEventClient, CourseClient, RegisterClient, SponsorCTAClient, DonateClient, GetInvolvedClient, SponsorStripClient, FooterClient, AboutEditor, GrantsEditor): drop their internal `useEditableDocument`/`useTina` calls; accept already-resolved data objects as props and keep their existing `tinaField(obj, 'field')` annotations and markup (incl. section `id`s like `#golf`, `#register`). StatBand/Programs receive `tournament`/`programs` as props from HomePage so computed stats reflect live edits.

**Delete the thin async server wrappers** (now redundant): About, Hero, GolfEvent, Course, Register, GetInvolved, SponsorCTA, Donate, Grants, SponsorStrip, Footer (`.jsx`).

**`src/components/tina/editable.js`**: keep `useTina`, `tinaField`, `makeSafeTina`; simplify `EditableRichText` to render the field's AST directly via `TinaMarkdown` (static fallback is now the same AST shape, so the separate `fallbackHtml` path is removed). Drop `useEditableDocument` (replaced by the single resolve in HomePage) or repurpose it for the one call.

## Cleanup

Delete after migration: `src/data/{tournament,site,contacts,sponsors,sponsor-benefits,get-involved}.json`, `src/content/about/`, `src/content/grants/`, and `src/lib/content.js` (markdown renderer no longer used). Keep `programs.json`, `forms.json`. `tina/__generated__/` regenerates automatically (already gitignored).

## Verification

1. `npm run dev` (tinacms regenerates schema + client for the new `page` query).
2. Public site `http://localhost:3000/` renders identically to now (diff the sections visually) — static fallback path.
3. `http://localhost:3000/admin` → sidebar shows a **single** "Home Page" entry; opening it shows the homepage preview with one coherent form; no more bounce-to-About.
4. Click-to-edit each section in the preview (hero, tournament, sponsors, contacts, get-involved, about, grants, footer) → correct fields focus; edits live-update the preview.
5. Edit a shared field (e.g. `tournament.venue`) once → verify it updates Hero, GolfEvent, Course, Register, and Footer together.
6. Save and confirm `home.json` is written; rich-text About/Grants edits round-trip.
7. `npm run build` (static export) succeeds.
