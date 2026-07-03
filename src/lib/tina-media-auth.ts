import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth-options';
import { isAuthBypassEnabled } from './tina-auth-bypass';

export async function requireTinaSession(req: NextApiRequest, res: NextApiResponse) {
  if (isAuthBypassEnabled()) {
    return { user: { email: 'dev-bypass@local' } };
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}
