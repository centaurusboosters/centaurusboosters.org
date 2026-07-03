import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from '@vercel/blob';

import { requireTinaSession } from '../../../lib/tina-media-auth';
import { MEDIA_PREFIX } from '../../../lib/tina-media-store-shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireTinaSession(req, res))) return;

  const directory = typeof req.query.directory === 'string' ? req.query.directory : '';
  const prefix = `${MEDIA_PREFIX}${directory ? `${directory}/` : ''}`;

  const { blobs } = await list({ prefix });

  const items = blobs.map((blob) => ({
    type: 'file' as const,
    id: blob.pathname,
    filename: blob.pathname.slice(prefix.length),
    directory,
    src: blob.url,
  }));

  return res.status(200).json({ items });
}
