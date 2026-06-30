import type { IncomingMessage, ServerResponse } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TinaNodeBackend, type BackendAuthProvider } from '@tinacms/datalayer';
import NextAuth from 'next-auth';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../../../lib/auth-options';
import databaseClient from '../../../../tina/__generated__/databaseClient';

// Re-implemented in-house rather than using tinacms-authjs's
// AuthJsBackendAuthProvider: that package's published dist/index.js bundles
// its frontend module too, which imports `tinacms` and breaks under Node's
// ESM resolver due to tinacms's `@heroicons/react/solid` directory import.
const authProvider: BackendAuthProvider = {
  isAuthorized: async (req, res) => {
    const session = await getServerSession(
      req as NextApiRequest,
      res as NextApiResponse,
      authOptions
    );
    if (!session?.user) {
      return { isAuthorized: false, errorCode: 401, errorMessage: 'Unauthorized' };
    }
    return { isAuthorized: true };
  },
  extraRoutes: {
    auth: {
      secure: false,
      handler: async (req: IncomingMessage & { query?: Record<string, unknown> }, res: ServerResponse, opts) => {
        const url = new URL(req.url || '', `http://${req.headers?.host || 'localhost'}`);
        const authSubRoutes = url.pathname.replace(`${opts!.basePath}auth/`, '').split('/');
        req.query = { ...req.query, nextauth: authSubRoutes };
        await NextAuth(authOptions)(req as NextApiRequest, res as NextApiResponse);
      },
    },
  },
};

const handler = TinaNodeBackend({ authProvider, databaseClient });

export default (req: NextApiRequest, res: NextApiResponse) => handler(req, res);
