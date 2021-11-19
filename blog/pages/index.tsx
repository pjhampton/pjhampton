import Layout from '@components/Layout'
import PostList from '@components/PostList'
import matter from 'gray-matter'

interface IndexProps {
  title: string;
  posts: string;
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

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  const posts = ((context) => {
    const keys = context.keys().filter(post => post.startsWith("posts/"))
    const values = keys.map(context)

    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      const value = values[index]
      const document = matter(value.default)
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
