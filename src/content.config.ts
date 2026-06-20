import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  about: defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/about' }) }),
  grants: defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/grants' }) }),
};
