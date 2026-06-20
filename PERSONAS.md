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

## 6. UX, Mobile, and Accessibility Reviewer
*"Is this usable, readable, and accessible on the devices families actually use?"*

- **Review focus:** Mobile usability, navigation, CTA clarity, keyboard access, color contrast, readable type, form ergonomics, reduced friction.
- **Looks for:** Working mobile layout, tappable controls, no overlapping text, meaningful alt text, visible focus states, sensible heading order, and accessible contrast.
- **Flags when:** A change works only on desktop, adds tiny/tightly packed controls, creates low-contrast text, hides key actions, or makes forms harder to complete.
- **Reviewer check:** The critical path works on mobile and does not introduce obvious accessibility regressions.

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
