# Centaurus Boosters Website Backlog

Prioritized by the Product Owner persona: shippable after every item, text before images, trust signals before polish, static before dynamic.

**Source of truth:** `index.html` — plain static HTML (graduated off the dc-runtime design format on 2026-06-18). No React/Babel/build step; the only script is an ~8-line vanilla hero cross-fade.

**Shippable means:** opens and renders correctly as static files (verified in-browser) and deploys to Vercel as static files (zero-config). Serve over a local http server when verifying — the Google Form iframes render blank over `file://`.

Content audited against: centaurusboosters.org, sites.google.com/centaurusboosters.org/2025-centaurus-golf-tournament, Facebook photos page — then **reconciled against the current `index.html` on 2026-06-18** (the redesign already absorbed much of the old-site content, so several original audit items were already partly done; corrected below).

---

## IN PROGRESS
_(none)_

---

## BLOCKED — needs human input (loop must skip these)

- [ ] **Sponsorship tier table** — add a visible pricing grid above the sponsorship form. Known structure from Google Sites: Annual / Sport-specific options including webpage, tournament promo, gym banner, football field, tennis courts, Warrior TV, free foursome; plus a Hole Sponsor tier (~$500 on a Facebook promo graphic). **Blocked:** Kelly said the sponsorship levels are being revised — do not hardcode prices. Resolve current tiers/prices with Kelly, then move to P2.

---

## TODO — Static Content (no images needed)

### P1 — Trust & Accuracy (ship blockers)


### P2 — Completeness (high value, text-only)


### P3 — Mobile & Accessibility


---

## TODO — Images (requires assets)

> Placeholders are now plain `<div class="img-ph …" id="…">` boxes (no more `image-slot` custom element). To add an image, replace the placeholder div with an `<img>` of the same `id` and sizing, or set a `background-image` on it. Keep the ids. Never add a broken `<img>` with no real `src`.

- [ ] **Golf event photo** (`#event-photo`) — event section left column; use a golfer group shot from the tournament
- [ ] **Course photos ×2** (`#course-photo-1`, `#course-photo-2`) — Indian Peaks course section; use course/fairway photos
- [ ] **Real sponsor logos** (`#sponsor-1`…`#sponsor-6`) — replace 6 placeholder boxes with actual logos from centaurusboosters.org sponsors: Westbound Realty (BestNationalCO.com), Auguste Escoffier School of Culinary Arts, Kong Ice, Alpine Valley Oral Surgery, Rudrocks, Boulder Wealth Advisors, rockhop.ai, PPS, LFO (Lafayette Family Orthodontics). Download from live site or Facebook shout-out posts. Note: sponsorship levels are being revised — confirm before adding new logos.

---

## TODO — Dynamic / Future (out of scope for static phase)

- [ ] **Board members section** — original site says "coming soon"; build placeholder with "Join the Board" CTA using the existing Facebook graphic style
- [ ] **Social media feed / latest photos** — pull recent Facebook posts or Instagram; defer until static baseline ships
- [ ] **Online payment for golf registration** — Google Form collects intent but no actual payment; consider Stripe or Square integration
- [ ] **News / announcements section** — no mechanism to post updates; static phase workaround is a dated "Latest" text block
- [ ] **Membership sign-up** — no general booster membership form or dues flow

---

## DONE

- [x] **Graduate to plain static HTML** (2026-06-18, pre-loop) — removed `<x-dc>` / `support.js` / `image-slot.js` / Babel / React; reimplemented the hero spotlight cross-fade as ~8 lines of vanilla JS that degrade gracefully to the golf slide with JS off. Verified rendering in-browser with zero console errors.
- [x] **Add `<title>` + meta description + lang + image alt** (2026-06-18, pre-loop) — page previously had no title (was invisible to search/social). Added a descriptive title, meta description, `<html lang="en">`, and alt text on the footer logo.
- [x] **Fix Facebook footer link** (2026-06-18) — updated footer `<a>` to `https://www.facebook.com/centaurusboosters/` with `target="_blank" rel="noopener"`.
- [x] **Add CJ Riggins email to sponsorship contact** (2026-06-18) — added `cj@centaurusboosters.org` to the sponsor section contact line and both sponsorship emails as mailto links in the footer CONTACT block.
- [x] **Add vision statement section** (2026-06-18) — added "About Us" block between hero and stat band using verbatim text from centaurusboosters.org.
- [x] **Add programs/sports callout** (2026-06-18) — added "Programs We Support" pill-grid section after the stat band, naming all 14 programs + "more".
- [x] **Fix merch store link** (2026-06-18) — replaced dead `href="#"` "Visit store →" with a "COMING SOON" badge; no real store URL available.
- [x] **Add "on 8 of 18 holes" to Skills Challenge** (2026-06-18) — appended "on 8 of the 18 holes" to the Skills Challenge line in the Event-Day Add-Ons card.
- [x] **Add 2 missing silent-auction items** (2026-06-18) — added "interior design services" and "dog lover treats" to the Silent Auction card, completing the Google Sites item list.
- [x] **Mobile navigation** (2026-06-18) — added hamburger button + full-width dropdown for screens < 768px using CSS media queries and a small vanilla JS toggle; desktop nav unchanged.
- [x] **Add scroll-to-top behavior / sticky CTA** (2026-06-18) — added fixed "DONATE ↓" FAB on mobile only, appears after 600px scroll via passive scroll listener; hidden on desktop.
- [x] **Hero photo** (`#hero-photo`) (2026-06-18) — replaced placeholder with `course-2.jpg` (male golfer teeing off with Colorado mountain backdrop at Indian Peaks).

---

## Content Reference

**Vision statement (verbatim from centaurusboosters.org):**
> The Centaurus Booster Club is devoted to enriching the experience of students engaged in Centaurus Programs. Our vision is to cultivate a positive and supportive environment, promoting teamwork, sportsmanship, and personal growth.

**Contacts:**
- Players / Golf: Kelly Marcus — kelly@centaurusboosters.org
- Sponsorship: CJ Riggins — cj@centaurusboosters.org / Steve Seeger — steve@centaurusboosters.org

**Golf tournament facts:**
- 2nd Annual · Sunday, September 14, 2025 · 9am Shotgun Start
- Indian Peaks Golf Course · 2300 Indian Peaks Trail, Lafayette, CO 80026 · Hale Irwin Signature Design
- $160/player or $580/foursome · Range balls, golf cart, tourney gift included
- Skills Challenge vs. CHS golfer on 8 of 18 holes
- Silent auction: massages, interior design, themed baskets, tutoring, CU Football tickets, Avs tickets, dog lover treats
- Hole Sponsor tier: $500 (banner + logo on tournament day)

**Known sponsors (from centaurusboosters.org — levels TBD):**
Westbound Realty, Auguste Escoffier School of Culinary Arts, Kong Ice, Alpine Valley Oral Surgery, Rudrocks, Boulder Wealth Advisors, rockhop.ai, PPS, LFO (Lafayette Family Orthodontics)
