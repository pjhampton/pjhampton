import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.resolve('posts');
const publicDir = path.resolve('public');
const siteUrl = 'https://pjhampton.com';

function loadPosts() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data } = matter(content);
    return {
      slug: file.replace('.md', ''),
      date: new Date(data.date).toISOString().split('T')[0]
    };
  });
}

function generateSitemap() {
  const posts = loadPosts();
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    `  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>`,
    ...posts.map(
      (post) => `  <url>
    <loc>${siteUrl}/post/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.8</priority>
  </url>`
    )
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
