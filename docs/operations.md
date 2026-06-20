# Operations Guide — Centaurus Boosters Agentic Publishing Workflow

This guide covers the one-time human setup steps required to activate the agentic publishing workflow. Each section corresponds to a setup gate in Section 0 of `booster-club-agentic-publishing-plan.md`.

---

## P1 — Connect Netlify to the GitHub repository

**Required before:** Deploy Previews on pull requests work.

### Prerequisites

- A Netlify account (free tier is sufficient).
- Admin access to the `kurtharriger/2026-boosters` GitHub repository.

### Steps

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign in (or create a free account).
2. Click **Add new site** → **Import an existing project**.
3. Click **Deploy with GitHub**.
4. Authorize Netlify to access your GitHub account if prompted.
5. Search for and select **kurtharriger/2026-boosters**.
6. In the build settings form:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - These values are also in `netlify.toml` at the repo root, which Netlify reads automatically.
7. Click **Deploy site**.
8. Wait for the initial deploy to complete. The site will be live at a `*.netlify.app` URL.
9. In **Site configuration → Build & deploy → Deploy contexts**, confirm:
   - **Deploy Previews** is set to **Any pull request**.
10. *(Optional)* In **Domain management**, add a custom domain if desired.

### Verification

Open a test PR (any file change against `main`). After a few minutes, a Netlify bot should comment on the PR with a **Deploy Preview URL**. That URL confirms P1 is complete.

---

## P3 — Build and publish directory

The site now builds with Next.js static export. Netlify runs `npm run build` and publishes `out/`. Static assets and the legacy Decap admin app still live under `public/`, and Next copies them into the exported site.

Local verification:

1. Run `npm ci`.
2. Run `npm run build`.
3. Run `bash scripts/validate-site.sh out`.

Use `npm run dev` for local development (Next dev server on port 3000 by default). Use `npm run build` to generate a production export in `out/`.

---

## CMS admin workflow

The Decap CMS admin is available at `/admin/` on deployed builds. It manages structured data in `src/data/` (sponsors, tournament details, contacts) and prose content in `src/content/` (about, grants).

### Access model

- Decap uses the GitHub backend, not Netlify Identity or Git Gateway.
- Admins need GitHub accounts with write access to `kurtharriger/2026-boosters`.
- Decap targets `main` in `public/admin/config.yml`.
- Decap uses `gilded-genie-b2528a.netlify.app` as its Netlify OAuth site domain so local admin testing can route auth through the correct Netlify site.
- `publish_mode: editorial_workflow` makes Decap create content branches and pull requests instead of committing directly to protected `main`.
- Netlify builds deploy previews for CMS pull requests and rebuilds production after a PR is merged.

### Netlify/GitHub OAuth setup

1. In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill in:
   - **Application name:** `Centaurus Boosters CMS`
   - **Homepage URL:** the production site URL, such as `https://YOUR-SITE.netlify.app`
   - **Authorization callback URL:** the callback URL shown in Netlify's GitHub OAuth provider setup for this site.
3. Create the app, then copy its **Client ID**.
4. Generate and copy a **Client secret**.
5. In Netlify, open the site and go to **Site configuration → Access & security → OAuth**.
6. Add or install the **GitHub** authentication provider.
7. Paste the GitHub OAuth App client ID and client secret, then save.
8. Visit `/admin/` on the deployed Netlify URL, choose GitHub login, and confirm Decap can read the **Site Data → Sponsors** entry.

For local testing, run `npm run dev` and open `http://localhost:3000/admin/index.html`. In production, Netlify handles `/admin/` → `/admin/index.html` automatically. Do not open `public/admin/index.html` directly with a `file://` URL; Decap auth expects to run from an HTTP origin.

### Editing sponsors

1. Open `/admin/`.
2. Log in with GitHub.
3. Open **Site Data → Sponsors**.
4. Add, remove, reorder, disable, rename, or replace sponsor logos.
5. Save the draft in Decap.
6. Move the draft through Decap's editorial workflow when ready; Decap will create or update a GitHub pull request against `main`.
7. Review and merge the pull request in GitHub after required checks and approvals pass.

---

## P4 — Two-layer allowlist

Both allowlists are hardcoded in their respective artifacts. They can be changed by editing source code:

| Layer | Where configured | Initial value |
|---|---|---|
| Form-submitter allowlist | `automation/apps-script/Code.gs` (not yet written) | `["kurtharriger@gmail.com"]` |
| GitHub issue-creator allowlist | `automation/webhook-runner/src/config.ts` (not yet written) | `["kurtharriger"]` |

---

## P5 — GitHub fine-grained token for Apps Script

**When:** Before deploying the Google Apps Script (Milestone 2).

### Create the token

