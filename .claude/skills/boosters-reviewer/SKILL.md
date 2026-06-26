---
name: boosters-reviewer
description: This skill should be used when reviewing, auditing, or providing recommendations on the Centaurus Boosters codebase. Use it when asked to review code quality, identify improvements, check architectural consistency, or assess the health of any part of this Next.js + TinaCMS site.
---

# Boosters Reviewer

## Overview

Review the Centaurus Boosters site for code quality, architectural consistency, and content-editing ergonomics. Produce a prioritized list of findings with concrete recommendations.

## Review Scope

Unless the user specifies otherwise, cover all four areas:

1. **Architecture** — server/client split, data flow, TinaCMS integration
2. **Content editing** — CMS schema completeness, fallback behavior, field coverage
3. **UI/component quality** — component boundaries, prop design, CSS organization
4. **Tournament toggle** — consistent gating of off-season content

## What to Read

Start by reading these files to understand current state before forming opinions:

- `CLAUDE.md` — project architecture summary
- `src/app/page.jsx` — server entry point and data fetch
- `src/lib/tina-content.js` — TinaCloud client wrapper
- `tina/config.ts` — CMS schema (source of truth for editable fields)
- `src/data/home.json` — live content values
- `src/components/next-sections/HomePage.jsx` — client root and tournament toggle logic
- `src/components/tina/editable.js` — `useTina` / `makeSafeTina` / `EditableRichText` utilities
- Any specific section components relevant to the user's focus area

## Architecture Checks

**Server/client split**
- `src/app/page.jsx` should be a server component with no `'use client'` directive
- Data fetching (`getTinaDocument`) belongs only in server components or `lib/`
- Client components receive plain serializable data as props; they do not fetch

**TinaCMS data flow**
- `useTina(tina ?? makeSafeTina('page', staticData))` is the correct pattern for live-editing support with a static fallback
- If a component uses `useTina` but does not accept a `tina` prop from the server, it cannot get live CMS updates — flag this
- `makeSafeTina` must wrap the raw static JSON (from `src/data/home.json`) with the `{ data: { page: ... } }` shape

**Schema vs. component coverage**
- Every field in `tina/config.ts` should appear somewhere in the rendered page
- Every piece of hard-coded content that an editor would reasonably want to change should have a corresponding field in the schema — flag gaps

## Tournament Toggle Checks

`page.tournament.enabled` controls off-season mode. Verify:

- `showTournament` is derived once in `HomePage.jsx` and passed down — not re-derived in each child
- All tournament-specific sections (`GolfEventClient`, `CourseClient`, `RegisterClient`) are wrapped with `{showTournament && <Component />}`
- Footer and stat band both receive and respect `showTournament`
- No tournament content leaks through when `enabled` is `false`

## Component Quality Checks

- Section components in `next-sections/` should each receive a typed slice of `page` as props, not the entire `page` object
- `ui/` components should accept plain data props with no TinaCMS imports or awareness
- `tinaField()` annotations belong only in section components or `EditableRichText`, not in `ui/` components
- CSS class names in `components.css` should be scoped to the component that owns them — look for orphaned or duplicated selectors

## Content Editing Checks

- All rich-text fields should use `EditableRichText` so editors see inline editing handles in the CMS
- String fields that span multiple sentences should use `ui: { component: 'textarea' }` in the schema
- Required fields that are truly optional in rendering should be marked as not required in the schema (and vice versa)

## Output Format

Organize findings by severity:

**High** — architectural violations or data loss risk (missing field means content cannot be edited, toggle leaks content)
**Medium** — component boundary violations, missing CMS annotations, hard-coded content that should be editable
**Low** — CSS organization, naming, minor prop design improvements

For each finding:
- File and line reference
- What the problem is
- Concrete recommendation (what to change and how)

End with a short summary of what is working well.
