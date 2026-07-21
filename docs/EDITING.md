# Editing the Booster Club Website

This guide has two parts:

1. **[Editing content](#part-1-editing-content-no-code)** — for board members and volunteers. No code, everything happens in the admin site.
2. **[Editing the code](#part-2-editing-the-code-copy-paste-level)** — for anyone comfortable copying a file and changing some text. You do not need to know React or CSS to follow it.

---

## Part 1: Editing content (no code)

Go to **`yoursite.com/admin`** and sign in with your Google account. Click any text or image on the live preview and an editing form opens on the left. Edit, then click **Save** — the site republishes automatically in a couple of minutes.

### Common tasks

| I want to… | Where to click |
|---|---|
| Change the tournament date, time, or prices | Click the date/time in the hero, or any tournament text → **Tournament** section of the form |
| Turn the whole tournament section off (off-season) | Open the form → **Tournament** → toggle **"Show tournament section"** off |
| Fix wording anywhere on the page | Click that text in the preview and type |
| Change a button label ("DONATE NOW", "REGISTER A FOURSOME"…) | Click the button in the preview |
| Add or remove a sponsor logo | Form → **Sponsors** → add an item (upload the logo image) or toggle **Enabled** off to hide one |
| Swap a photo (hero, event, course) | Form → **Tournament → Photos** → click the image field and upload a replacement. Update the "description (alt text)" field too — it's what screen readers announce. |
| Change the list of supported programs | Form → **Programs** |
| Edit grant / scholarship cards | Form → **Grants** |
| Change contact names/emails | Form → **Contacts** |
| Change a Google Form link (donate, registration, grants…) | Admin sidebar → **Forms** |

### Things to know

- **Off-season mode**: the "Show tournament section" toggle hides the golf hero slide, event, course, and register sections, plus tournament footer content — all at once. Nothing is deleted; toggle it back in season.
- **Images** live in a media library (Vercel Blob). Uploading a file with the same name replaces the old one everywhere it's used.
- **The Media Manager grid crops previews square** — switch to List view to see full images.
- If a change doesn't show up on the live site after ~5 minutes, ask a maintainer to check the deploy logs.

---

## Part 2: Editing the code (copy-paste level)

The whole site is one page built from **sections**, each a single file in
[`src/components/next-sections/`](../src/components/next-sections/). The page order is the component list in
[`HomePage.jsx`](../src/components/next-sections/HomePage.jsx) — what you see in that file, top to bottom, is the page, top to bottom.

### Anatomy of a section

Every section follows the same pattern. Here is Donate, in full:

```jsx
export default function DonateClient({ site }) {
  return (
    <div id="donate" className="section">              {/* dark navy band */}
      <div className="section-head">                   {/* centered heading block */}
        <div className="kicker kicker--center">DONATE</div>       {/* small blue label */}
        <h2 className="section-title">{site.donate.headline}</h2> {/* big Anton heading */}
        <p className="section-intro">{site.donate.body}</p>       {/* paragraph under it */}
      </div>
      <div className="section-cta">
        <button className="btn btn--red">…</button>    {/* the red action button */}
      </div>
    </div>
  );
}
```

That's the entire vocabulary. The pieces you can mix:

| Class | What it does |
|---|---|
| `section` | Full-width dark navy band with standard padding |
| `section--light` / `section--mid` / `section--white` | Light gray / lighter navy / white background instead |
| `section--compact` | Less vertical padding |
| `section-head` | Centers a kicker + title + intro |
| `kicker` | Small uppercase label. Add `kicker--rules` for the red bars, `kicker--center` to center it |
| `section-title` | The big condensed heading |
| `section-intro` | The paragraph under a title |
| `btn` + `btn--red` / `btn--navy` / `btn--white` / `btn--ghost` | Buttons and button-looking links |
| `card` | The navy gradient card with a red top bar |

All of these are defined (with comments) in [`src/styles/components.css`](../src/styles/components.css).

### Adding a new section by copying one

1. Copy the section file closest to what you want (e.g. `DonateClient.jsx`) to a new name, e.g. `VolunteerClient.jsx`, and rename the function inside to match (`export default function VolunteerClient(...)`).
2. Change the text and classes. Give the outer `<div>` a unique `id` if you want to link to it from the nav.
3. Open `HomePage.jsx`, import your file at the top (`import VolunteerClient from './VolunteerClient';`) and add `<VolunteerClient />` where it should appear in the page order.
4. Run `npm run dev` and check `localhost:3000`. Mobile layout comes for free as long as you stick to the classes above.

### Colors, fonts, and spacing

Never type a color code in a component. Every color is a named token in
[`src/styles/global.css`](../src/styles/global.css) — `var(--color-navy)`, `var(--color-red)`, `var(--color-text-dim)`, etc.
If you need a new color, add it there once and reference it. The two fonts are `var(--font-display)` (the big condensed headings) and `var(--font-body)` (everything else).

### Rules of thumb

- Text that a board member might ever want to change belongs in the CMS: add a field in [`tina/config.ts`](../tina/config.ts), a value in [`src/data/home.json`](../src/data/home.json), and render it with a `data-tina-field={tinaField(...)}` attribute (copy how any neighboring field does it).
- Images go in the media library (`tina-media/` on Vercel Blob), not in `public/`.
- `style={{ ... }}` in components is reserved for values that genuinely change at runtime (there are exactly two on the site). Everything else belongs in `components.css`.
