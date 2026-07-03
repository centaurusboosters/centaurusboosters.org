import type { NextApiRequest, NextApiResponse } from 'next';
import { list } from '@vercel/blob';

import { requireTinaSession } from '../../../lib/tina-media-auth';
import { MEDIA_PREFIX, buildThumbnails, normalizeDirectory } from '../../../lib/tina-media-store-shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireTinaSession(req, res))) return;

  const directory = normalizeDirectory(typeof req.query.directory === 'string' ? req.query.directory : '');
  const prefix = `${MEDIA_PREFIX}${directory ? `${directory}/` : ''}`;

  const { blobs, folders } = await list({ prefix, mode: 'folded' });

  const dirItems = (folders || []).map((folder) => {
    const trimmed = folder.endsWith('/') ? folder.slice(0, -1) : folder;
    return {
      type: 'dir' as const,
      id: trimmed,
      filename: trimmed.slice(prefix.length),
      directory,
    };
  });

  const fileItems = blobs.map((blob) => ({
    type: 'file' as const,
    id: blob.pathname,
    filename: blob.pathname.slice(prefix.length),
    directory,
    src: blob.url,
    thumbnails: buildThumbnails(blob.url),
  }));

  return res.status(200).json({ items: [...dirItems, ...fileItems] });
}
