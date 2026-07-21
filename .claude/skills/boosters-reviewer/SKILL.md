---
name: boosters-reviewer
description: This skill should be used when reviewing, auditing, or providing recommendations on the Centaurus Boosters codebase. Use it when asked to review code quality, identify improvements, check architectural consistency, or assess the health of any part of this Next.js + TinaCMS site.
---

# Boosters Reviewer

## Overview

Review the Centaurus Boosters site from two angles: technical code quality and persona-based user impact. Produce a prioritized list of findings with concrete recommendations.

## What to Read First

Before forming opinions, read:

- `CLAUDE.md` — project architecture summary
- `agent/PERSONAS.md` — the twelve reviewer personas (load in full; they define the review lens)
- `docs/EDITING.md` — the editing contract the code must keep honoring
- `src/app/page.jsx` — server entry point and data fetch
- `src/lib/tina-content.js` — TinaCloud client wrapper
- `tina/config.ts` — CMS schema (source of truth for editable fields)
- `src/data/home.json` — live content values
- `src/components/next-sections/HomePage.jsx` — client root and tournament toggle logic
- `src/components/tina/editable.js` — `useTina` / `makeSafeTina` / `EditableRichText` utilities
- Any specific section components relevant to the user's focus area

## Persona-Based Review

Apply the personas from `agent/PERSONAS.md` as an advisory quality gate. For each persona, ask whether the current code and content would pass their acceptance lens, then flag any failures.

Unless the user asks to focus on specific personas, run all twelve:

1. **Club President** — Does the site clearly represent the mission and build community trust?
2. **First-Time Parent** — Can a new parent understand the club and find the next step within 30 seconds?
3. **Prospective Sponsor** — Is the sponsorship value and inquiry path clear and professional?
4. **Event Participant** — Can someone answer "what am I signing up for, what does it cost, how do I register?"
5. **Content Editor** — Can a nontechnical admin make expected updates without touching layout code?
6. **UX / Mobile** — Does the critical path work on mobile without new friction?
7. **SEO and Discoverability** — Can people and search engines understand the page and find key actions?
8. **Delivery Steward** — Is the current state of the codebase small, reviewable, and verified?
9. **Senior Developer** — Is this the smallest correct change, with no dead code or duplicate patterns?
10. **Copy-Paste Volunteer** — Could a semi-technical volunteer duplicate a section and tweak it successfully?
11. **Designer / Brand Steward** — Does everything stay on the tokens and class vocabulary (no new magic values)?
12. **Accessibility Specialist** — Are the register/donate/sponsor flows operable by keyboard and screen reader?

Personas 1–8 review the site as users experience it; personas 9–12 review the code itself and apply to any code change. Persona 10's reviewer check is the acceptance gate for changes touching `src/components/next-sections/` or `src/styles/` — a change that reintroduces static inline styles or raw hex values in components fails review.

For each persona finding, note which persona it comes from and whether the site passes or fails their reviewer check.

## Technical Code Checks

Run these in parallel with the persona review.

**Server/client split**
- `src/app/page.jsx` should be a server component with no `'use client'` directive
- Data fetching (`getTinaDocument`) belongs only in server components or `lib/`
- Client components receive plain serializable data as props; they do not fetch

**TinaCMS data flow**
- `useTina(tina ?? makeSafeTina('page', staticData))` is the correct pattern for live-editing support with a static fallback
- If a component uses `useTina` but does not accept a `tina` prop from the server, it cannot get live CMS updates — flag this
- `makeSafeTina` wraps the raw static JSON (from `src/data/home.json`) into the `{ data: { page: ... } }` shape

**Schema vs. component coverage**
- Every field in `tina/config.ts` should appear somewhere in the rendered page
- Every piece of hard-coded content an editor would reasonably want to change should have a corresponding schema field — flag gaps

**Tournament toggle**
- `showTournament` is derived once in `HomePage.jsx` and passed down — not re-derived in each child
- All tournament-specific sections (`GolfEventClient`, `CourseClient`, `RegisterClient`) are wrapped with `{showTournament && <Component />}`
- Footer and stat band both receive and respect `showTournament`
- No tournament content leaks through when `enabled` is `false`

**Component quality**
- Section components in `next-sections/` receive a typed slice of `page` as props, not the whole object
- `ui/` components accept plain data props with no TinaCMS imports
- `tinaField()` annotations belong only in section components or `EditableRichText`, not `ui/` components
- CSS class names in `components.css` are scoped; look for orphaned or duplicated selectors

**Content editing**
- Rich-text fields use `EditableRichText` so editors see inline editing handles in the CMS
- Multi-sentence string fields use `ui: { component: 'textarea' }` in the schema
- Required/optional field markers reflect actual rendering behavior

## Output Format

Structure findings in two sections:

### Persona Findings
One subsection per persona. State the reviewer check, whether it passes or fails, and any specific findings with file/line references and concrete recommendations. Skip personas with no findings rather than writing "no issues."

### Technical Findings
Organized by severity:

**High** — architectural violations or data loss risk (content cannot be edited, toggle leaks)
**Medium** — component boundary violations, missing CMS annotations, hard-coded content that should be editable
**Low** — CSS organization, naming, minor prop design improvements

For each finding: file and line reference, what the problem is, concrete recommendation.

Close with a short summary of what is working well across both dimensions.
