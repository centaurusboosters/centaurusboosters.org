import type { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

import { requireTinaSession } from '../../../lib/tina-media-auth';
import { MEDIA_PREFIX } from '../../../lib/tina-media-store-shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireTinaSession(req, res))) return;

  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(MEDIA_PREFIX)) {
          throw new Error('Invalid upload path');
        }
        return {
          allowedContentTypes: ['image/*'],
          addRandomSuffix: false,
        };
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}
