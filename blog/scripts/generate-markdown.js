import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { renderHomepageMarkdown, renderPostMarkdown } from './post-markdown.js';

const distDir = path.resolve('dist');
const postsDir = path.resolve('posts');
const markdownDir = path.join(distDir, 'markdown');
function generateMarkdownPosts() {
  fs.mkdirSync(markdownDir, { recursive: true });

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = matter(raw);
    const markdown = renderPostMarkdown(slug, data, content);

    fs.writeFileSync(path.join(markdownDir, `${slug}.md`), markdown);
    posts.push({ slug, frontMatter: data });
  }

  fs.writeFileSync(
    path.join(markdownDir, 'index.md'),
    renderHomepageMarkdown(posts)
  );

  console.log(
    `Generated Markdown representations for the homepage and ${files.length} posts`
  );
}

generateMarkdownPosts();
