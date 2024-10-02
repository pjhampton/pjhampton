import { Post, PostGroup, RawPost } from '../@types/post';
import matter from 'gray-matter';

export const getPosts = () => loadPosts();

export const getSortedPosts = () => sortPostsDesc(getPosts());

const sortPostsDesc = (posts: Post[]): Post[] =>
  posts.sort(
    (a, b) => Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date)
  );

export const groupPostsByYear = (posts: Post[]): PostGroup =>
  posts.reduce((result, post) => {
    const year = new Date(post.frontMatter.date).getFullYear().toString();
    result[year] = result[year] || [];
    result[year].push(post);
    return result;
  }, {} as PostGroup);

const loadPosts = () =>
  ((context: __WebpackModuleApi.RequireContext) => {
    const keys = context.keys().filter((path) => path.startsWith('posts'));
    const values: RawPost[] = keys.map(context) as RawPost[];

    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3);
      const value = values[index];
      const document = matter(value.default);
      return {
        frontMatter: document.data,
        markdownBody: document.content,
        slug
      } as Post;
    });
    return data;
  })(require.context('../posts', true, /\.md$/));
