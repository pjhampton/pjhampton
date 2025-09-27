import matter from 'gray-matter';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';

import Layout from '@components/Layout';
import { formatDate } from '@utils/datetime';
import { PostProps } from '../../@types/post';
import CodeContainer from '@components/CodeContainer';

export default function BlogPost({
  siteTitle,
  frontMatter,
  markdownBody
}: PostProps) {
  const { resolvedTheme } = useTheme();

  if (!frontMatter) return <></>;

  return (
    <>
      <NextSeo
        title={`Pete Hampton - ${frontMatter.title}`}
        description={frontMatter.excerpt}
      />
      <Layout
        pageTitle={`${siteTitle} | ${frontMatter.title}`}
        showShare={true}
      >
        <article>
          <div className="pb-3">
            <h1
              className={`text-3xl font-medium ${resolvedTheme === 'dark' ? 'cornsilk' : ''}`}
            >
              {frontMatter.title}
            </h1>
            <p>
              <span className="font-semibold">{frontMatter.author}</span> ⚡️{' '}
              {formatDate(frontMatter.date)}
            </p>
          </div>
          <div className="post">
            <ReactMarkdown components={CodeContainer}>
              {markdownBody}
            </ReactMarkdown>
          </div>
        </article>
      </Layout>
    </>
  );
}

export async function getStaticProps({ ...ctx }) {
  const { postname } = ctx.params;

  const content = await import(`../../posts/${postname}.md`);
  const data = matter(content.default);

  return {
    props: {
      siteTitle: 'Pete Hampton',
      frontMatter: data.data,
      markdownBody: data.content
    }
  };
}

export async function getStaticPaths() {
  const blogSlugs = ((context) => {
    const keys = context.keys();
    const data = keys.map((key) => {
      const slug = key.replace(/^.*[\\\/]/, '').slice(0, -3);
      return slug;
    });
    return data;
  })(require.context('../../posts', true, /\.md$/));

  const paths = blogSlugs.map((slug) => `/post/${slug}`);

  return {
    paths,
    fallback: false
  };
}
