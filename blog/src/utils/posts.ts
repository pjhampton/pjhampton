import type { Post, PostGroup } from '../types/post';
// @ts-ignore - virtual module provided by vite plugin
import rawPosts from 'virtual:posts';

const allPosts: Post[] = rawPosts;

const sortPostsDesc = (posts: Post[]): Post[] =>
  [...posts].sort(
    (a, b) =>
      Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date)
  );

export const getPosts = () => allPosts;

export const getSortedPosts = () => sortPostsDesc(allPosts);

export const groupPostsByYear = (posts: Post[]): PostGroup =>
  posts.reduce((result, post) => {
    const year = new Date(post.frontMatter.date).getFullYear().toString();
    result[year] = result[year] || [];
    result[year].push(post);
    return result;
  }, {} as PostGroup);
