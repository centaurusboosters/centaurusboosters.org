# Astro Migration Plan

Migrate the booster site from Eleventy + Nunjucks to Astro with React components and MDX content, preserving the current visual design while establishing a clean content editing workflow via Decap CMS.

---

## Status

| Step | Description | Status |
|------|-------------|--------|
| 1 | Astro baseline (install, config, netlify, scripts) | `[x]` |
| 2 | CSS extraction (move inline styles, verify visual parity) | `[x]` |
| 3 | Data files (sponsors move + new JSON files) | `[x]` |
| 4 | MDX content files (collections config + content) | `[ ]` |
| 5 | Shared React components (SponsorStrip, SponsorCard) | `[ ]` |
| 6 | Section components (split index.njk into Astro components) | `[ ]` |
| 7 | Decap CMS config update (new paths + collections) | `[ ]` |
| 8 | Validation and build scripts + ops docs update | `[ ]` |
| 9 | Verification checklist | `[ ]` |
| 10 | Persona review | `[ ]` |

---

## Architecture decisions

### Separation of concerns

**Presentation components** (`src/components/ui/`) — Astro or React, pure layout/style, no data fetching. Accept typed props. These do not know what the site is about.

**Section components** (`src/components/sections/`) — Astro. Import data and MDX content, pass it to presentation components. One component per page section.

**Shared React components** (`src/components/shared/`) — React only for components that must run in both Astro and Decap CMS previews. Currently: `SponsorStrip.jsx`. The Decap preview injects live CMS data; the Astro page imports the static JSON. Same component, two data sources.

**Content** (`src/content/`) — MDX for flowing prose that maintainers might reasonably format (bold, links). Only sections where markdown adds value vs. plain JSON strings.

**Structured data** (`src/data/`) — JSON for lists, repeated records, numbers, and anything Decap CMS edits as form fields. Decap writes back to these files via GitHub.

### What goes where

| Content | Format | Decap editable |
|---------|--------|----------------|
| Sponsors (logo, name, enabled) | `data/sponsors.json` | Yes — existing collection |
| Programs list | `data/programs.json` | Yes — simple list widget |
| Tournament details (date, price, venue, inclusions, add-ons) | `data/tournament.json` | Yes — structured fields |
| Contact people and emails | `data/contacts.json` | Yes — structured fields |
| About/mission text | `content/about.mdx` | Yes — rich text widget |
| Grants and scholarships text | `content/grants.mdx` | Yes — rich text widget |
| Nav links, hero badge text | Hard-coded in components | No — rarely changes |
| Form URLs (Google Forms embeds) | `data/forms.json` | Yes — URL fields |

MDX is **not** used for sections that are purely structural (stat band, course map, register CTA) or that maintainers would never touch.

---

## Target file structure

```
src/
  pages/
    index.astro              # Composes all sections; no markup of its own

  components/
    sections/                # One .astro file per page section
      Nav.astro
      Hero.astro             # Hero with client-side spotlight rotation
      About.astro
      StatBand.astro
      Programs.astro
      GolfEvent.astro
      Course.astro
      Register.astro
      GetInvolved.astro
      SponsorCTA.astro
      Donate.astro
      Grants.astro
      SponsorStrip.astro     # Thin wrapper: imports JSON → passes to React
      Footer.astro
      FormModal.astro        # Modal shell + inline script

    ui/                      # Pure presentation, no data coupling
      SectionLabel.astro     # Red-bar eyebrow label pattern
      Card.astro             # Dark card with red left border
      PrimaryButton.astro    # Red CTA button
      OutlineButton.astro    # Ghost/outline button

    shared/                  # React — runs in Astro AND Decap preview
      SponsorStrip.jsx       # Accepts sponsors[] prop; renders logo grid
      SponsorCard.jsx        # Single sponsor logo tile

  content/                   # MDX files (Astro content collections)
    about.mdx
    grants.mdx               # Two entries: team-grants, senior-scholarships

  data/
    sponsors.json            # (moved from src/_data/sponsors.json)
    programs.json            # ["Football", "Basketball", …]
    tournament.json          # date, venue, price, inclusions, add_ons
    contacts.json            # kelly, cj, steve
    forms.json               # Google Form embed URLs keyed by name

  styles/
    global.css               # :root variables, body reset, font imports
    components.css           # Shared class utilities (navlink, spot, img-ph, etc.)

public/
  assets/                    # Images — passthrough, no change
  admin/
    index.html               # Decap CMS — no change
    config.yml               # Updated: new data file paths + MDX collections
    preview.jsx              # Decap preview registration for SponsorStrip
```

