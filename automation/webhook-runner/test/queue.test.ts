import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openDb, getDb } from '../src/db.js';
import type { Config } from '../src/config.js';

// Mock the worker module so no real processes are spawned
vi.mock('../src/worker.js', () => ({
  runJob: vi.fn().mockResolvedValue({
    exitCode: 0,
    timedOut: false,
    rateLimited: false,
    branchName: 'issue-42-test',
    prNumber: 10,
    logFile: '/tmp/test.log',
  }),
  nextMidnightUtc: vi.fn().mockReturnValue(Date.now() + 86400000),
}));

import { enqueue, initQueue } from '../src/queue.js';
import { runJob } from '../src/worker.js';

const testConfig: Config = {
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
  dbPath: ':memory:',
};

describe('queue', () => {
  beforeEach(() => {
    openDb(':memory:');
    initQueue(testConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Close the in-memory DB after each test
    try {
      getDb().close();
    } catch {
      // Ignore
    }
  });

  it('enqueues a job and returns enqueued=true', () => {
    const result = enqueue('delivery-1', 42, 'testowner/testrepo');
    expect(result.enqueued).toBe(true);
  });

  it('rejects duplicate delivery_id (same issue)', async () => {
    enqueue('delivery-1', 42, 'testowner/testrepo');

    // Wait for the worker loop to complete
    await vi.waitFor(() => {
      expect(runJob).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });

    // Try to enqueue the same issue again — it's already completed, so should skip
    const result2 = enqueue('delivery-2', 42, 'testowner/testrepo');
    expect(result2.enqueued).toBe(false);
  });

  it('rejects duplicate issue job when already queued', () => {
    // First enqueue — sets status to 'queued'
    const result1 = enqueue('delivery-1', 99, 'testowner/testrepo');
    expect(result1.enqueued).toBe(true);

    // Second enqueue before worker runs — should be rejected
    // We need to pause the worker; since worker runs in setImmediate, we can
    // check before it gets to run in the same tick
    const result2 = enqueue('delivery-2', 99, 'testowner/testrepo');
    expect(result2.enqueued).toBe(false);
  });

  it('allows a second job for a different issue number', async () => {
    const result1 = enqueue('delivery-1', 42, 'testowner/testrepo');
    expect(result1.enqueued).toBe(true);

    const result2 = enqueue('delivery-2', 43, 'testowner/testrepo');
    expect(result2.enqueued).toBe(true);
  });

  it('processes the second job after the first completes', async () => {
    enqueue('delivery-1', 100, 'testowner/testrepo');
    enqueue('delivery-2', 101, 'testowner/testrepo');

    // Wait for both jobs to be processed
    await vi.waitFor(
      () => {
        expect(runJob).toHaveBeenCalledTimes(2);
      },
      { timeout: 3000 },
    );
  });
});
