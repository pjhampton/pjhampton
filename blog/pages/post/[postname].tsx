import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { PostProps } from '../../@types/post'
import Layout from '@components/Layout'
import { formatDate } from '@utils/datetime'
import CodeContainer from '@components/CodeContainer'
import { NextSeo } from 'next-seo'

export default function BlogPost({ siteTitle, frontMatter, markdownBody } : PostProps) {
  
  if (!frontMatter) return <></>

  return (
    <>
      <NextSeo
        title={`Pete Hampton - ${frontMatter.title}`}
        description={frontMatter.excerpt} />
      <Layout pageTitle={`${siteTitle} | ${frontMatter.title}`}>
        <article>
          <div className='pb-3'>
            <h1 className='text-3xl font-medium'>{frontMatter.title}</h1>
            <p>⚡️ <span className='font-semibold'>{frontMatter.author}</span> • {formatDate(frontMatter.date)}</p>
          </div>
          <div className='post'>
            <ReactMarkdown components={CodeContainer}>{markdownBody}</ReactMarkdown>
          </div>
          {frontMatter.show_post_footer &&
          <div className='mb-10 post-footer'>
            <hr className="footer" />
            <h2 className='special'>~ Feedback</h2>

            <p>Like to offer feedback or ideas? Then please email me at <span className='font-semibold'>pjhampton[@]duck.com</span></p>
          </div>}
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
      siteTitle: 'Pete Hampton\'s Blog',
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
