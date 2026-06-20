import { describe, expect, it } from 'vitest';
import { checkEligibility } from '../src/eligibility.js';
import type { WebhookPayload } from '../src/eligibility.js';
import type { Config } from '../src/config.js';

const baseConfig: Config = {
  webhookSecret: 'test-secret',
  githubOwner: 'testowner',
  githubRepo: 'testrepo',
  trustedIssueCreators: ['trusted-user'],
  eligibleLabels: ['source:google-form', 'agent:eligible'],
  repoPath: '/tmp/test-repo',
  claudeBin: 'claude',
  port: 3000,
  logLevel: 'silent',
  maxAttempts: 2,
  jobTimeoutMs: 600000,
  dbPath: '/tmp/test.sqlite',
};

function makePayload(overrides: Partial<WebhookPayload> = {}): WebhookPayload {
  return {
    action: 'opened',
    issue: {
      number: 42,
      state: 'open',
      user: { login: 'trusted-user' },
      labels: [
        { name: 'source:google-form' },
        { name: 'agent:eligible' },
      ],
    },
    repository: {
      name: 'testrepo',
      owner: { login: 'testowner' },
      full_name: 'testowner/testrepo',
    },
    ...overrides,
  };
}

describe('checkEligibility', () => {
  it('returns eligible=true for a fully valid payload', () => {
    const result = checkEligibility(makePayload(), baseConfig);
    expect(result.eligible).toBe(true);
  });

  it('returns eligible=false for wrong repository', () => {
    const payload = makePayload({
      repository: {
        name: 'other-repo',
        owner: { login: 'testowner' },
        full_name: 'testowner/other-repo',
      },
    });
    const result = checkEligibility(payload, baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Repository mismatch');
  });

  it('returns eligible=false for action "closed"', () => {
    const result = checkEligibility(makePayload({ action: 'closed' }), baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('not eligible');
  });

  it('returns eligible=false for action "edited"', () => {
    const result = checkEligibility(makePayload({ action: 'edited' }), baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('not eligible');
  });

  it('returns eligible=true for action "labeled"', () => {
    const result = checkEligibility(makePayload({ action: 'labeled' }), baseConfig);
    expect(result.eligible).toBe(true);
  });

  it('returns eligible=true for action "reopened"', () => {
    const result = checkEligibility(makePayload({ action: 'reopened' }), baseConfig);
    expect(result.eligible).toBe(true);
  });

  it('returns eligible=false when issue is closed', () => {
    const payload = makePayload({
      issue: {
        number: 42,
        state: 'closed',
        user: { login: 'trusted-user' },
        labels: [
          { name: 'source:google-form' },
          { name: 'agent:eligible' },
        ],
      },
    });
    const result = checkEligibility(payload, baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('not open');
  });

  it('returns eligible=false for non-trusted issue creator', () => {
    const payload = makePayload({
      issue: {
        number: 42,
        state: 'open',
        user: { login: 'untrusted-user' },
        labels: [
          { name: 'source:google-form' },
          { name: 'agent:eligible' },
        ],
      },
    });
    const result = checkEligibility(payload, baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('not in TRUSTED_ISSUE_CREATORS');
  });

  it('returns eligible=false when a required label is missing', () => {
    const payload = makePayload({
      issue: {
        number: 42,
        state: 'open',
        user: { login: 'trusted-user' },
        labels: [{ name: 'source:google-form' }], // missing agent:eligible
      },
    });
    const result = checkEligibility(payload, baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Missing required labels');
    expect(result.reason).toContain('agent:eligible');
  });

  it('returns eligible=false when all required labels are missing', () => {
    const payload = makePayload({
      issue: {
        number: 42,
        state: 'open',
        user: { login: 'trusted-user' },
        labels: [],
      },
    });
    const result = checkEligibility(payload, baseConfig);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Missing required labels');
  });
});
