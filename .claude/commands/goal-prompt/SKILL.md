Read `booster-club-agentic-publishing-plan.md` in full, including Section 0 (Prerequisites & Setup Gates).

Act as the main coordinator for an incremental implementation loop.

Your job is not to implement the entire plan in one run. Your job is to advance exactly one coherent task slice from the next incomplete milestone, update the plan's status markers, and stop.

For this iteration:

1. Inspect the repository and read the Section 15 status markers to determine real state. Trust the markers, then sanity-check them against the repo.
2. Identify the first slice that is not `[x]` and not `[BLOCKED]`. State the selected slice and its acceptance criteria.
3. BEFORE doing work, check Section 0: does this slice depend on an unsatisfied setup gate (Netlify account, Google Form, Apps Script deploy, webhook registration, tunnel, automation identity, any secret)?
   - If yes: produce only the artifacts you can (config, code, exact click-by-click setup steps written to the relevant README or docs/operations.md), set the milestone to `[BLOCKED: Pn — reason]`, and STOP. Do not attempt the gated action via browser automation or your own credentials. Do not fabricate verification.
4. If the slice is small/static (e.g. writing netlify.toml, a validation script, a workflow, docs), do it directly as the coordinator — do NOT spawn a subagent. Reserve subagents for context-heavy slices (the webhook runner, queue/idempotency, GitHub API integration).
5. When a slice IS context-heavy, spawn exactly one implementor subagent with a narrow assignment, explicit constraints, and the relevant acceptance criteria. Require it to report: files changed, commands run, test results, risks, unresolved questions.
6. After implementation, spawn read-only reviewer subagents only if the slice warrants it:
   - security reviewer for auth, webhook, token, permission, or deployment changes;
   - validation reviewer for tests, CI, parsing, and site checks;
   - docs reviewer for setup, operations, or handoff docs;
   - GitHub/API researcher only when API behavior is genuinely uncertain.
   Reviewers must not edit files; they return concise severity-ranked findings and suggested fixes.
7. If reviewer findings require changes, send one focused revision request to the implementor or make a minimal coordinator edit.
8. Run the relevant acceptance checks. A slice is only "done" when its acceptance criteria are VERIFIED, not merely attempted. If verification needs a prerequisite you cannot satisfy, mark it `[BLOCKED]`, not done.
9. Update Section 15 status markers and record decisions and test evidence in the plan.
10. Do NOT commit on the first few slices — stage changes and stop for human review. Once the human signals trust in your slicing, you may commit completed, verified slices. Never commit secrets.
11. Stop and report: what changed, what was verified, what is blocked (and on which prerequisite), and the recommended next slice.

Hard rules: Do not run multiple implementor subagents in parallel. Do not allow overlapping edits. Do not implement later milestones early. Do not perform Section 0 setup gates yourself. Do not auto-merge or deploy production changes. Reference secrets by env-var name only.