---

## Implementation steps

### Step 1 — Astro baseline

Install and configure Astro with static output, React integration, and MDX support. Remove Eleventy.

```
npm create astro@latest -- --template minimal
npm install @astrojs/react @astrojs/mdx react react-dom
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [react(), mdx()],
});
```

`netlify.toml` — change `publish` from `dist` to `dist` (no change needed; Astro also outputs to `dist` by default).

Update `package.json` scripts:
```json
"build": "astro build",
"dev": "astro dev",
"validate": "npm run build && bash scripts/validate-site.sh dist"
```

Delete `.eleventy.js`. The `public/` directory is Astro's default passthrough; assets and admin are served automatically.

Verify: `npm run build` produces `dist/index.html`, `dist/admin/`, `dist/assets/`.

---

### Step 2 — CSS extraction

Move all inline styles from `src/index.njk` into organized CSS files before splitting components, so each component gets clean class-based styling from the start.

`src/styles/global.css`:
- `:root` custom properties: `--color-navy`, `--color-red`, `--color-blue-muted`, `--color-text-dim`, `--font-display`, `--font-body`
- `*`, `html`, `body` reset
- Google Fonts `@import` (or keep `<link>` in layout)

`src/styles/components.css`:
- `.navlink` hover
- `.spot` transition
- `.img-ph`, `.img-ph-dark`, `.img-ph-light`
- `.nav-burger` and `#nav-mobile`
- `#form-modal` and children
- All `@media (max-width: 767px)` responsive overrides
- Section-specific responsive: `.stat-band`, `.event-grid`, `.course-outer`, `.course-photos`, `.ways-grid`, `.sponsor-layout`, `.grants-grid`, `.hero-cta`, `.hero-sep`

`src/pages/index.astro` (base layout):
```astro
---
import '../styles/global.css';
import '../styles/components.css';
---
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

Do not change any visual styles in this step — only move them. Verify pixel-equivalent output.

---

### Step 3 — Data files

Move and create structured data files.

**Move** `src/_data/sponsors.json` → `src/data/sponsors.json` (same content).

**Create** `src/data/programs.json`:
```json
["Football","Basketball","Baseball","Softball","Soccer","Swimming","Tennis","Golf","Cross Country","Track & Field","Volleyball","Wrestling","Lacrosse","Cheerleading"]
```

**Create** `src/data/tournament.json`:
```json
{
  "edition": "2nd Annual",
  "date": "Sun · Sept 20, 2026",
  "time": "9AM Shotgun Start",
  "venue": "Indian Peaks Golf Course",
  "address": "2300 Indian Peaks Trail, Lafayette, CO 80026",
  "price_player": 160,
  "price_foursome": 580,
  "holes": 18,
  "format": "Scramble",
  "inclusions": ["Range balls","Golf cart","18 holes","Tournament gift"],
  "add_ons": ["Mulligan Packages","Closest to the Pin","Skills Challenge","Longest Drive","Split the Pot"],
  "auction_description": "Massages, interior design services, CU Football & Avs tickets, themed baskets, tutoring, dog lover treats & more. Bid before lunch."
}
```

**Create** `src/data/contacts.json`:
```json
{
  "players": { "name": "Kelly Marcus", "email": "kelly@centaurusboosters.org" },
  "sponsorship": [
    { "name": "CJ Riggins", "email": "cj@centaurusboosters.org" },
    { "name": "Steve Seeger", "email": "steve@centaurusboosters.org" }
  ]
}
```

**Create** `src/data/forms.json`:
```json
{
  "registration": "https://docs.google.com/forms/d/e/1FAIpQLSdwS-RQ9RPclV8E_lqwKLl5vDOT890LV9UljSraub0lqTyekA/viewform?embedded=true",
  "sponsorship": "https://docs.google.com/forms/d/e/1FAIpQLSf-y_9WdzQJXq0ugcBpL3vVKT_m9VViLp-rbqGwWY3wykrIog/viewform?embedded=true",
  "donate": "https://docs.google.com/forms/d/e/1FAIpQLSefCBgzkS9VAD7rTyWQ_ZbYmj3JiJxQHMHr4u88D8Aw_8yiqQ/viewform?embedded=true",
  "team_grant": "https://docs.google.com/forms/d/e/1FAIpQLSd1mrOefRs-h8FGCy1Mb7JM7hn5Il79Tbn3HH-sooDD8Hy0vw/viewform?embedded=true",
  "scholarship": "https://docs.google.com/forms/d/e/1FAIpQLSdQ1QgG9k04HTN1ElW4mlIUT073MPgvwdqeyFeLnAWZyreBPQ/viewform?embedded=true"
}
```

---

### Step 4 — MDX content files

Create Astro content collections for prose that editors might want to format.

`src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  about: defineCollection({ type: 'content' }),
  grants: defineCollection({ type: 'content' }),
};
```

`src/content/about/index.mdx`:
```mdx
---
title: About Us
---

