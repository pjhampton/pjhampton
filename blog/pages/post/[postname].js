import Link from 'next/link'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

import Layout from '@components/Layout'

export default function BlogPost({ siteTitle, frontMatter, markdownBody }) {
    if (!frontMatter) return <></>

    return (
        <Layout pageTitle={`${siteTitle} | ${frontMatter.title}`}>
        <Link href="/">
          <a>Back to post list</a>
        </Link>
        <article>
          <h1>{frontMatter.title}</h1>
          <p>By {frontMatter.author}</p>
          <div>
            <ReactMarkdown children={markdownBody} />
          </div>
        </article>
      </Layout>
    )
}

export async function getStaticProps({ ...ctx }) {
    const { postname } = ctx.params

    const content = await import(`../../posts/${postname}.md`)
    const config = await import(`../../siteconfig.json`)
    const data = matter(content.default)

    return {
        props: {
            siteTitle: config.title,
            frontMatter: data.data,
            markdownBody: data.content,
        },
    }
}

export async function getStaticPaths() {
  const blogSlugs = ((context) => {
    const keys = context.keys()
    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)

      return slug
    })
    return data
  })(require.context('../../posts', true, /\.md$/))

  const paths = blogSlugs.map((slug) => `/post/${slug}`)

  return {
    paths,
    fallback: false,
  }
}