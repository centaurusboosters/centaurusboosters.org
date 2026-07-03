export const MEDIA_PREFIX = 'tina-media/';

// TinaCMS's admin dropzone sends directory: "/" (not "") at the root, so a
// naive truthy check treats it as a real subfolder and appends another "/",
// producing a "//" pathname that Vercel Blob rejects.
export function normalizeDirectory(directory?: string): string {
  if (!directory) return '';
  return directory.replace(/^\/+|\/+$/g, '');
}