The Centaurus Booster Club is devoted to enriching the experience of students engaged in Centaurus Programs. Our vision is to cultivate a positive and supportive environment, promoting teamwork, sportsmanship, and personal growth.
```

`src/content/grants/team-grants.mdx`:
```mdx
---
title: Team Grants
audience: For Coaches
cta_label: Apply for a Grant
form: team_grant
theme: navy
---

Booster funds go directly to programs for equipment, travel, and the extras that make a season. Coaches can apply each year.
```

`src/content/grants/senior-scholarships.mdx`:
```mdx
---
title: Senior Scholarships
audience: For Seniors
cta_label: Apply Now
form: scholarship
theme: red
---

We celebrate graduating Warrior athletes with scholarships that send them into their next chapter strong.
```

---

### Step 5 — Shared React components

Implement `SponsorStrip.jsx` and `SponsorCard.jsx` as pure presentation components that accept data via props. These will be used in both the Astro page and the Decap CMS preview.

`src/components/shared/SponsorCard.jsx`:
```jsx
export default function SponsorCard({ logo, alt }) {
  return (
    <div className="sponsor-card">
      <img src={logo} alt={alt} />
    </div>
  );
}
```

`src/components/shared/SponsorStrip.jsx`:
```jsx
import SponsorCard from './SponsorCard.jsx';

export default function SponsorStrip({ sponsors }) {
  const active = sponsors.filter(s => s.enabled);
  return (
    <div className="sponsor-strip-grid">
      {active.map(s => (
        <SponsorCard key={s.name} logo={s.logo} alt={s.alt} />
      ))}
    </div>
  );
}
```

`src/components/sections/SponsorStrip.astro` — thin Astro wrapper:
```astro
---
import sponsorData from '../../data/sponsors.json';
import SponsorStrip from '../shared/SponsorStrip.jsx';
---
<section class="sponsor-strip-section">
  <div class="section-label">Proudly Supported by Our Sponsors</div>
  <SponsorStrip sponsors={sponsorData.items} client:load />
