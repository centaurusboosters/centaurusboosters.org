import type { NextApiRequest, NextApiResponse } from 'next';
import { del } from '@vercel/blob';

import { requireTinaSession } from '../../../lib/tina-media-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await requireTinaSession(req, res))) return;

  const { url } = req.body as { url?: string };
  if (!url) {
    return res.status(400).json({ error: 'Missing url' });
  }

  await del(url);
  return res.status(200).json({ ok: true });
}
