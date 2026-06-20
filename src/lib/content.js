import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: true });
const contentRoot = join(process.cwd(), 'src', 'content');

export function renderContentMarkdown(collection, filename) {
  const source = readFileSync(join(contentRoot, collection, filename), 'utf8');
  const parsed = matter(source);

  return {
    data: parsed.data,
    html: markdown.render(parsed.content),
  };
}
