import { Feed } from 'feed';
import { getSortedPosts } from './posts';
import fs from 'fs';

export default async function generateRssFeed() {
  const site_url = 'https://pjhampton.com';

  const feedOptions = {
    title: 'Pete Hampton | RSS Feed',
    description: 'Pete Hamptons blog feed',
    id: site_url,
    link: site_url,
    image: `${site_url}/pjhampton_light.jpeg`,
    favicon: `${site_url}/pjhampton_light.jpeg`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    generator: `Feed for Pete Hampton's blog`,
    pubDate: new Date(),
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
      json: `${site_url}/rss.json`,
      atom: `${site_url}/atom.xml`
    }
  };

  const feed = new Feed(feedOptions);
  const allPosts = getSortedPosts();

  allPosts.map((post) => {
    feed.addItem({
      title: post.frontMatter.title,
      id: `${site_url}/post/${post.slug}`,
      link: `${site_url}/post/${post.slug}`,
      description: post.frontMatter.description,
      date: new Date(post.frontMatter.date)
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
  fs.writeFileSync('./public/rss.json', feed.json1());
  fs.writeFileSync('./public/atom.xml', feed.atom1());
}
