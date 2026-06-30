import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { RedisLevel } from 'upstash-redis-level';

type DatabaseAdapter = Parameters<typeof createDatabase>[0]['databaseAdapter'];

// VERCEL_GIT_COMMIT_REF is the branch name (not the commit SHA), so this
// namespace is per-branch — every commit pushed to the same branch reuses
// the same Redis keyspace rather than accumulating one namespace per commit.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      namespace: branch,
      gitProvider: new GitHubProvider({
        branch,
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        token: process.env.GITHUB_TOKEN!,
      }),
      databaseAdapter: new RedisLevel<string, Record<string, unknown>>({
        redis: {
          url: process.env.KV_REST_API_URL!,
          token: process.env.KV_REST_API_TOKEN!,
        },
      }) as unknown as DatabaseAdapter,
    });
