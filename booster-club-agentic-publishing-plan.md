# Booster Club Agentic Website Publishing Workflow

**Status:** Implementation plan  
**Primary goal:** Allow nontechnical booster-club administrators to request small website changes through a Google Form, have an AI coding agent implement the request, publish a reviewable Netlify preview, and require human approval before production deployment.

---

## 1. Executive Summary

Build a human-in-the-loop publishing workflow for a small static website:

```text
Google Form
    ↓
Google Apps Script
    ↓
GitHub Issue + Project status
    ↓
Trusted webhook event
    ↓
Local AI agent on minipc
    ↓
Branch + code change + validation + pull request
    ↓
Netlify Deploy Preview
    ↓
Human review
    ↓
Merge to main
    ↓
Production deployment
```

The first version should run on the existing minipc and invoke Claude Code with a project skill such as:

```bash
claude -p "/githubtrigger issue 42"
```

The POC should optimize for a working end-to-end loop, low cost, safety, and observability—not maximum autonomy. After the workflow is proven, migrate the runner to a managed cloud runtime such as Amazon Bedrock AgentCore.

---

## 2. Key Decisions

1. **Use Google Forms as the administrator-facing interface.**
   Administrators should not need GitHub, Linear, a CMS, or command-line knowledge.

2. **Use GitHub Issues as the durable work queue and audit trail.**
   Each form submission becomes one issue.

3. **Keep the repository public during the POC unless sensitive information is introduced.**
   Public visibility supports portfolio use and GitHub Pages during early development.

4. **Do not trust every public issue.**
   An issue is agent-eligible only when:
   - it belongs to the configured repository;
   - its original creator is an allowlisted account or GitHub App;
   - it has the `source:google-form` label; and
   - it has the `agent:eligible` label.

5. **Use GitHub Project Status for workflow state.**
   Labels describe source and request type; the single-select Project Status field represents state.

6. **Use Netlify Deploy Previews for review.**
   Every agent-created pull request should receive a unique preview URL.

7. **Never auto-merge in the initial system.**
   A human must review the preview and merge the pull request.

8. **Start with a Claude Code slash skill on the minipc.**
   Do not add MCP or a generalized JSON agent protocol unless a real need appears.

9. **Design the worker so the runtime can later be replaced.**
   Webhook validation, job state, GitHub operations, and agent invocation should be separate modules.

---

## 3. Scope

### In scope

- A Google Form for website change requests.
- Apps Script that creates a structured GitHub issue.
- GitHub labels and a Project board.
- A secure webhook receiver on the minipc.
- A queue with one agent job running at a time.
- A Claude Code skill named `/githubtrigger`.
- Agent-created branches, commits, and pull requests.
- Automated HTML/site validation.
- Netlify Deploy Previews.
- Human review and merge.
- Logs, retries, failure status, and duplicate-delivery protection.
- Documentation suitable for a portfolio and future handoff.
- A later migration path to Bedrock AgentCore.

### Out of scope for the first release

- Automatic merging.
- Direct production edits.
- A full CMS.
- Free-form access to the minipc.
- Multiple repositories.
- Concurrent agent jobs.
- Agent access to school systems or sensitive student data.
- Autonomous image generation or publication.
- Long-term conversational memory.
- A custom MCP server.
- Fully automated administrator email approval.

---

## 4. User Experience

### Administrator

1. Open the Google Form.
2. Choose a request type.
3. Describe the desired change and provide exact text, dates, links, and relevant context.
4. Submit the form.
5. Receive confirmation that the request was accepted.
6. Receive or be sent a preview URL when implementation is ready.
7. Review the preview.
8. Tell the site maintainer whether to publish or revise.

### Site maintainer

1. See the request appear on the GitHub Project board.
2. Observe the agent moving it through workflow states.
3. Review the pull request and Netlify preview.
4. Request changes or merge.
5. Diagnose failures using logs and issue comments.

---

## 5. Intake Form

Create a Google Form with these fields:

