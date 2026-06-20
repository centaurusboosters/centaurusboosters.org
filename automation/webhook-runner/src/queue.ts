import type { Config } from './config.js';
import {
  dequeueNextJob,
  enqueueJob,
  getJobByIssue,
  markJobCompleted,
  markJobFailed,
  markJobRateLimited,
  markJobStarted,
} from './db.js';
import { nextMidnightUtc, runJob } from './worker.js';

let isWorkerRunning = false;
let config: Config | null = null;

export function initQueue(cfg: Config): void {
  config = cfg;
}

/**
 * Enqueues a job for an issue.
 * Idempotent: if a job already exists for this issue in queued/running/completed state, skip.
 */
export function enqueue(
  deliveryId: string,
  issueNumber: number,
  repository: string,
): { enqueued: boolean; reason?: string } {
  const existing = getJobByIssue(issueNumber, repository);

  if (existing) {
    const skipStatuses = ['queued', 'running', 'completed'];
    if (skipStatuses.includes(existing.status)) {
      const msg = `Job already exists for issue #${issueNumber} in status '${existing.status}' (id=${existing.id}) — skipping`;
      console.info(msg);
      return { enqueued: false, reason: msg };
    }
  }

  const jobId = enqueueJob(deliveryId, issueNumber, repository);
  console.info(
    `Enqueued job id=${jobId} for issue #${issueNumber} delivery=${deliveryId}`,
  );

  if (!isWorkerRunning) {
    setImmediate(() => void runWorkerLoop());
  }

  return { enqueued: true };
}

/**
 * Serial worker loop — processes one job at a time.
 */
async function runWorkerLoop(): Promise<void> {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  try {
    while (true) {
      const job = dequeueNextJob();
      if (!job) break;

      if (!config) {
        console.error('Queue not initialized — no config');
        break;
      }

      markJobStarted(job.id);
      console.info(
        `Starting job id=${job.id} issue=#${job.issue_number} attempt=${job.attempt_count + 1}`,
      );

      // Re-fetch to get updated attempt_count after markJobStarted
      const updatedJob = { ...job, attempt_count: job.attempt_count + 1 };

      try {
        const result = await runJob(updatedJob, config);

        if (result.timedOut) {
          markJobFailed(job.id, `Job timed out after ${config.jobTimeoutMs}ms`);
          console.warn(
            `Job id=${job.id} timed out after ${config.jobTimeoutMs}ms`,
          );
        } else if (result.rateLimited) {
          const retryAfter = nextMidnightUtc();
          markJobRateLimited(job.id, retryAfter);
          console.warn(
            `Job id=${job.id} hit Claude usage limit; retry_after=${new Date(retryAfter).toISOString()}`,
          );
        } else if (result.exitCode === 0) {
          markJobCompleted(
            job.id,
            result.exitCode,
            result.branchName,
            result.prNumber,
          );
          console.info(
            `Job id=${job.id} completed successfully (exitCode=0, branch=${result.branchName ?? 'none'}, pr=${result.prNumber ?? 'none'})`,
          );
        } else {
          markJobFailed(
            job.id,
            `Agent exited with code ${result.exitCode ?? 'null'}`,
          );
          console.warn(
            `Job id=${job.id} failed with exitCode=${result.exitCode}`,
          );
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        markJobFailed(job.id, `Unexpected error: ${errMsg}`);
        console.error(`Job id=${job.id} threw unexpected error: ${errMsg}`);
      }
    }
  } finally {
    isWorkerRunning = false;
  }
}
