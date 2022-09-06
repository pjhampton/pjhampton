import matter from 'gray-matter'
import Layout from '@components/Layout'
import PostList from '@components/PostList'
import { Post, PostGroup } from '../@types/post'
import { NextSeo } from 'next-seo';

interface IndexProps {
  title: string;
  posts: PostGroup;
}

interface RawPost {
  default: string;
}

export default function Index({ posts } : IndexProps) {

  return (
    <>
      <NextSeo
        title='Pete Hampton - Software Engineer'
        description={`Pete Hampton is a Software Engineer and freelance consultant from Belfast, N. Ireland. 
                      He mainly works with Java and TypeScript, and enjoys databases and digital signal processing.`} />
      <Layout pageTitle={'Pete Hampton'}>
      <main>
        <PostList posts={posts} />
      </main>
    </Layout>
    </>
  )
}

export async function getStaticProps() {

  const posts = ((context: __WebpackModuleApi.RequireContext) => {
    const keys = context.keys().filter(path => path.startsWith('posts'));
    const values: RawPost[] = keys.map(context) as RawPost[];

    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      const value = values[index]
      const document = matter(value.default);
      return {
        frontMatter: document.data,
        markdownBody: document.content,
        slug,
      } as Post
    })
    return data
  })(require.context('../posts', true, /\.md$/))

  // sort descending
  posts.sort((a, b) => Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date))
  // group by year
  const groupedPosts = posts.reduce((result, post) => {
    const year = new Date(post.frontMatter.date).getFullYear().toString();
    result[year] = result[year] || [];
    result[year].push(post);
    return result;
  }, {} as PostGroup)

  return {
    props: {
      posts: groupedPosts,
    },
  }
}
