# Reviewer Personas — Centaurus Warriors Booster Club Website

These personas are the **advisory quality gate** in the agentic publishing pipeline. When the `/githubtrigger` skill implements an administrator's change request (see `booster-club-agentic-publishing-plan.md` §10, "Persona review gate"), the persona(s) matching the request's `type:` label provide the qualitative review of the rendered result before the PR opens — the "does this actually serve the reader" layer that deterministic checks can't cover.

The gate is **advisory**: its assessment is written into the PR/issue comment for the human reviewer; it does not auto-block the PR. The only exception is a clearly-unmet definition of done, which should route the request to `Needs Clarification` rather than ship ("ask, don't invent").

The **Product Owner** persona (#7) is about backlog prioritization and has no role in the runtime pipeline; it is retained only as a record of the principles that shaped the original website build. (The former `BACKLOG.md` website-improvement loop is complete; the GitHub Project board is the backlog going forward.)

---

## 1. Kelly Marcus — Booster Club Chair (Client Voice)
*"Does this site represent everything we do, not just golf?"*

- **What she cares about:** Vision statement visible, all programs acknowledged, accurate contact info, real sponsor logos (the people who wrote checks deserve recognition), board credibility, feels like the warm community she knows
- **Pain points on current site:** Vision statement missing entirely, sponsor logos all placeholders, CJ Riggins' email missing from sponsorship contact, Facebook link is dead (`href="#"`)
- **Definition of done:** She could send this URL to a community member today and not feel embarrassed

---

## 2. First-Time Parent
*"My kid just made the soccer team — what is this club and how do I join?"*

- **What they care about:** Is my sport covered by the booster club? What does the club actually fund? How do I get involved beyond golf? Is there a calendar of events? Who do I contact?
- **Pain points on current site:** No mention of which 20+ programs are supported, no "About" section explaining what boosters do, no general membership or volunteer path, merch store link is dead
- **Definition of done:** Within 30 seconds of landing they understand the club funds all Centaurus athletics and know how to get involved

---

## 3. Local Business Owner / Prospective Sponsor
*"I'm writing a check — convince me this is worth it."*

- **What they care about:** Clear sponsorship tiers with pricing, exactly what they get for their money, who else has already sponsored (social proof), 501(c)(3) status confirmation, professional appearance that reflects well on their brand
- **Pain points on current site:** Sponsorship section has perks listed but no pricing tier table, no current sponsor logos shown (placeholders), 501(c)(3) is only mentioned in small footer text
- **Definition of done:** They can see the tier options and pricing without filling out a form, and see existing sponsor logos as credibility

---

## 4. Golf Tournament Registrant
*"I clicked the email link — just tell me what I need and let me register fast."*

- **What they care about:** Date/time/location visible immediately, price clear up front, what's included in the entry, can I pay online, is there a deadline, what are the add-ons
- **Pain points on current site:** Good structure overall, but silent auction item list is vague ("themed baskets"), Skills Challenge detail ("on 8 of 18 holes") missing, no deadline/registration cutoff date shown
- **Definition of done:** All event-day details are specific enough to answer "what am I signing up for"

---

## 5. Social Media Manager (Booster Club Volunteer)
*"I post updates on Facebook — does the website reflect what we're putting out there?"*

- **What they care about:** Facebook link actually works, photos on the site match the energy of what's posted socially, site feels current and not stale, easy way to point people from Facebook to the site for registration
- **Pain points on current site:** Facebook footer link is `href="#"` (dead), all photo slots are placeholders (site looks unfinished), no visual energy matching the FB page's photos of golfers and athletes
- **Definition of done:** The Facebook link works, at least the hero and golf sections have real photos

---

## 6. UX / Conversion Critic
*"Every extra click is a lost donor."*

- **What they care about:** Mobile navigation (currently no hamburger menu — nav breaks on small screens), page weight (3 Google Form iframes), registration CTA prominence, real payment flow vs. Google Form for $580 foursomes, color contrast/accessibility, no sticky donate/register CTA while scrolling
- **Pain points on current site:** Nav completely unusable on mobile, three slow-loading Google Form iframes, merch link dead, no skip-to-content for accessibility
- **Definition of done:** Site is usable on a phone, critical forms load, and a new visitor can register or donate without confusion

---

## 7. Product Owner / Project Manager
*"What ships today, what waits, and in what order?"*

- **Synthesizes feedback from all other personas** and translates it into a prioritized, shippable backlog
- **Principles:**
  - Site must be potentially shippable after every loop iteration (no half-finished sections)
  - Text/content fixes before image fixes (never blocked on assets)
  - High-trust signals (real logos, correct contacts, 501c3) before polish
  - Static improvements before dynamic features (no CMS, no live social feed until static baseline is solid)
  - Fix dead links before adding new sections
- **Owns:** BACKLOG.md — reads all persona feedback, decides which item delivers the most value with least risk, marks it done after each loop