| Field | Required | Notes |
|---|---:|---|
| Requester name | Yes | Used in issue metadata |
| Requester email | Yes | Do not expose publicly in the issue body if the repo is public |
| Change type | Yes | Text, event, link, sponsor, image, correction, other |
| Page or section | Yes | Example: Golf Tournament hero section |
| Requested change | Yes | Plain-language description |
| Exact replacement text | No | Strongly encouraged for factual content |
| Effective or event date | No | Use a real date field when possible |
| Destination URL | No | Registration, donation, sponsor, or external link |
| Asset link | No | Prefer an approved Google Drive link; avoid file upload initially |
| Additional notes | No | Context and constraints |
| Urgency | Yes | Normal or time-sensitive |

### Form-design rules

- Prefer structured choices over unbounded free text.
- Ask for exact spelling of names, dates, prices, and URLs.
- State that requests will be implemented by AI and reviewed before publication.
- Do not collect student records, medical information, payment-card data, or other sensitive information.
- Keep requester email in the linked response sheet or issue metadata store, not in a public issue.

---

## 6. Google Apps Script: Form to GitHub Issue

Use an installable Google Forms submission trigger.

### Responsibilities

1. Read and validate the submitted response.
2. Generate a structured issue title and Markdown body.
3. Create the issue through the GitHub API.
4. Apply:
   - `source:google-form`
   - `agent:eligible`
   - one request-type label such as `type:content`
5. Add the issue to the GitHub Project.
6. Set Project Status to `New`.
7. Record the resulting issue number and URL in the response sheet.
8. Log failures without losing the original form response.

### Recommended issue title

```text
[Website Change] Update golf tournament registration date
```

### Recommended issue body

```markdown
## Requested change

<plain-language request>

## Location

- Page: Home
- Section: Golf Tournament

## Exact content

- Replacement text: ...
- Effective/event date: ...
- Destination URL: ...

## Request metadata

- Request type: Event update
- Submitted by: <name>
- Submission ID: <non-secret unique ID>
- Submitted at: <timestamp>

## Agent constraints

- Preserve the current visual design unless the request requires a design change.
- Change only what is necessary.
- Do not merge the resulting pull request.
```

### Credentials

For the POC, store a fine-grained GitHub token in Apps Script Properties—not in source code or the response sheet.

Prefer one of these identities:

1. **POC:** the maintainer's GitHub account with access limited to this repository and issue creation;
2. **Better:** a dedicated automation account;
3. **Production:** a GitHub App with narrowly scoped permissions.

The webhook worker must allowlist the actual account or App identity that creates form issues.

---

## 7. GitHub Configuration

### Labels

Use labels for immutable or multi-valued metadata:

```text
source:google-form
agent:eligible
agent:generated
type:content
type:event
type:link
type:sponsor
type:image
type:correction
priority:time-sensitive
needs:human-input
```

Do not use labels as the primary workflow state.

### GitHub Project Status

Create a single-select `Status` field with:

```text
New
Queued
Implementing
Needs Clarification
Awaiting Review
Revision Requested
Failed
Complete
```

Suggested board columns:

```text
New | Queued | Implementing | Needs Clarification | Awaiting Review | Revision Requested | Failed | Complete
```

### Repository settings

- Protect `main`.
- Require pull requests before merging.
- Prevent force pushes to `main`.
- Require the site-validation check.
- Disable automatic merging initially.
- Store no school credentials or requester email addresses in the repository.
- Enable Netlify access to the repository.
- Keep GitHub Pages only as a temporary preview if needed; Netlify becomes the PR-preview and eventual production host.

---

## 8. Agent Eligibility and Security Boundary

A public issue must not be sufficient to trigger code execution.

The worker must fetch the current issue through the GitHub API and verify all of the following:

```text
repository == configured repository
issue state == open
issue creator ∈ TRUSTED_ISSUE_CREATORS
labels include source:google-form
labels include agent:eligible
issue is not already linked to an open or merged agent PR
```

Webhook-level checks:

