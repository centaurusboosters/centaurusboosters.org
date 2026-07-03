import type { NextApiRequest, NextApiResponse } from 'next';
import { del, head } from '@vercel/blob';

import { requireTinaSession } from '../../../lib/tina-media-auth';
import { MEDIA_PREFIX } from '../../../lib/tina-media-store-shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await requireTinaSession(req, res))) return;

  const { url } = req.body as { url?: string };
  if (!url) {
    return res.status(400).json({ error: 'Missing url' });
  }

  try {
    const blob = await head(url);
    if (!blob.pathname.startsWith(MEDIA_PREFIX)) {
      return res.status(403).json({ error: 'Refusing to delete blob outside media prefix' });
    }
    await del(url);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}