</section>
```

CSS for sponsor components goes in `src/styles/components.css` under `.sponsor-card`, `.sponsor-strip-grid`, `.sponsor-strip-section`.

---

### Step 6 — Section components

Split `src/index.njk` into one Astro component per section. Each component:
- Imports its data from `src/data/` or renders its MDX collection entry
- Uses class names from `src/styles/components.css`
- Passes data as props to `ui/` components where the pattern repeats

**Component responsibilities:**

| Component | Data source | Notes |
|-----------|-------------|-------|
| `Nav.astro` | Hard-coded links | Burger menu JS lives here as `<script>` |
| `Hero.astro` | `tournament.json` | Spotlight rotation script as `<script>` |
| `About.astro` | `content/about/index.mdx` | Renders `<Content />` from collection |
| `StatBand.astro` | `tournament.json` | Programs count hard-coded (20+) |
| `Programs.astro` | `programs.json` | Renders tag pills |
| `GolfEvent.astro` | `tournament.json` | Inclusions, add-ons, auction, prices |
| `Course.astro` | `tournament.json` | address, venue, map iframe |
| `Register.astro` | `tournament.json`, `contacts.json`, `forms.json` | |
| `GetInvolved.astro` | `forms.json` | Form-trigger buttons |
| `SponsorCTA.astro` | `contacts.json`, `forms.json` | Benefits list hard-coded (rarely changes) |
| `Donate.astro` | `forms.json` | |
| `Grants.astro` | `content/grants/*.mdx`, `forms.json` | Renders two grant cards from MDX |
| `SponsorStrip.astro` | `sponsors.json` → React | |
| `Footer.astro` | `contacts.json`, `tournament.json` | |
| `FormModal.astro` | None | Modal shell + modal open/close script |

**`src/pages/index.astro`** becomes a flat composition:
```astro
---
import Nav from '../components/sections/Nav.astro';
import Hero from '../components/sections/Hero.astro';
// ... all sections
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Centaurus Warriors Booster Club — Supporting CHS Athletics</title>
    <meta name="description" content="..." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <Nav />
    <Hero />
    <About />
    <StatBand />
    <Programs />
    <GolfEvent />
    <Course />
    <Register />
    <GetInvolved />
    <SponsorCTA />
    <Donate />
    <Grants />
    <SponsorStrip />
    <Footer />
    <FormModal />
  </body>
</html>
```

---

### Step 7 — Decap CMS updates

Update `public/admin/config.yml` to reflect moved data paths and add new collections.

```yaml
backend:
  name: github
  repo: kurtharriger/2026-boosters
  branch: main
  site_domain: gilded-genie-b2528a.netlify.app
  squash_merges: true

publish_mode: editorial_workflow

media_folder: "public/assets"
public_folder: "assets"

collections:
  - name: "site_data"
    label: "Site Data"
    files:
      - name: "sponsors"
        label: "Sponsors"
        file: "src/data/sponsors.json"      # updated path
        format: "json"
        fields:
          - label: "Sponsors"
            name: "items"
            widget: "list"
            summary: "{{fields.name}}"
            fields:
              - { label: "Name", name: "name", widget: "string" }
              - { label: "Logo", name: "logo", widget: "image" }
              - { label: "Alt text", name: "alt", widget: "string" }
              - { label: "Enabled", name: "enabled", widget: "boolean", default: true }

      - name: "tournament"
        label: "Tournament Details"
        file: "src/data/tournament.json"
        format: "json"
        fields:
          - { label: "Edition", name: "edition", widget: "string" }
          - { label: "Date", name: "date", widget: "string" }
          - { label: "Time", name: "time", widget: "string" }
          - { label: "Venue", name: "venue", widget: "string" }
          - { label: "Address", name: "address", widget: "string" }
          - { label: "Price per player ($)", name: "price_player", widget: "number" }
          - { label: "Price per foursome ($)", name: "price_foursome", widget: "number" }

      - name: "contacts"
        label: "Contacts"
        file: "src/data/contacts.json"
        format: "json"
        fields:
          - label: "Players contact"
            name: "players"
            widget: "object"
            fields:
              - { label: "Name", name: "name", widget: "string" }
              - { label: "Email", name: "email", widget: "string" }
          - label: "Sponsorship contacts"
            name: "sponsorship"
            widget: "list"
            fields:
              - { label: "Name", name: "name", widget: "string" }
              - { label: "Email", name: "email", widget: "string" }

  - name: "content"
    label: "Page Content"
    files:
      - name: "about"
        label: "About / Mission"
        file: "src/content/about/index.mdx"
        format: "frontmatter"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Body", name: "body", widget: "markdown" }

      - name: "grants_team"
        label: "Team Grants"
        file: "src/content/grants/team-grants.mdx"
        format: "frontmatter"
        fields:
          - { label: "Audience label", name: "audience", widget: "string" }
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Body", name: "body", widget: "markdown" }
          - { label: "CTA label", name: "cta_label", widget: "string" }

      - name: "grants_scholarships"
        label: "Senior Scholarships"
        file: "src/content/grants/senior-scholarships.mdx"
        format: "frontmatter"
        fields:
          - { label: "Audience label", name: "audience", widget: "string" }
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Body", name: "body", widget: "markdown" }
          - { label: "CTA label", name: "cta_label", widget: "string" }
```

**Decap preview for SponsorStrip** — `public/admin/preview.jsx`:
```jsx
import CMS from 'netlify-cms-app';
import SponsorStrip from '../../src/components/shared/SponsorStrip.jsx';

CMS.registerPreviewTemplate('sponsors', ({ entry }) => {
  const sponsors = entry.getIn(['data', 'items'])?.toJS() ?? [];
  return <SponsorStrip sponsors={sponsors} />;
});
```

Register the preview script in `public/admin/index.html` by adding a `<script type="module" src="preview.jsx">` tag (Decap supports ESM previews via its bundling or a small Vite build step — use `<script src="preview.js">` with a pre-bundled file if bundling is required).

---

### Step 8 — Validation and build scripts

Update `scripts/validate-site.sh` — no change needed if it only checks `dist/` for `index.html`, `admin/index.html`, and `admin/config.yml`.

Update `docs/operations.md` to reflect the new data file paths and the concept of presentation vs. data components.

Remove the reference to `.eleventy.js` from any docs.

---

### Step 9 — Verification checklist

Before declaring done, verify each of the following locally:

- [ ] `npm run build` completes without errors
- [ ] `npm run validate` passes
- [ ] `dist/index.html` exists and has `<html lang="en">`
- [ ] `dist/admin/index.html` and `dist/admin/config.yml` exist
- [ ] `dist/assets/` contains all sponsor logos and course photos
- [ ] Homepage renders visually equivalent to the current Eleventy output (check in browser at `astro dev`)
- [ ] Hero spotlight rotation works
- [ ] Mobile nav burger opens/closes
- [ ] Form modal opens on CTA clicks
- [ ] Sponsor strip renders all 9 enabled sponsors
- [ ] Decap `/admin/` page loads and can authenticate
- [ ] Sponsors collection in Decap shows the 9 sponsors from `src/data/sponsors.json`
- [ ] Tournament Details collection shows and saves edits
- [ ] SponsorStrip preview renders in Decap sponsors editor

---

### Step 10 — Persona review

Run against the review personas in `agent/PERSONAS.md`:

**Content Editor** — Can update sponsor logos, add a new sponsor, change the tournament date, and edit the About text entirely from the Decap `/admin/` UI without touching any JSX, CSS, or MDX files directly.

**Club President** — Registration, sponsorship, and donation buttons all function. All contact emails are correct and maintainable from Decap.

**UX / Mobile / Accessibility** — Mobile responsive breakpoints match the current site. Burger menu, hero CTA stacking, and single-column stat band all work at 375px. Form modal is accessible (`role="dialog"`, `aria-modal`, Escape key closes).

**SEO / Discoverability** — `<title>` and `<meta name="description">` are present in the Astro page head. Images have meaningful `alt` text. No SEO regressions.

**Delivery Steward** — Netlify deploy preview renders correctly. No new npm audit vulnerabilities introduced. `npm run validate` passes in CI.

---

## Non-goals for this migration

- Do not redesign or change any visual appearance
- Do not add new page sections or content
- Do not migrate the automation webhook runner
- Do not add TypeScript to component files (data files may use `.ts` for content config)
- Do not add unit tests for components in this pass
