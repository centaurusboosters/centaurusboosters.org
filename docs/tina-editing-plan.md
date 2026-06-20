# Tina Visual Editing — Implementation Plan

## Goal
Wire all homepage sections to Tina's contextual (visual) editing so selecting any collection in `/admin` shows the homepage preview with clickable in-place field annotations.

## Architecture — minimal duplication

Each section uses **one server wrapper + one client component**. No separate static fallback in the server component.

### Pattern

```
SomeSection.jsx   (server, async, thin)
  → fetches getTinaDocument(...)
  → imports static JSON as fallback
  → always renders <SomeSectionClient tina={tina} staticData={staticData} />

SomeSectionClient.jsx  ('use client')
  → constructs safeTina = tina ?? { data: { key: staticData }, query: '', variables: {} }
  → calls useTina(safeTina)  — satisfies Rules of Hooks unconditionally
  → resolves data = tina ? liveData : staticData
  → renders with data-tina-field annotations
```

The `useTina` hook is a no-op outside the admin iframe (returns data as-is), so passing static data in a synthetic tina shape when not in CMS mode is safe and harmless.

For multi-collection sections, the client component calls `useTina` once per collection needed.

### When sections use multiple collections
Pass one prop per collection (`tinaTournament`, `tinaSite`, etc.) plus matching static fallbacks. Each becomes its own `useTina` call in the client component.

---

## Steps (execute one per goal-loop iteration, validate after each)

### Prerequisite
- [x] `tina/config.ts` — `router: () => '/'` added to all 8 collections

### Foundation
- [x] **editable.js** — export `useTina` directly so client components can use the raw hook; also export a `makeSafeTina(key, fallback)` helper that builds a synthetic tina shape

### Sections (single collection)

- [x] **GolfEvent** — `tournament` collection  
  Fields: `section_headline`, `section_intro`, `format_label`, `inclusions`, `add_ons`, `auction_description`, `price_player`, `price_foursome`

- [x] **Course** — `tournament` collection  
  Fields: `venue`, `course_description`, `address`

- [x] **Donate** — `site` collection  
  Fields: `site.donate.headline`, `site.donate.body`

- [x] **GetInvolved** — `get_involved` collection  
  Fields: per-item `title`, `description`, `link_label`

- [x] **SponsorStrip** — `sponsors` collection  
  Fields: per-item `name`, `logo`, `alt`

### Sections (multiple collections)

- [x] **Register** — `tournament` + `contacts`  
  Fields: `register_headline`, `register_intro`, `arrive_by`, `time`; `contacts.players.name`, `contacts.players.email`

- [x] **SponsorCTA** — `site` + `sponsor_benefits` + `contacts`  
  Fields: `site.sponsor_cta.*`; `sponsor_benefits.items`; `contacts.sponsorship[*]`

- [x] **Footer** — `contacts` + `tournament` + `site`  
  Fields: `contacts.players.*`, `contacts.sponsorship[*]`, `tournament.venue`, `tournament.address`, `site.copyright`, `site.social.facebook`

### Complex (existing client component)

- [x] **Hero** — `tournament` + `site`  
  Currently `'use client'` with useState/useEffect carousel. Strategy:
  - Create `HeroWrapper.jsx` (new server component, fetches both tina docs)
  - Rename current `Hero.jsx` → `HeroClient.jsx`; add `tina` props + `useTina` calls
  - Update `page.jsx` import to `HeroWrapper`  
  Fields: `tournament.edition`, `tournament.date`, `tournament.time`, `tournament.venue`; `site.hero_mission.*`

### Low-value / skip

- **StatBand** — stats are computed expressions (`${programs.length}+`, etc.), not direct field values; skip `data-tina-field` annotations but do register `tournament` via `useTina` if sidebar-jump is a problem after other sections are wired  
- **Programs** — `programs.json` has no Tina collection; skip
- **Nav**, **FormModal** — no CMS-managed content; skip

---

## Validate after each step

```
npm run build
```

The build must pass before marking a step done and moving to the next.

---

## Goal-loop usage

Set goal: `implement tina editing plan` and run `/loop`. Each iteration should:
1. Read this file
2. Find the first unchecked step
3. Implement it
4. Run `npm run build`
5. If passing, mark `[ ]` → `[x]` in this file and commit
6. Stop if all steps are checked
