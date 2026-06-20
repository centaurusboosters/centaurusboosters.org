import type { Config } from './config.js';

export interface GitHubLabel {
  name: string;
  [key: string]: unknown;
}

export interface GitHubUser {
  login: string;
  [key: string]: unknown;
}

export interface GitHubIssue {
  number: number;
  state: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  [key: string]: unknown;
}

export interface GitHubRepository {
  name: string;
  owner: GitHubUser;
  full_name: string;
  [key: string]: unknown;
}

export interface WebhookPayload {
  action: string;
  issue: GitHubIssue;
  repository: GitHubRepository;
  [key: string]: unknown;
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
}

/**
 * Pure eligibility checker — no I/O.
 * Returns { eligible, reason } describing whether the webhook payload
 * should trigger a job.
 */
export function checkEligibility(
  payload: WebhookPayload,
  config: Config,
): EligibilityResult {
  const expectedRepo = `${config.githubOwner}/${config.githubRepo}`;
  const actualRepo = payload.repository?.full_name;

  if (actualRepo !== expectedRepo) {
    return {
      eligible: false,
      reason: `Repository mismatch: expected ${expectedRepo}, got ${actualRepo ?? 'unknown'}`,
    };
  }

  const eligibleActions = ['opened', 'labeled', 'reopened'];
  if (!eligibleActions.includes(payload.action)) {
    return {
      eligible: false,
      reason: `Action '${payload.action}' is not eligible (expected one of: ${eligibleActions.join(', ')})`,
    };
  }

  if (!payload.issue) {
    return { eligible: false, reason: 'Payload missing issue object' };
  }

  if (payload.issue.state !== 'open') {
    return {
      eligible: false,
      reason: `Issue is not open (state: ${payload.issue.state})`,
    };
  }

  const creatorLogin = payload.issue.user?.login;
  if (!config.trustedIssueCreators.includes(creatorLogin)) {
    return {
      eligible: false,
      reason: `Issue creator '${creatorLogin}' is not in TRUSTED_ISSUE_CREATORS`,
    };
  }

  const issueLabels = (payload.issue.labels ?? []).map((l) => l.name);
  const missingLabels = config.eligibleLabels.filter(
    (required) => !issueLabels.includes(required),
  );
  if (missingLabels.length > 0) {
    return {
      eligible: false,
      reason: `Missing required labels: ${missingLabels.join(', ')}`,
    };
  }

  return { eligible: true, reason: 'All eligibility checks passed' };
}