- Validate `X-Hub-Signature-256` using the configured webhook secret.
- Allow only the expected repository.
- Accept only the `issues` event.
- Initially accept only `opened`, `labeled`, and `reopened` actions.
- Store `X-GitHub-Delivery` and reject duplicate deliveries.
- Return a successful HTTP response quickly, then process asynchronously.
- Never interpolate untrusted issue text into a shell command.
- Pass only the validated issue number to the agent command.
- Run the worker as a dedicated unprivileged operating-system user.
- Give the worker access only to the website repository and required credentials.
- Never expose the Claude session, shell, or arbitrary command endpoint to the public internet.

The trusted creator check is stronger than a label check because public users cannot spoof the original issue creator. Requiring both provides defense in depth.

---

## 9. Local POC Architecture

```text
GitHub webhook
    ↓ HTTPS tunnel
Webhook receiver on minipc
    ↓
Signature validation + eligibility check
    ↓
Durable local job queue
    ↓
Single worker
    ↓
Clean git worktree
    ↓
claude -p "/githubtrigger issue <number>"
    ↓
GitHub branch + PR
```

### Suggested implementation stack

- TypeScript and Node.js.
- Small HTTP framework such as Fastify or Express.
- SQLite for webhook deliveries, jobs, attempts, and run logs.
- GitHub REST or GraphQL client.
- Child-process wrapper for Claude Code.
- systemd user service or system service.
- HTTPS exposure through an existing secure tunnel.

### Minimum endpoints

```text
POST /webhooks/github
GET  /health
GET  /ready
```

Do not create a public endpoint that accepts an arbitrary prompt or shell command.

### Local state

Store:

```text
delivery_id
repository
issue_number
event_action
job_status
attempt_count
created_at
started_at
completed_at
agent_exit_code
branch_name
pull_request_number
error_summary
```

### Concurrency

Run one job at a time for the POC. If another eligible event arrives, queue it.

### Idempotency

Before invoking the agent:

1. Check whether the delivery ID was processed.
2. Check whether the issue already has an associated job.
3. Check whether a branch or PR already exists for the issue.
4. Resume or report existing work rather than creating duplicates.

---

## 10. Claude Code Skill

Create:

```text
.claude/skills/githubtrigger/SKILL.md
```

The skill accepts an issue number:

```bash
claude -p "/githubtrigger issue 42"
```

### Skill responsibilities

1. Confirm the current repository matches the configured website repository.
2. Fetch issue `#42` and its comments.
3. Re-check eligibility.
4. Update Project Status to `Implementing`.
5. Add an issue comment identifying the run.
6. Create or reuse branch:

```text
agent/issue-42-short-description
```

7. Read the repository instructions and existing site before editing.
8. Decide whether the request is implementable without clarification.
9. If clarification is required:
   - make no speculative content change;
   - comment with focused questions;
   - set status to `Needs Clarification`;
   - exit successfully without a PR.
10. Make the smallest appropriate change.
11. Preserve design, accessibility, responsive behavior, and existing content not named by the request.
12. Run all required validation.
13. Review its own diff.
14. Commit and push.
15. Open a pull request.
16. Include `Closes #<issue>` only if closing on merge is desired.
17. Add `agent:generated`.
18. Set Project Status to `Awaiting Review`.
19. Comment on the issue with the pull-request URL and note that the preview will appear after Netlify finishes.
20. Never merge.

### Permission boundary

The agent may:

- read issues and comments;
- edit the checked-out website repository;
- run allowlisted validation commands;
- create a branch, commit, and pull request;
- comment on its issue and PR;
- update Project Status.

The agent may not:

- merge a PR;
- push to `main`;
- modify repository secrets or workflow permissions;
- access unrelated repositories;
- run arbitrary commands copied from issue text;
- publish unreviewed factual content when requirements are ambiguous.

### Codex compatibility

Keep the core procedure in a tool-neutral document such as:

```text
agent/github-issue-workflow.md
```

The Claude skill should reference that procedure. A later Codex adapter should invoke the same procedure and acceptance criteria rather than duplicating the workflow logic.

---

## 11. Repository Validation

The site is intentionally simple, so validation should also remain simple and deterministic.

### Required checks

