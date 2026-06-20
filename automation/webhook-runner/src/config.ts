export interface Config {
  webhookSecret: string;
  githubOwner: string;
  githubRepo: string;
  trustedIssueCreators: string[];
  eligibleLabels: string[];
  repoPath: string;
  claudeBin: string;
  port: number;
  logLevel: string;
  maxAttempts: number;
  jobTimeoutMs: number;
  dbPath: string;
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return val;
}

function parseJsonArray(envVar: string, defaultValue: string[]): string[] {
  const raw = process.env[envVar];
  if (!raw) return defaultValue;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`${envVar} must be a JSON array`);
    }
    return parsed as string[];
  } catch (err) {
    throw new Error(`Failed to parse ${envVar} as JSON array: ${String(err)}`);
  }
}

export function loadConfig(): Config {
  const repoPath = process.env['REPO_PATH'] ?? '/home/kurtharriger/boosters';
  return {
    webhookSecret: requireEnv('WEBHOOK_SECRET'),
    githubOwner: process.env['GITHUB_OWNER'] ?? 'kurtharriger',
    githubRepo: process.env['GITHUB_REPO'] ?? '2026-boosters',
    trustedIssueCreators: parseJsonArray('TRUSTED_ISSUE_CREATORS', ['kurtharriger']),
    eligibleLabels: parseJsonArray('ELIGIBLE_LABELS', ['source:google-form', 'agent:eligible']),
    repoPath,
    claudeBin: process.env['CLAUDE_BIN'] ?? 'claude',
    port: parseInt(process.env['PORT'] ?? '3000', 10),
    logLevel: process.env['LOG_LEVEL'] ?? 'info',
    maxAttempts: parseInt(process.env['MAX_ATTEMPTS'] ?? '2', 10),
    jobTimeoutMs: parseInt(process.env['JOB_TIMEOUT_MS'] ?? '600000', 10),
    dbPath: process.env['DB_PATH'] ?? `${repoPath}/automation/webhook-runner/db/jobs.sqlite`,
  };
}
