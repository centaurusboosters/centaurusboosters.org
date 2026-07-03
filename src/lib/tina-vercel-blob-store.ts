import { upload } from '@vercel/blob/client';
import type { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from 'tinacms';

import { MEDIA_PREFIX, buildThumbnails, normalizeDirectory } from './tina-media-store-shared';

export class VercelBlobMediaStore implements MediaStore {
  accept = 'image/*';
  isStatic = false;

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    return Promise.all(
      files.map(async ({ directory, file }) => {
        const dir = normalizeDirectory(directory);
        const pathname = `${MEDIA_PREFIX}${dir ? `${dir}/` : ''}${file.name}`;
        const blob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/tina/media-upload',
        });
        return {
          type: 'file',
          id: blob.pathname,
          filename: file.name,
          directory: dir,
          src: blob.url,
          thumbnails: buildThumbnails(blob.url),
        };
      })
    );
  }

  async delete(media: Media): Promise<void> {
    const res = await fetch('/api/tina/media-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: media.src }),
    });
    if (!res.ok) {
      throw new Error('Failed to delete media');
    }
  }

  async list(options: MediaListOptions = {}): Promise<MediaList> {
    const params = new URLSearchParams();
    const directory = normalizeDirectory(options.directory);
    if (directory) params.set('directory', directory);
    const res = await fetch(`/api/tina/media-list?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to list media');
    }
    return res.json();
  }
}