- HTML parses successfully.
- Internal links resolve.
- Required external URLs have valid syntax.
- No duplicate element IDs.
- Images include meaningful `alt` text.
- No accidental removal of critical sections.
- No obvious placeholder text.
- No secrets, local paths, or requester email addresses are introduced.
- The site can be served locally.
- Optional: Playwright opens the page at mobile and desktop viewport sizes.
- Optional: save screenshots as CI artifacts for visual review.

### Suggested files

```text
scripts/validate-site.sh
tests/site.spec.ts
.github/workflows/validate.yml
```

Require the validation workflow to pass before merge.

---

## 12. Netlify

Connect Netlify to the GitHub repository.

### Configuration

- Production branch: `main`
- Deploy Previews: enabled for pull requests
- Static publish directory: repository root or the actual site directory
- Build command: empty unless validation/build tooling is added
- Production deployment: triggered only by merges to `main`

A minimal `netlify.toml` may be used to make configuration explicit:

```toml
[build]
  publish = "."
```

Adjust the publish directory if the site later moves into `public/` or `dist/`.

### Review flow

1. Agent opens PR.
2. Netlify builds a Deploy Preview.
3. Netlify exposes the preview URL on the PR.
4. Maintainer sends or exposes that URL to the requesting administrator.
5. Administrator reviews the preview.
6. Maintainer merges or requests revisions.

### Later enhancement

Automate delivery of the preview URL to the requester without exposing their email in GitHub. Possible approaches:

- store submission ID → email mapping in the Google Sheet;
- send the issue/PR/preview event to an authenticated Apps Script web app;
- let Apps Script look up the requester and send an email;
- provide separate **Approve** and **Request revision** links.

This is not required for the first end-to-end POC.

---

## 13. Failure Handling

### Agent cannot understand the request

- Set status to `Needs Clarification`.
- Comment with no more than three direct questions.
- Do not open a speculative PR.

### Validation fails

- Attempt one focused correction.
- If still failing, set status to `Failed`.
- Comment with a concise error summary and retained branch name.
- Preserve detailed logs locally.

### Agent process times out or crashes

- Mark the attempt failed.
- Retain job state.
- Allow one automatic retry for infrastructure failures.
- Do not automatically retry ambiguous-content failures.
- Prevent simultaneous retries.

### Netlify preview fails

- Leave status as `Awaiting Review` only if the code checks passed and deployment is still pending.
- Otherwise set status to `Failed` or add a visible failure note.
- Do not merge.

### Duplicate webhook

- Return success without launching another agent.

---

## 14. Observability

Each run should have a stable run ID:

```text
issue-42-attempt-1
```

Log:

- webhook delivery ID;
- issue and repository;
- eligibility result;
- queue and start times;
- agent command and version, excluding secrets;
- exit code;
- validation results;
- branch and PR;
- state transitions;
- failure category;
- elapsed time.

Add a structured issue comment when a run begins and completes, but avoid noisy step-by-step comments.

Recommended failure categories:

```text
ineligible
duplicate
needs-clarification
validation-failed
agent-failed
github-api-failed
deployment-failed
timeout
```

---

## 15. Implementation Milestones

### Milestone 0 — Repository and preview baseline

Deliver:

- Netlify connection.
- Deploy Preview from a manually created PR.
- `main` branch protection.
- Site validation workflow.
- GitHub Project and statuses.
- Required labels.

Acceptance criteria:

- A manual branch and PR produce a preview URL.
- Validation runs on every PR.
- `main` cannot be pushed directly by the agent identity.

### Milestone 1 — Manual agent command

Deliver:

- `/githubtrigger` Claude skill.
- Shared tool-neutral workflow instructions.
- GitHub CLI/API access.
- Branch, validation, commit, push, PR, and status updates.

Acceptance criteria:

```bash
claude -p "/githubtrigger issue 42"
```

implements an eligible test issue and opens a valid PR without merging it.

Also verify that an ambiguous issue becomes `Needs Clarification`.

### Milestone 2 — Google Form intake

Deliver:

