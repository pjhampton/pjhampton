import { Feed } from 'feed';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const postsDir = path.resolve('posts');
const publicDir = path.resolve('public');

function loadPosts() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: file.replace('.md', ''),
      frontMatter: data,
      content
    };
  });

  return posts.sort(
    (a, b) => Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date)
  );
}

function generateRssFeed() {
  const site_url = 'https://pjhampton.com';

  const feedOptions = {
    title: 'Pete Hampton | RSS Feed',
    description: "Pete Hamptons blog feed",
    id: site_url,
    link: site_url,
    image: `${site_url}/pjhampton_light.jpeg`,
    favicon: `${site_url}/pjhampton_light.jpeg`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    generator: "Feed for Pete Hampton's blog",
    pubDate: new Date(),
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
      json: `${site_url}/rss.json`,
      atom: `${site_url}/atom.xml`
    }
  };

  const feed = new Feed(feedOptions);
  const allPosts = loadPosts();

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.frontMatter.title,
      id: `${site_url}/post/${post.slug}`,
      link: `${site_url}/post/${post.slug}`,
      description: post.frontMatter.description || post.frontMatter.excerpt || '',
      content: post.content,
      date: new Date(post.frontMatter.date)
    });
  });

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
  fs.writeFileSync(path.join(publicDir, 'rss.json'), feed.json1());
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());

  console.log('RSS feeds generated successfully');
}

generateRssFeed();
