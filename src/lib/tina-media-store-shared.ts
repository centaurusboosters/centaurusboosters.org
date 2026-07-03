export const MEDIA_PREFIX = 'tina-media/';

// TinaCMS's admin dropzone sends directory: "/" (not "") at the root, so a
// naive truthy check treats it as a real subfolder and appends another "/",
// producing a "//" pathname that Vercel Blob rejects.
export function normalizeDirectory(directory?: string): string {
  if (!directory) return '';
  return directory.replace(/^\/+|\/+$/g, '');
}

// TinaCMS's Media Manager only shows an image preview (vs. a generic file
// icon) when item.thumbnails[<size>] is set and looks like an image URL
// (node_modules/tinacms/dist/index.js: `isImage(thumbnail)` in
// ListMediaItem/GridMediaItem, keyed by the literal "75x75"/"400x400"/
// "1000x1000" strings it requests). Vercel Blob has no resizing, so point
// every requested size at the original blob URL.
export function buildThumbnails(url: string): Record<string, string> {
  return { '75x75': url, '400x400': url, '1000x1000': url };
}