- Google Form.
- Apps Script submission trigger.
- Structured issue creation.
- Labels and Project insertion.
- Submission ID recorded in the response sheet.

Acceptance criteria:

- A form submission creates exactly one correctly formatted issue.
- Requester email is not exposed in the public repository.
- A failed API call is visible in the response sheet or script logs.

### Milestone 3 — Local webhook automation

Deliver:

- Webhook receiver.
- Signature validation.
- Eligibility checks.
- SQLite job queue and deduplication.
- Single worker that invokes the existing Claude command.
- systemd unit and health checks.

Acceptance criteria:

- An eligible form-created issue triggers one agent run.
- A random public issue triggers no agent run.
- An issue missing either trusted creator or required labels triggers no run.
- Replayed webhook delivery triggers no duplicate work.
- The webhook endpoint acknowledges quickly while the job continues locally.

### Milestone 4 — Review loop

Deliver:

- Agent comments with PR information.
- Netlify preview verified.
- Revision-request workflow.
- Completion state after merge.
- Maintainer documentation.

Acceptance criteria:

- A reviewer can move from issue to preview to merge.
- A requested revision causes the agent to update the existing PR rather than create a duplicate.
- Merge changes status to `Complete`.

### Milestone 5 — Cloud migration

Do this only after the local POC is stable.

Target architecture:

```text
GitHub webhook
    ↓
API Gateway / Lambda ingress
    ↓
Signature validation + deduplication
    ↓
Queue
    ↓
Bedrock AgentCore Runtime
    ↓
GitHub App tools
    ↓
PR + Netlify preview
```

Cloud changes:

- replace subscription-backed Claude Code with API/Bedrock model access;
- package the agent as a containerized runtime;
- store secrets in AWS Secrets Manager;
- use a GitHub App instead of a personal token;
- use a managed queue and durable job store;
- add CloudWatch logs, metrics, alarms, and a budget;
- retain the same issue states, safety checks, and acceptance tests.

Do not migrate by embedding the local shell command inside a cloud container without first separating:
- webhook ingress;
- eligibility and job state;
- repository workspace;
- agent orchestration;
- GitHub operations;
- validation.

---

## 16. AgentCore Evaluation

AgentCore is a future runtime choice, not a requirement for proving the workflow.

### Reasons to use it later

- Managed, consumption-based agent runtime.
- Containerized agent execution.
- Better cloud identity, logging, and isolation.
- A credible production architecture for a portfolio demonstration.
- Ability to add managed tools such as browser or code execution if future requirements justify them.

### Reasons not to start there

- It adds packaging, IAM, model billing, deployment, and observability work.
- The workflow itself is still unproven.
- A local Claude Code invocation is faster and cheaper for discovering the correct agent instructions.
- The most important engineering risks are intake quality, safe authorization, idempotency, validation, and human approval—not the runtime.

### Migration criterion

Move to AgentCore after:

- at least five representative requests have completed through the local workflow;
- the skill reliably distinguishes implementable requests from ambiguous ones;
- duplicate and failure behavior is tested;
- average model and runtime usage is understood;
- the GitHub permission model is finalized.

---

## 17. Cost and Safety Controls

- One concurrent job.
- Hard execution timeout.
- Maximum retry count.
- Limit agent work to one allowlisted repository.
- Do not expose arbitrary prompts through the webhook.
- Human merge required.
- AWS budget alarm before cloud deployment.
- Model token/output limits in the cloud implementation.
- Avoid AgentCore Memory, Browser, Gateway, or Code Interpreter until a concrete use case requires them.
- Keep secrets out of git, issue bodies, logs, and prompts.
- Periodically rotate PATs and webhook secrets.
- Remove local worktrees after successful completion while retaining logs.
- Back up the production site and retain git history for rollback.

---

## 18. Suggested Repository Layout

