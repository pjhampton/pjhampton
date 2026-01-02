import matter from 'gray-matter';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';

import Layout from '@components/Layout';
import { formatDate } from '@utils/datetime';
import { PostProps } from '../../@types/post';
import CodeContainer from '@components/CodeContainer';
import PostNavigation from '@components/PostNavigation';
import { getSortedPosts } from '@utils/posts';

export default function BlogPost({
  siteTitle,
  frontMatter,
  markdownBody,
  previousPost,
  nextPost
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
          <PostNavigation previousPost={previousPost} nextPost={nextPost} />
        </article>
      </Layout>
    </>
  );
}

export async function getStaticProps({ ...ctx }) {
  const { postname } = ctx.params;

  const content = await import(`../../posts/${postname}.md`);
  const data = matter(content.default);

  const allPosts = getSortedPosts();
  const currentPostIndex = allPosts.findIndex((post) => post.slug === postname);

  const previousPost =
    currentPostIndex < allPosts.length - 1
      ? allPosts[currentPostIndex + 1]
      : null;
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;

  return {
    props: {
      siteTitle: 'Pete Hampton',
      frontMatter: data.data,
      markdownBody: data.content,
      previousPost,
      nextPost
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
