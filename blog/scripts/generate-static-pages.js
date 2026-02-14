import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Generate static HTML pages for each post route so that
// direct navigation to /post/slug works with static hosting.
// This copies the index.html to each post path.

const distDir = path.resolve('dist');
const postsDir = path.resolve('posts');

function generateStaticPages() {
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // Create /post/ directory
  const postDir = path.join(distDir, 'post');
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  // Get all post slugs
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  files.forEach((file) => {
    const slug = file.replace('.md', '');
    const slugDir = path.join(postDir, slug);

    if (!fs.existsSync(slugDir)) {
      fs.mkdirSync(slugDir, { recursive: true });
    }

    // Copy index.html for this route so SPA routing works
    fs.writeFileSync(path.join(slugDir, 'index.html'), indexHtml);
  });

  // Also create a 404.html from the index for fallback routing
  fs.copyFileSync(
    path.join(distDir, 'index.html'),
    path.join(distDir, '404.html')
  );

  console.log(`Generated static pages for ${files.length} posts`);
}

generateStaticPages();
