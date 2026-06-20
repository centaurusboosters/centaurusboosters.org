import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type JobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'rate_limited';

export interface Job {
  id: number;
  delivery_id: string;
  issue_number: number;
  repository: string;
  status: JobStatus;
  attempt_count: number;
  created_at: number;
  started_at: number | null;
  completed_at: number | null;
  agent_exit_code: number | null;
  branch_name: string | null;
  pull_request_number: number | null;
  error_summary: string | null;
  retry_after?: number | null;
}

let db: Database.Database | null = null;

export function openDb(dbPath: string): Database.Database {
  mkdirSync(dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS deliveries (
      delivery_id TEXT PRIMARY KEY,
      received_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      delivery_id TEXT NOT NULL,
      issue_number INTEGER NOT NULL,
      repository TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      attempt_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      started_at INTEGER,
      completed_at INTEGER,
      agent_exit_code INTEGER,
      branch_name TEXT,
      pull_request_number INTEGER,
      error_summary TEXT,
      retry_after INTEGER
    );
  `);
  return db;
}

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized — call openDb() first');
  return db;
}

export function isDbOpen(): boolean {
  return db !== null && db.open;
}

export function isDeliveryDuplicate(deliveryId: string): boolean {
  const row = getDb()
    .prepare('SELECT delivery_id FROM deliveries WHERE delivery_id = ?')
    .get(deliveryId);
  return row !== undefined;
}

export function recordDelivery(deliveryId: string): void {
  getDb()
    .prepare('INSERT OR IGNORE INTO deliveries (delivery_id, received_at) VALUES (?, ?)')
    .run(deliveryId, Date.now());
}

export function enqueueJob(
  deliveryId: string,
  issueNumber: number,
  repository: string,
): number {
  const result = getDb()
    .prepare(
      `INSERT INTO jobs (delivery_id, issue_number, repository, status, created_at)
       VALUES (?, ?, ?, 'queued', ?)`,
    )
    .run(deliveryId, issueNumber, repository, Date.now());
  return result.lastInsertRowid as number;
}

export function dequeueNextJob(): Job | undefined {
  return getDb()
    .prepare(
      `SELECT * FROM jobs
       WHERE status = 'queued'
       ORDER BY created_at ASC
       LIMIT 1`,
    )
    .get() as Job | undefined;
}

export function markJobStarted(id: number): void {
  getDb()
    .prepare(
      `UPDATE jobs SET status = 'running', started_at = ?, attempt_count = attempt_count + 1
       WHERE id = ?`,
    )
    .run(Date.now(), id);
}

export function markJobCompleted(
  id: number,
  exitCode: number,
  branchName?: string,
  prNumber?: number,
): void {
  getDb()
    .prepare(
      `UPDATE jobs SET status = 'completed', completed_at = ?, agent_exit_code = ?,
       branch_name = ?, pull_request_number = ?
       WHERE id = ?`,
    )
    .run(Date.now(), exitCode, branchName ?? null, prNumber ?? null, id);
}

export function markJobFailed(id: number, errorSummary: string): void {
  getDb()
    .prepare(
      `UPDATE jobs SET status = 'failed', completed_at = ?, error_summary = ?
       WHERE id = ?`,
    )
    .run(Date.now(), errorSummary, id);
}

export function markJobRateLimited(id: number, retryAfter: number): void {
  getDb()
    .prepare(
      `UPDATE jobs SET status = 'rate_limited', completed_at = ?, retry_after = ?,
       error_summary = 'Claude AI usage limit reached'
       WHERE id = ?`,
    )
    .run(Date.now(), retryAfter, id);
}

export function getJobByIssue(
  issueNumber: number,
  repository: string,
): Job | undefined {
  return getDb()
    .prepare(
      `SELECT * FROM jobs
       WHERE issue_number = ? AND repository = ?
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .get(issueNumber, repository) as Job | undefined;
}
