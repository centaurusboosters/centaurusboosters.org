import type { NextApiRequest, NextApiResponse } from 'next';
import { TinaNodeBackend, type BackendAuthProvider } from '@tinacms/datalayer';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../../../lib/auth-options';
import { isAuthBypassEnabled } from '../../../lib/tina-auth-bypass';
import databaseClient from '../../../../tina/__generated__/databaseClient';

// Auth is handled by the standalone NextAuth route at /api/auth - see
// src/lib/google-auth-provider.ts for why it isn't mounted under /api/tina.
const authProvider: BackendAuthProvider = {
  isAuthorized: async (req, res) => {
    if (isAuthBypassEnabled()) {
      return { isAuthorized: true };
    }
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
};

const handler = TinaNodeBackend({ authProvider, databaseClient });

export default (req: NextApiRequest, res: NextApiResponse) => handler(req, res);
