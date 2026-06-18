# /goal — Iterative Site Improvement Loop

One improvement per invocation. Each run leaves the site shippable.

## What to do each run

**Step 1 — Orient**
Read `BACKLOG.md` and `index.html`. Identify the top unchecked item in the TODO section (work top-to-bottom within each priority group: P1 first, then P2, then P3, then Images).

**Step 2 — Persona review (brief)**
Before implementing, channel the relevant personas from `PERSONAS.md` and state in 2–3 sentences:
- Which personas benefit most from this change
- Any risk or concern a persona would raise
- Confirm the site remains shippable after this change

**Step 3 — Implement**
Make the change in `index.html`. Follow these rules:
- Keep the existing inline-style architecture (no external CSS files)
- Match the color palette: dark navy `#0b1838`, red `#d8242f`, light blue `#7fa0ff`, text `#aebbe0`
- Match the typography: Anton for headings, Archivo for body
- Never break existing sections — add new sections in logical document order
- For image items: if no asset is available yet, improve the placeholder text to be descriptive and note what's needed; don't add broken img tags

**Step 4 — Update backlog**
In `BACKLOG.md`:
- Move the completed item from TODO to the DONE section (check the checkbox: `[x]`)
- If you discovered new issues during implementation, add them to the appropriate priority group
- Move any item from `_(none)_` in IN PROGRESS back to empty if you didn't finish it (shouldn't happen — pick completable items only)

**Step 5 — Report**
Output a brief summary:
```
## Loop iteration complete
**Item done:** [name of item]
**Personas served:** [list]
**What changed:** [1–2 sentences]
**Remaining TODO count:** P1: X · P2: X · P3: X · Images: X
**Next up:** [name of next top TODO item]
```

## Rules

- **One item per run.** Don't bundle multiple changes.
- **Always shippable.** Never leave a section half-built.
- **Text before images.** Never block on missing assets — skip image items if no asset URL is available and move to the next text item.
- **Static only.** Do not add JavaScript fetch calls, CMS integrations, or dynamic social feeds. The social media feed is explicitly deferred.
- **Preserve the form iframes.** The Google Form embed URLs for registration, sponsorship, and donation are live — do not modify them.
- **Ask before touching sponsorship tiers.** Kelly noted the sponsorship levels are being revised — flag this rather than hardcoding prices from the old site.
- **Sponsor logos need confirmation.** Add a note if you're pulling logos, since levels are in flux.

## Stopping condition

When all P1, P2, P3, and available image items are done, report:
```
## Backlog complete (static phase)
All static TODO items are done. The site is ready to ship.
Remaining deferred items (dynamic phase): [list from Dynamic section]
Suggested next step: review with Kelly, get sponsor logo confirmation, then tackle dynamic features.
```
