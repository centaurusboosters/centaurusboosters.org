# Booster Webhook Runner

Receives GitHub webhook events, validates them, and queues jobs that invoke the Claude CLI
to run the `/githubtrigger` workflow automatically.

## Prerequisites

- Node.js >= 20 (22 recommended)
- npm
- `claude` CLI installed and authenticated
- `gh` CLI installed and authenticated
- A GitHub webhook configured on `kurtharriger/2026-boosters` pointing to this server

## Install and Build

```bash
cd automation/webhook-runner
npm install
npm run build
```

## Environment Variables

Create a `.env` file in this directory (never commit it):

| Variable | Required | Default | Description |
|---|---|---|---|
| `WEBHOOK_SECRET` | **Yes** | — | HMAC-SHA256 secret matching the GitHub webhook configuration. Never log or expose this value. |
| `GITHUB_OWNER` | No | `kurtharriger` | GitHub repository owner. |
| `GITHUB_REPO` | No | `2026-boosters` | GitHub repository name. |
| `TRUSTED_ISSUE_CREATORS` | No | `["kurtharriger"]` | JSON array of GitHub logins whose issues are processed. |
| `ELIGIBLE_LABELS` | No | `["source:google-form","agent:eligible"]` | JSON array of labels that must ALL be present on an issue for it to be processed. |
| `REPO_PATH` | No | `/home/kurtharriger/boosters` | Absolute path to the local git repository checkout used by the claude CLI. |
| `CLAUDE_BIN` | No | `claude` | Path or name of the claude CLI binary. |
| `PORT` | No | `3000` | Port for the HTTP server to listen on. |
| `LOG_LEVEL` | No | `info` | Fastify log level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`). |
| `MAX_ATTEMPTS` | No | `2` | Maximum number of job attempt retries before marking as permanently failed. |
| `JOB_TIMEOUT_MS` | No | `600000` | Maximum time (ms) a single claude invocation may run before being killed. Default is 10 minutes. |
| `DB_PATH` | No | `<REPO_PATH>/automation/webhook-runner/db/jobs.sqlite` | Path to the SQLite database file. |

Example `.env`:

```env
WEBHOOK_SECRET=your-secret-here
PORT=3000
LOG_LEVEL=info
```

## Running with systemd (recommended for production)

Copy the service file to the systemd user directory and enable it:

```bash
mkdir -p ~/.config/systemd/user
cp booster-agent.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable booster-agent.service
systemctl --user start booster-agent.service
```

Check status and view logs:

```bash
systemctl --user status booster-agent.service
journalctl --user -u booster-agent.service -f
```

To enable the service to start when the machine boots (without requiring login):

```bash
sudo loginctl enable-linger $USER
```

## Running Manually (development)

```bash
# TypeScript directly via tsx (no build step required)
npm run dev

# Or run the compiled output
npm run build
npm start
```

## HTTP Endpoints

- `POST /webhooks/github` — GitHub webhook receiver. Validates HMAC-SHA256 signature, checks
  issue eligibility, and enqueues a job.
- `GET /health` — Liveness check. Returns `{"status":"ok"}`.
- `GET /ready` — Readiness check. Returns `{"status":"ok","dbOpen":true}` when the database
  is open, or HTTP 503 if not ready.

## Log Locations

- **systemd journal**: `journalctl --user -u booster-agent.service`
- **Agent run logs**: `automation/webhook-runner/logs/issue-<N>-attempt-<N>.log`
- **SQLite database**: `automation/webhook-runner/db/jobs.sqlite` (default path)

## Running Tests

```bash
npm test
```

## GitHub Webhook Setup

In the GitHub repository settings (`kurtharriger/2026-boosters`):

1. Go to Settings → Webhooks → Add webhook.
2. Set Payload URL to `http://<your-minipc-ip>:<PORT>/webhooks/github`.
3. Set Content type to `application/json`.
4. Set Secret to the same value as `WEBHOOK_SECRET`.
5. Select individual events: **Issues** only.
6. Confirm the webhook is active.

## Security Notes

- `WEBHOOK_SECRET` is validated before any payload processing. Bad signatures return HTTP 401.
- Issue numbers are validated as positive integers before being passed to the claude CLI.
- Issue text is never interpolated into shell commands.
- Delivery IDs are deduplicated to prevent replays.
