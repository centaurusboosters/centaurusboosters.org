import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from './config.js';
import type { Job } from './db.js';

export interface WorkerResult {
  exitCode: number | null;
  timedOut: boolean;
  rateLimited: boolean;
  branchName?: string;
  prNumber?: number;
  logFile: string;
}

const RATE_LIMIT_PATTERN = /claude ai usage limit/i;
// Match "branch: issue-123-some-slug" or "Created branch issue-123" style output
const BRANCH_PATTERN = /(?:branch[:\s]+)(issue-\d+[^\s]*)/i;
// Match PR number from gh pr create output or similar
const PR_PATTERN = /(?:pull[_\s-]?request[:\s#]+|\/pull\/)(\d+)/i;

/**
 * Next midnight UTC as a safe default retry-after timestamp (ms).
 */
function nextMidnightUtc(): number {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return midnight.getTime();
}

export async function runJob(job: Job, config: Config): Promise<WorkerResult> {
  const logDir = join(config.repoPath, 'automation', 'webhook-runner', 'logs');
  mkdirSync(logDir, { recursive: true });
  const logFile = join(
    logDir,
    `issue-${job.issue_number}-attempt-${job.attempt_count}.log`,
  );

  const logStream = createWriteStream(logFile, { flags: 'a' });

  const timestamp = new Date().toISOString();
  logStream.write(
    `[${timestamp}] Starting job ${job.id} for issue #${job.issue_number} (attempt ${job.attempt_count})\n`,
  );

  const issueNumber = parseInt(String(job.issue_number), 10);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    throw new Error(`Invalid issue number: ${job.issue_number}`);
  }

  const claudeArgs = ['-p', `/githubtrigger issue ${issueNumber}`];

  const childEnv = { ...process.env };
  delete childEnv['WEBHOOK_SECRET'];

  const child = spawn(config.claudeBin, claudeArgs, {
    cwd: config.repoPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: childEnv,
  });

  let stdoutBuf = '';
  let stderrBuf = '';

  child.stdout?.on('data', (chunk: Buffer) => {
    const text = chunk.toString();
    stdoutBuf += text;
    logStream.write(text);
  });

  child.stderr?.on('data', (chunk: Buffer) => {
    const text = chunk.toString();
    stderrBuf += text;
    logStream.write(text);
  });

  return new Promise<WorkerResult>((resolve) => {
    let resolved = false;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

    const finish = (
      exitCode: number | null,
      timedOut: boolean,
    ): void => {
      if (resolved) return;
      resolved = true;

      if (timeoutHandle !== null) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }

      const combinedOutput = stdoutBuf + stderrBuf;
      const rateLimited = RATE_LIMIT_PATTERN.test(combinedOutput);

      const branchMatch = BRANCH_PATTERN.exec(combinedOutput);
      const branchName = branchMatch?.[1];

      const prMatch = PR_PATTERN.exec(combinedOutput);
      const prNumber = prMatch ? parseInt(prMatch[1], 10) : undefined;

      const endTimestamp = new Date().toISOString();
      logStream.write(
        `[${endTimestamp}] Job ${job.id} finished: exitCode=${exitCode}, timedOut=${timedOut}, rateLimited=${rateLimited}\n`,
      );
      logStream.end();

      resolve({
        exitCode,
        timedOut,
        rateLimited,
        branchName,
        prNumber,
        logFile,
      });
    };

    timeoutHandle = setTimeout(() => {
      logStream.write(
        `[${new Date().toISOString()}] Job ${job.id} timed out after ${config.jobTimeoutMs}ms — killing process\n`,
      );
      child.kill('SIGTERM');
      // Give it a moment to die gracefully, then SIGKILL
      setTimeout(() => {
        try {
          child.kill('SIGKILL');
        } catch {
          // Already dead
        }
      }, 3000);
      finish(null, true);
    }, config.jobTimeoutMs);

    child.on('error', (err) => {
      logStream.write(
        `[${new Date().toISOString()}] Process error: ${err.message}\n`,
      );
      finish(null, false);
    });

    child.on('close', (code) => {
      finish(code, false);
    });
  });
}

export { nextMidnightUtc };
