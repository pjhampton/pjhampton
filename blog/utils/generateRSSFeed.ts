import RSS, { FeedOptions } from 'rss';
import { getSortedPosts } from './posts';
import fs from 'fs';

export default async function generateRssFeed() {
  const site_url = 'localhost:3000';
 
  const feedOptions: FeedOptions = {
   title: 'Pete Hampton | RSS Feed',
   description: 'Pete Hamptons blog feed',
   site_url: site_url,
   feed_url: `${site_url}/rss.xml`,
   image_url: `${site_url}/logo.png`,
   pubDate: new Date(),
   copyright: `All rights reserved ${new Date().getFullYear()}`,
  };
 
  const feed = new RSS(feedOptions);
  const allPosts = getSortedPosts();

  allPosts.map((post) => {
    feed.item({
     title: post.frontMatter.title,
     description: post.frontMatter.description,
     url: `${site_url}/post/${post.slug}`,
     date: post.frontMatter.date,
    });
   });

   fs.writeFileSync('./public/rss.xml', feed.xml({ indent: true }));
 }
