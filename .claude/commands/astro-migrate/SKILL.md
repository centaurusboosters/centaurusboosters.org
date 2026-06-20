Read `astro-migration-plan.md` in full.

Act as the main coordinator for an incremental migration loop.

Your job is NOT to implement the entire plan in one run. Your job is to advance exactly one step from the Status table, verify it, update its status marker, and stop.

For this iteration:

1. Read the Status table to find the first step that is not `[x]` and not `[BLOCKED]`. Read the corresponding implementation section for that step in full. State which step you are implementing and its acceptance criteria.

2. Before doing any work, check: does this step depend on anything external (Netlify account, GitHub OAuth, npm registry access, a running Decap CMS)? If yes, produce only the artifacts you can (config files, docs with exact manual steps), mark the step `[BLOCKED: reason]`, and STOP.

3. If the step is straightforward file work (config, JSON, CSS, MDX), do it directly as the coordinator without spawning subagents.

4. If the step is context-heavy (splitting the monolithic Nunjucks template into many components, wiring MDX content collections, Decap preview integration), spawn exactly one implementor subagent with:
   - The specific files to create or modify
   - The acceptance criteria for this step only
   - A constraint to not touch files outside this step's scope

5. After implementation, spawn a reviewer subagent only when the step warrants it:
   - Visual/UX reviewer if the step changes rendered HTML or CSS (steps 2, 6)
   - Security reviewer if the step touches Decap config, auth, or external URLs (step 7)
   - Validation reviewer if the step touches build scripts or CI (steps 1, 8, 9)
   Reviewers must not edit files. They return concise severity-ranked findings.

6. If reviewer findings require changes, make a minimal targeted fix, then re-verify.

7. Run the relevant acceptance checks for the step. A step is only done when its criteria are VERIFIED, not merely attempted:
   - Steps 1–4: `npm run build` completes, `dist/index.html` exists
   - Step 5: SponsorStrip renders correct logos when passed test data
   - Step 6: `npm run build` and visual parity with current Eleventy output in browser
   - Step 7: Decap `/admin/` loads, sponsors collection shows correct path
   - Step 9: ALL checklist items in the verification section are checked off
   - Step 10: Narrative notes written for each persona

8. Update the Status table in `astro-migration-plan.md`:
   - `[x]` when verified complete
   - `[BLOCKED: reason]` when blocked on an external dependency
   - Leave `[ ]` for future steps

9. Do NOT commit on the first two steps — stage changes and stop for human review. After the human signals confidence in your slicing, you may commit completed verified steps. Never commit `.env` or secrets.

10. Stop and report:
    - What changed (files created or modified)
    - What was verified and how
    - What is blocked and on what dependency
    - The recommended next step

Hard rules:
- Do not implement a later step before the current step is verified.
- Do not modify files outside the current step's scope.
- Do not auto-merge or push to main.
- Do not fabricate verification — if you cannot run `npm run build`, say so.
- Preserve the existing visual design exactly. No new features, no redesign.
- The separation of concerns from the Architecture section is a hard constraint: presentation components have no data imports, section components have no inline styles, React components only where Decap preview reuse is required.
