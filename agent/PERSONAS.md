# Reviewer Personas — Centaurus Warriors Booster Club Website

These personas are the **advisory quality gate** for website changes. They help reviewers judge whether a change serves the people who rely on the site, beyond whether the code builds or the links work.

Use only the personas relevant to a change. The review is advisory and should be summarized in the issue or PR. If a request clearly fails the relevant reviewer role's acceptance lens, route it back for clarification instead of inventing missing content.

These are reviewer roles, not fixed individuals. Avoid tying feedback to named volunteers unless the change is specifically about a public contact listing.

---

## 1. Club President — Mission and Trust
*"Does this represent the booster club's mission and make us look credible?"*

- **Review focus:** Club mission, fundraising clarity, community trust, accurate public-facing claims, recognition of all Centaurus athletics, board/volunteer credibility.
- **Looks for:** Clear explanation of how donations help students, respectful sponsor recognition, accurate nonprofit language, balanced focus across programs and events.
- **Flags when:** The site over-focuses on one fundraiser, makes unsupported claims, buries the club purpose, or weakens trust with vague/outdated copy.
- **Reviewer check:** A community member can understand what the club does, why it matters, and how to support it.

---

## 2. First-Time Parent — Orientation
*"My student joined a team. What is this club and what should I do next?"*

- **Review focus:** Plain-language orientation, supported programs, parent involvement paths, contact clarity, low-friction next steps.
- **Looks for:** Obvious ways to donate, volunteer, sponsor, register, ask questions, and understand what booster funds support.
- **Flags when:** The page assumes prior knowledge, hides contact paths, uses insider terms, or makes involvement feel limited to one event.
- **Reviewer check:** Within 30 seconds, a new parent understands the club funds Centaurus athletics and knows the next useful action.

---

## 3. Prospective Sponsor — Fundraising Value
*"If my business writes a check, is the value and community impact clear?"*

- **Review focus:** Sponsorship value, social proof, audience reach, tier clarity, professional presentation, sponsor recognition.
- **Looks for:** Clear benefits, pricing or inquiry path, current sponsor logos, nonprofit/trust signals, and copy that respects sponsor motivations.
- **Flags when:** Sponsorship asks are vague, sponsor logos look broken or stale, benefits are hard to compare, or the path to inquire is unclear.
- **Reviewer check:** A local business can understand why sponsorship is worthwhile and what to do next.

---

## 4. Event Participant — Registration Confidence
*"Tell me what I need to know and let me register without friction."*

- **Review focus:** Event date, time, location, pricing, inclusions, deadlines, add-ons, form/payment flow, day-of expectations.
- **Looks for:** Specific event details, prominent CTAs, consistent pricing, clear form labels, and contact options for questions.
- **Flags when:** Key event details are ambiguous, CTA labels are inconsistent, forms feel disconnected from the copy, or mobile registration is awkward.
- **Reviewer check:** A visitor can confidently answer "what am I signing up for, what does it cost, and how do I register?"

---

## 5. Content Editor — Maintainability
*"Can a nontechnical admin safely make the expected update?"*

- **Review focus:** Decap editor experience, field labels, preview usefulness, content structure, media replacement, safe defaults.
- **Looks for:** Clear field names, sensible grouping, helpful previews, editable content stored in predictable data files, and no need to touch layout code for routine updates.
- **Flags when:** Editors must understand HTML/CSS/MDX syntax for routine updates, duplicate fields drift, previews mislead, or media paths are easy to break.
- **Reviewer check:** A content admin can make the requested update, preview the result well enough to catch obvious mistakes, and submit it for review.

---

## 6. UX and Mobile Reviewer
*"Is this usable and readable on the devices families actually use?"*

- **Review focus:** Mobile usability, navigation, CTA clarity, readable type, form ergonomics, reduced friction. (Accessibility has its own reviewer: persona 12.)
- **Looks for:** Working mobile layout, tappable controls, no overlapping text, and key actions visible without hunting.
- **Flags when:** A change works only on desktop, adds tiny/tightly packed controls, hides key actions, or makes forms harder to complete.
- **Reviewer check:** The critical path works on mobile without new friction.

---

## 7. SEO and Discoverability Reviewer
*"Can people and search engines understand what this page is about?"*

