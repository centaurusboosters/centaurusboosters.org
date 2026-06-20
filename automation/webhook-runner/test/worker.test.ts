import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from '../src/config.js';
import type { Job } from '../src/db.js';

// vi.mock is hoisted to the top of the file, so we must NOT reference
// variables declared in test scope inside the factory. Instead we use
// vi.hoisted() to declare mocks that can be referenced both inside the
// factory and in the test body.
const { mockSpawn, mockCreateWriteStream, mockMkdirSync } = vi.hoisted(() => {
  return {
    mockSpawn: vi.fn(),
    mockCreateWriteStream: vi.fn(),
    mockMkdirSync: vi.fn(),
  };
});

vi.mock('node:child_process', () => ({
  spawn: mockSpawn,
}));

vi.mock('node:fs', () => ({
  createWriteStream: mockCreateWriteStream,
  mkdirSync: mockMkdirSync,
}));

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
  dbPath: '/tmp/test.sqlite',
};

const testJob: Job = {
  id: 1,
  delivery_id: 'delivery-1',
  issue_number: 42,
  repository: 'testowner/testrepo',
  status: 'running',
  attempt_count: 1,
  created_at: Date.now(),
  started_at: Date.now(),
  completed_at: null,
  agent_exit_code: null,
  branch_name: null,
  pull_request_number: null,
  error_summary: null,
};

/**
 * Creates a mock child process with controllable stdout/stderr/close behavior.
 */
function makeMockChild() {
  const child = new EventEmitter() as EventEmitter & {
    stdout: PassThrough;
    stderr: PassThrough;
    kill: ReturnType<typeof vi.fn>;
    pid: number;
  };
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.kill = vi.fn();
  child.pid = 12345;
  return child;
}

describe('worker.runJob', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up a no-op write stream mock
    mockCreateWriteStream.mockReturnValue({
      write: vi.fn(),
      end: vi.fn(),
    });
    mockMkdirSync.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks job completed when claude exits with code 0', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);

    // Simulate successful output
    child.stdout.emit('data', Buffer.from('Branch: issue-42-test-event\n'));
    child.emit('close', 0);

    const result = await resultPromise;
    expect(result.exitCode).toBe(0);
    expect(result.timedOut).toBe(false);
    expect(result.rateLimited).toBe(false);
    expect(result.branchName).toBe('issue-42-test-event');
  });

  it('marks job failed when claude exits with non-zero code', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);

    child.stderr.emit('data', Buffer.from('Some error occurred\n'));
    child.emit('close', 1);

    const result = await resultPromise;
    expect(result.exitCode).toBe(1);
    expect(result.timedOut).toBe(false);
    expect(result.rateLimited).toBe(false);
  });

  it('detects rate limit from stdout and sets rateLimited=true', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);

    child.stdout.emit(
      'data',
      Buffer.from('Error: Claude AI usage limit reached. Please try again later.\n'),
    );
    child.emit('close', 1);

    const result = await resultPromise;
    expect(result.rateLimited).toBe(true);
    expect(result.timedOut).toBe(false);
  });

  it('detects rate limit (case-insensitive) from stderr', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);

    child.stderr.emit(
      'data',
      Buffer.from('CLAUDE AI USAGE LIMIT exceeded\n'),
    );
    child.emit('close', 1);

    const result = await resultPromise;
    expect(result.rateLimited).toBe(true);
  });

  it('kills the process and sets timedOut=true on timeout', async () => {
    vi.useFakeTimers();

    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const shortTimeoutConfig = { ...testConfig, jobTimeoutMs: 100 };
    const resultPromise = runJob(testJob, shortTimeoutConfig);

    // Advance timers to trigger the timeout
    await vi.advanceTimersByTimeAsync(200);

    const result = await resultPromise;

    expect(result.timedOut).toBe(true);
    expect(result.exitCode).toBeNull();
    expect(child.kill).toHaveBeenCalledWith('SIGTERM');
  });

  it('extracts PR number from output', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);

    child.stdout.emit(
      'data',
      Buffer.from('Created pull request #123\nhttps://github.com/owner/repo/pull/123\n'),
    );
    child.emit('close', 0);

    const result = await resultPromise;
    expect(result.prNumber).toBe(123);
  });

  it('passes only the integer issue number to the claude command', async () => {
    const child = makeMockChild();
    mockSpawn.mockReturnValue(child);

    const resultPromise = runJob(testJob, testConfig);
    child.emit('close', 0);
    await resultPromise;

    expect(mockSpawn).toHaveBeenCalledWith(
      'claude',
      ['-p', '/githubtrigger issue 42'],
      expect.objectContaining({ cwd: '/tmp/test-repo' }),
    );
  });
});
