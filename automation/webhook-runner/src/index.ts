import { loadConfig } from './config.js';
import { openDb } from './db.js';
import { initQueue } from './queue.js';
import { buildServer } from './server.js';

async function main(): Promise<void> {
  const config = loadConfig();

  // Open SQLite database
  openDb(config.dbPath);
  console.info(`Database opened at ${config.dbPath}`);

  // Initialize the job queue
  initQueue(config);

  // Build and start the server
  const server = buildServer(config);

  try {
    await server.listen({ port: config.port, host: '0.0.0.0' });
    console.info(`Webhook runner listening on port ${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