1. Go to [https://github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new).
2. Set **Token name**: `boosters-apps-script-form-intake`.
3. Set **Expiration**: 90 days (set a calendar reminder to rotate).
4. Under **Repository access**, select **Only select repositories** → `kurtharriger/2026-boosters`.
5. Under **Permissions → Repository permissions**, set:
   - **Issues**: Read and write
   - All others: No access
6. Click **Generate token** and copy it immediately (it is shown only once).

### Store in Apps Script Properties

1. Open the Apps Script editor for the form script (see P6).
2. Click **Project Settings** (gear icon) → **Script Properties**.
3. Click **Add script property**.
4. Name: `GITHUB_TOKEN`, Value: *(paste the token)*.
5. Save. The token is now accessible as `PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN')` and is not stored in source code.

---

## P6 — Google Form + Apps Script

**When:** Milestone 2.

The agent will produce `automation/apps-script/Code.gs` and a README. Human steps to deploy:

1. Create a Google Form at [https://forms.google.com](https://forms.google.com) with the fields listed in Section 5 of the plan. Set the form to **collect email addresses** (sign-in required).
2. In the Form editor, click the three-dot menu → **Script editor**.
3. Replace the default script with the contents of `automation/apps-script/Code.gs`.
4. In the script editor, click **Project Settings** (gear) and add the `GITHUB_TOKEN` script property (see P5 above).
5. Click **Triggers** (clock icon) → **Add trigger**.
   - Function to run: `onFormSubmit`
   - Event source: **From form**
   - Event type: **On form submit**
6. Authorize the script when prompted (Google account permissions).
7. Submit a test response from an allowlisted email and verify a GitHub issue appears in the repo.

---

## P7 — GitHub webhook registration

**When:** Milestone 3 (after the local webhook runner is deployed).

### Prerequisites

- The webhook runner is running on the minipc (see `automation/webhook-runner/README.md`).
- An HTTPS tunnel is active and you know the public URL (see P8 below).

### Steps

1. Go to `https://github.com/kurtharriger/2026-boosters/settings/hooks`.
2. Click **Add webhook**.
3. Fill in:
   - **Payload URL**: `https://<your-tunnel-domain>/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Generate a random secret (`openssl rand -hex 32`) and copy it. You will set `WEBHOOK_SECRET` in the runner's environment with this same value.
   - **Which events**: Select **Let me select individual events** → check only **Issues**.
   - **Active**: checked.
4. Click **Add webhook**.
5. In the runner's systemd unit or `.env` file, set `WEBHOOK_SECRET=<the same value you entered above>`.

### Verification

GitHub shows a **Recent Deliveries** tab on the webhook settings page. After the next issue event, a green checkmark confirms delivery. The runner's health endpoint at `/health` should also respond.

---

## P8 — HTTPS tunnel to the minipc

**When:** Milestone 3.

The webhook receiver must be reachable from the public internet over HTTPS. Options:

- **Cloudflare Tunnel** (recommended — free, persistent URL): `cloudflared tunnel --url http://localhost:3000`
- **ngrok**: `ngrok http 3000` (URL changes on restart unless you use a paid plan or a static domain).
- **Tailscale Funnel**: if the repo is not public-facing, Tailscale Funnel provides a persistent HTTPS URL.

Whatever tunnel you use, record the stable public URL and use it as the webhook Payload URL in P7.

---

## GitHub Project setup

**When:** Before or during Milestone 0.

1. Go to [https://github.com/users/kurtharriger/projects](https://github.com/users/kurtharriger/projects) → **New project**.
2. Select **Board** template.
3. Name the project: **Boosters Site Changes**.
4. Add a **Single select** field named `Status` with these options (in order):
   - New
   - Queued
   - Implementing
   - Needs Clarification
   - Awaiting Review
   - Revision Requested
   - Failed
   - Complete
5. Add the `kurtharriger/2026-boosters` repository to the project (**Settings → Linked repositories**).
6. Record the Project number (visible in the URL, e.g. `/projects/1`) — it will be needed by the Apps Script and webhook runner.

---

## Stale-lock recovery

If the webhook runner or a manual `claude -p` invocation crashes mid-run, the local git working tree may be left on a non-`main` branch (`agent/issue-*`). Every subsequent run will detect this and abort with a notification.

To recover:

1. `cd /path/to/2026-boosters`
2. Inspect the leftover branch: `git log --oneline -5`
3. Decide whether to keep the work:
   - **Keep it:** push the branch and open a PR manually: `git push origin HEAD` then `gh pr create`.
   - **Discard it:** `git checkout main && git branch -D agent/issue-<number>-*`
4. Once back on `main`, the next run will proceed normally.

---

## Rotating secrets

- **GitHub fine-grained token (P5):** rotate every 90 days. Create a new token, update the Apps Script property, delete the old token.
- **Webhook secret (P7):** rotate by generating a new value, updating the GitHub webhook settings, and updating `WEBHOOK_SECRET` in the runner's environment, then restarting the runner.
- Never commit tokens or secrets to git.
