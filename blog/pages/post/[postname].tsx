import matter from 'gray-matter'
import { NextSeo } from 'next-seo'
import Layout from '@components/Layout'
import ReactMarkdown from 'react-markdown'
import { formatDate } from '@utils/datetime'
import { PostProps } from '../../@types/post'
import CodeContainer from '@components/CodeContainer'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function BlogPost({ siteTitle, frontMatter, markdownBody } : PostProps) {
  const { theme } = useTheme();

  if (!frontMatter) return <></>

  return (
    <>
      <NextSeo
        title={`Pete Hampton - ${frontMatter.title}`}
        description={frontMatter.excerpt} />
      <Layout pageTitle={`${siteTitle} | ${frontMatter.title}`} showShare={true}>
        <article>
          <div className='pb-3'>
            <h1 className={`text-3xl font-medium ${theme === 'dark' ? 'cornsilk' : '' }`}>{frontMatter.title}</h1>
            <p><span className='font-semibold'>{frontMatter.author}</span> ⚡️ {formatDate(frontMatter.date)}</p>
          </div>
          <div className='post'>
            <ReactMarkdown components={CodeContainer}>{markdownBody}</ReactMarkdown>
          </div>

          {frontMatter.show_post_footer &&
          <footer className='p-4 mb-10 rounded-lg post-footer'>
            <h2 className='special'>Feedback?</h2>

            <p>Consider opening an <Link href={`https://github.com/pjhampton/pjhampton`}>issue on this repository</Link></p>
          </footer>}
        </article>
      </Layout>
    </>
  )
}

export async function getStaticProps({ ...ctx }) {
  const { postname } = ctx.params

  const content = await import(`../../posts/${postname}.md`)
  const data = matter(content.default)

  return {
    props: {
      siteTitle: 'Pete Hampton',
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
