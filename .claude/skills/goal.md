# /goal — Iterative Site Improvement Loop

One improvement per invocation. Each run leaves the site shippable and committed.

**How it's driven:** `/loop` self-paced — one backlog item per iteration. After each item, stop and let the loop continue (or pause for human review). Do **not** bundle multiple items into one run.

**Source of truth:** `index.html` is plain static HTML. There is no build step and no design runtime — the only script is the inline vanilla hero cross-fade at the bottom of the file.

## What to do each run

**Step 1 — Orient**
Read `BACKLOG.md` and `index.html`. Pick the top unchecked item in TODO, working top-to-bottom within each priority group: P1 → P2 → P3 → Images.
- **Skip the BLOCKED section entirely** — those need human input; never start one.
- For an Image item, only take it if a real asset URL/path is available; otherwise skip to the next text item (never add a broken `<img>`).
- The backlog order is already prioritized; don't re-prioritize. If you believe the order is wrong, note it in the report and keep going — don't reorder mid-loop.

**Step 2 — Implement**
Make the change in `index.html`. Rules:
- **Plain static HTML only.** Keep the inline-style architecture for elements. Shared rules (and any media queries) go in the single `<style>` block in `<head>`.
- **"Static" means no server/CMS/data-fetch** — no `fetch()`, no API calls, no external data, no live social feed. Small vanilla `<script>` for UI behavior (e.g. a mobile-nav toggle) and CSS media queries **are allowed** — that's how P3 mobile nav gets done.
- Match the palette: navy `#0b1838`, red `#d8242f`, light blue `#7fa0ff`, body text `#aebbe0`. Match typography: Anton headings, Archivo body.
- Never break an existing section. Add new sections in logical document order.
- Image items: replace the placeholder `<div class="img-ph…" id="…">` with an `<img>` (same id + sizing) only when you have a real `src`. Keep the id.

**Step 3 — Verify (close the loop)**
1. Ensure a local static server is running from the repo root, e.g. `python3 -m http.server 8000` (background). Serve over http — the Google Form iframes render blank over `file://`.
2. Navigate to `http://localhost:8000/` and take a **desktop** screenshot, then resize to ~390×844 and take a **mobile** screenshot.
3. Check the browser console for errors/warnings — there should be none.
4. **Persona check:** look at the rendered result through the eyes of the persona(s) this item serves (from `PERSONAS.md`) and confirm it meets their "definition of done." State this in 1–2 sentences in the report. If it doesn't, fix it before moving on.
5. Confirm the site is still shippable: page renders, no section broken, no console errors, forms still present.

**Step 4 — Update backlog**
In `BACKLOG.md`:
- Move the completed item to DONE, checked `[x]`, with a date and a one-line note.
- If you discovered new issues, add them under a `## Discovered (triage)` section at the bottom — **do not** insert them into P1/P2/P3 yourself (that would keep moving the finish line). A human triages them later.

**Step 5 — Commit**
Commit just this iteration's changes (one item = one commit) on the `agent-loop` branch:
```
git add -A && git commit -m "goal: <item name>"
```
Keep screenshots out of the commit (they're scratch). Do not push unless asked.

**Step 6 — Report**
```
## Loop iteration complete
**Item done:** [name]
**Personas served:** [list]
**What changed:** [1–2 sentences]
**Verify:** desktop ✓ / mobile ✓ / console clean ✓ — [persona definition-of-done met?]
**Committed:** [short sha]
**Remaining TODO:** P1: X · P2: X · P3: X · Images: X  (Blocked: X · Discovered: X)
**Next up:** [name of next top TODO item]
```

## Rules

- **One item per run. Always shippable. Text before images.**
- **Skip BLOCKED items** — they need a human (e.g. sponsorship tier prices are in flux per Kelly).
- **Preserve the form iframes.** The Google Form embed URLs (registration, sponsorship, donation) and the grant/scholarship form links are live — do not modify them.
- **Sponsor logos / tiers need confirmation.** Don't hardcode sponsorship prices or add sponsor logos without a human OK — flag instead.
- **No new runtime deps.** Don't reintroduce React/Babel/a build step or add CDN script tags. Plain HTML/CSS + small inline vanilla JS only.

## Stopping condition

When all P1, P2, P3, and available Image items are done (BLOCKED and unavailable-asset items don't count), report:
```
## Backlog complete (static phase)
All actionable static TODO items are done and committed. The site renders clean and is ready to deploy to Vercel (static, zero-config).
Blocked (need human input): [list from BLOCKED]
Deferred (dynamic phase): [list from Dynamic section]
Discovered (need triage): [list from Discovered, if any]
Suggested next step: review with Kelly, resolve sponsorship tiers, get sponsor-logo confirmation, then deploy + tackle dynamic features.
```