```text
.
├── index.html
├── assets/
├── netlify.toml
├── AGENTS.md
├── agent/
│   └── github-issue-workflow.md
├── .claude/
│   └── skills/
│       └── githubtrigger/
│           └── SKILL.md
├── .github/
│   └── workflows/
│       └── validate.yml
├── scripts/
│   └── validate-site.sh
├── tests/
│   └── site.spec.ts
├── automation/
│   ├── apps-script/
│   │   ├── Code.gs
│   │   └── README.md
│   └── webhook-runner/
│       ├── src/
│       ├── test/
│       ├── package.json
│       ├── README.md
│       └── booster-agent.service
└── docs/
    ├── architecture.md
    ├── operations.md
    ├── threat-model.md
    └── demo-script.md
```

---

## 19. Definition of Done for the POC

The POC is complete when:

1. A booster-club administrator submits the Google Form.
2. Exactly one structured GitHub issue is created.
3. The issue appears in the Project with status `New`.
4. GitHub delivers a valid webhook to the minipc.
5. The minipc authenticates and authorizes the event.
6. The issue moves to `Queued`, then `Implementing`.
7. Claude Code implements the request in a new branch.
8. Deterministic validation passes.
9. The agent opens a pull request and does not merge.
10. Netlify creates a preview URL.
11. The issue moves to `Awaiting Review`.
12. A human reviews the preview.
13. A human merges the PR.
14. Production deploys from `main`.
15. The issue moves to `Complete`.
16. An untrusted public issue cannot launch the agent.
17. A replayed webhook cannot create duplicate work.

---


## 20A. Claude Coordinator/Subagent Execution Model

When implementing this plan with Claude Code, prefer a coordinator/subagent workflow.

### Core pattern

```text
Main coordinator
    ↓ selects one task slice
Implementor subagent
    ↓ makes code/config changes
Read-only reviewer subagents
    ↓ report concise findings
Main coordinator
    ↓ updates plan, validates, commits, stops
```

### Coordinator responsibilities

The main Claude session should preserve high-level context and avoid becoming the long-running implementation scratchpad.

The coordinator owns:

- reading this plan;
- selecting the next incomplete task;
- defining a narrow task slice;
- spawning exactly one implementor subagent;
- deciding whether reviewer subagents are needed;
- interpreting reviewer feedback;
- requesting focused revisions;
- updating this plan;
- recording test evidence;
- committing completed work;
- stopping after one completed task slice.

The coordinator may make small plan, documentation, or integration edits, but should avoid doing most implementation work directly.

### Implementor subagent responsibilities

The implementor subagent owns the context-heavy work:

- inspecting relevant repository files;
- modifying code, configuration, scripts, workflows, or documentation for the selected slice;
- running targeted checks;
- debugging local failures;
- reporting what changed.

Only one implementor subagent may run at a time.

The implementor subagent must report:

```text
- task slice implemented
- files changed
- commands run
- test/check results
- risks or unresolved questions
- recommended next step
```

### Reviewer subagent responsibilities

Reviewer subagents are read-only unless the coordinator explicitly says otherwise.

Use reviewer subagents for focused review after the implementor finishes:

| Reviewer | Use when | Output |
|---|---|---|
| Security reviewer | webhook, auth, token, permission, GitHub App, secret handling, branch protection, deployment access | concise severity-ranked findings |
| Validation reviewer | tests, CI, HTML validation, Playwright checks, local scripts, acceptance criteria | missing checks and failure risks |
| Docs reviewer | setup instructions, operations docs, handoff docs, runbooks | clarity gaps and setup omissions |
| GitHub/API researcher | GitHub Projects, webhooks, labels, Apps Script, Netlify behavior is uncertain | verified implementation notes and references |

Reviewer subagents must not make broad edits. They should return concise findings with severity, rationale, and suggested fixes.

### Preferred model and effort guidance

Use the cheapest model that is likely to succeed for the current task. Escalate only when blocked or when the task has security/architecture risk.

| Role / task | Preferred model tier | Effort |
|---|---|---|
| Coordinator selecting next task and updating plan | Sonnet-class | Low to medium |
| Static site edits, Netlify config, basic validation scripts | Sonnet-class | Medium |
| Webhook runner implementation, queue/idempotency, GitHub API integration | Sonnet-class or Opus-class if stuck | Medium to high |
| Security review of webhook/auth/permissions/secrets | Opus-class | High |
| Architecture review before cloud migration | Opus-class | High |
| Docs/operator guide cleanup | Sonnet-class or Haiku-class | Low |
| Mechanical formatting, simple copy edits, small test fixes | Haiku-class or cheapest available | Low |
| Final milestone review before declaring POC complete | Opus-class | High |