- **Review focus:** Search snippets, page titles/descriptions, semantic headings, local relevance, event discoverability, share previews.
- **Looks for:** Accurate metadata, descriptive headings, crawlable text instead of image-only content, local keywords used naturally, and stable URLs/anchors.
- **Flags when:** Important content is hidden in images, headings are decorative rather than meaningful, metadata is stale, or event/sponsor/donation pages are hard to share.
- **Reviewer check:** A search result or shared link clearly communicates the club, location, event, and primary action.

---

## 8. Delivery Steward — Scope and Verification
*"Is this change small, reviewable, and actually verified?"*

- **Review focus:** Change scope, implementation risk, regression checks, deploy preview, PR readability, follow-up separation.
- **Looks for:** Focused diffs, build/validation results, screenshots or deploy previews when visual changes matter, and clear notes for anything not verified.
- **Flags when:** A change bundles unrelated refactors, lacks validation, changes content without reviewer context, or leaves future work hidden in the diff.
- **Reviewer check:** The PR can be reviewed independently and includes enough evidence to decide whether to merge.

---

## 9. Senior Developer — Correctness and Simplicity
*"Is this the smallest correct change, and will the next person understand it?"*

- **Review focus:** Correctness, dead code, duplicated logic, consistent patterns, server/client boundary discipline, data-flow clarity (`tina/config.ts` schema ↔ `home.json` ↔ component props).
- **Looks for:** One obvious way to do each thing, components that receive the slice of data they render, schema fields that are actually rendered, and no leftover experiments or unused files.
- **Flags when:** A change adds a second pattern for something that already has one, leaves near-duplicate components or stale config behind, introduces speculative abstraction, or fetches/derives data in the wrong layer.
- **Reviewer check:** A competent developer new to the repo can read the diff, understand why each hunk exists, and find nothing that could be deleted without loss.

---

## 10. Copy-Paste Volunteer — Code Approachability
*"Could a semi-technical volunteer duplicate a section, tweak the words, and get a working result?"*

- **Review focus:** How closely the code resembles a fill-in-the-blanks template: named CSS classes over inline styles, tokens over magic values, one file per section, and no hidden coupling between a component and distant code.
- **Looks for:** Section components that read as semantic markup (`section`, `kicker`, `section-title`, `btn`), styles resolved by class name in `components.css`, colors only via `--color-*` tokens, and an up-to-date `docs/EDITING.md` walkthrough.
- **Flags when:** A change reintroduces `style={{...}}` for static values, types a raw hex color, requires editing more than one file to change one section's text, or breaks the copy-a-section recipe in `docs/EDITING.md`.
- **Reviewer check:** A volunteer can copy an existing section component, change the text and classes, register it in `HomePage.jsx`, and get a correct desktop **and** mobile result without understanding React state or CSS internals.

---

## 11. Designer / Brand Steward — Token Discipline
*"Does this stay on brand without inventing new visual language?"*

- **Review focus:** Consistent use of the design tokens in `global.css` and the class vocabulary in `components.css`; typography scale; spacing rhythm; the navy/red/white brand palette.
- **Looks for:** New UI built from existing primitives, any genuinely new color/size added as a named token first, and headings that use the established display face and clamp() scale.
- **Flags when:** A diff introduces a hex value outside `global.css`, a one-off font size or padding that bypasses the vocabulary, near-duplicate classes (`.card2`), or visual drift between sections that should match.
- **Reviewer check:** After the change, `grep`-ing components for hex colors still returns nothing, and the new UI is visually indistinguishable in style from the rest of the site.

---

## 12. Accessibility Specialist
*"Can someone using a screen reader, keyboard, or low-vision setup complete the critical paths?"*

- **Review focus:** Alt text quality, keyboard operability, visible focus states, color contrast against the navy/red palette, heading order, form and modal semantics.
- **Looks for:** Meaningful `alt` on every image (and alt fields filled when images are swapped in the CMS), the form modal operable and dismissible by keyboard with correct `role`/`aria` attributes, interactive elements rendered as buttons/links (not clickable divs), and text meeting contrast guidelines on dark backgrounds.
- **Flags when:** An image ships with empty or filename-ish alt text, a control can't be reached or activated by keyboard, focus is invisible or trapped, headings skip levels for visual effect, or dim-on-dark text drops below readable contrast.
- **Reviewer check:** Register, donate, and sponsor-inquiry flows can each be completed keyboard-only, and a screen reader announces every image and control meaningfully.
