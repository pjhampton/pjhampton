import matter from 'gray-matter'
import Layout from '../components/Layout'
import PostList from '../components/PostList'
import { Post } from '../components/types'

interface IndexProps {
  title: string;
  posts: Post[];
}

export default function Index({ title, posts } : IndexProps) {

  return (
    <Layout pageTitle={title}>
      <main>
        <PostList posts={posts} />
      </main>
    </Layout>
  )
}

interface RawPost {
  default: string;
}

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  const posts = ((context: __WebpackModuleApi.RequireContext) => {
    const keys = context.keys();
    const values: RawPost[] = keys.map(context) as RawPost[];

    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      const value = values[index]
      const document = matter(value.default);
      return {
        frontMatter: document.data,
        markdownBody: document.content,
        slug,
      }
    })
    return data
  })(require.context('../posts', true, /\.md$/))

  // sort descending
  posts.sort((a, b) => Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date))
  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
      posts,
    },
  }
}