If Claude Code exposes only a smaller set of model choices in the current environment, map them as follows:

```text
Opus-class  = strongest reasoning model available
Sonnet-class = default balanced coding model
Haiku-class = cheapest/fastest model available
```

Do not use Opus-class for every implementation step by default. Reserve it for security, architecture, difficult debugging, and final review.

### Subagent rules

- Do not run multiple implementor subagents in parallel.
- Do not allow overlapping edits.
- Do not implement later milestones early.
- Do not let reviewers modify files unless explicitly instructed.
- Do not let subagents change the plan status directly unless asked by the coordinator.
- Do not auto-merge or deploy production changes.
- Stop after one completed task slice so the human can review progress.

### Recommended `/goal` prompt

```text
Read `booster-club-agentic-publishing-plan.md`.

Act as the main coordinator for an incremental implementation loop.

Your job is not to implement the entire plan in one run. Your job is to complete exactly one coherent task slice from the next incomplete milestone, update the plan, and stop.

For this iteration:

1. Inspect the repository and the plan.
2. Identify the first incomplete milestone or task slice.
3. State the selected task slice and acceptance criteria.
4. Spawn exactly one implementor subagent to perform the code/config changes for that slice.
5. Give the implementor a narrow assignment, explicit constraints, and the relevant acceptance criteria.
6. Require the implementor to report files changed, commands run, test results, risks, and unresolved questions.
7. After implementation, spawn read-only reviewer subagents only if useful:
   - security reviewer for auth, webhook, token, permission, or deployment changes;
   - validation reviewer for tests, CI, parsing, and site checks;
   - docs reviewer for setup, operations, or handoff docs;
   - GitHub/API researcher only when API behavior is uncertain.
8. Reviewer subagents must not edit files. They must return concise severity-ranked findings and suggested fixes.
9. If reviewer findings require changes, send one focused revision request to the implementor subagent or make a minimal coordinator edit.
10. Run final relevant checks.
11. Update `booster-club-agentic-publishing-plan.md` with completed work, decisions, test evidence, and the next task.
12. Commit only if the task slice is complete and checks pass.
13. Stop and report what changed, what was tested, and what should happen next.

Do not run multiple implementor subagents in parallel. Do not allow overlapping edits. Do not implement later milestones early. Do not auto-merge or deploy production changes.
```


## 20. Implementation Instructions for Claude or Codex

Implement this plan milestone by milestone. When using Claude Code, follow the coordinator/subagent execution model in Section 20A.

### Required execution order

1. Inspect the existing repository and preserve its current design.
2. Implement **Milestone 0** and verify it.
3. Implement **Milestone 1** and test it with synthetic issues.
4. Implement **Milestone 2**.
5. Implement **Milestone 3** only after the manual command is reliable.
6. Implement **Milestone 4**.
7. Do not provision AgentCore or other AWS infrastructure until explicitly requested.

### Engineering constraints

- Favor a small, comprehensible system over a framework-heavy design.
- Keep the website static.
- Use TypeScript for the local webhook runner unless the repository already establishes another preference.
- Use SQLite for POC job state.
- Keep service-specific adapters isolated.
- Write tests for authorization, signature validation, idempotency, and state transitions.
- Never auto-merge.
- Never treat issue text as trusted shell input.
- Never expose requester email in a public GitHub issue.
- Document every manual setup step.
- Stop and report rather than guessing when a requirement affects school identity, money, dates, sponsor commitments, or legal language.

### First implementation task

Begin by producing:

1. a repository assessment;
2. a proposed file-level change list;
3. any unresolved prerequisites;
4. Milestone 0 implementation;
5. test evidence;
6. a short operator guide.

Do not implement later milestones in the same change unless explicitly instructed.
