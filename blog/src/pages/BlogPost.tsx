import { useEffect } from 'preact/hooks';
import ReactMarkdown from 'react-markdown';

import Layout from '../components/Layout';
import { formatDate } from '../utils/datetime';
import CodeContainer from '../components/CodeContainer';
import PostNavigation from '../components/PostNavigation';
import { getSortedPosts } from '../utils/posts';
import { useTheme } from '../utils/theme';

interface Props {
  path?: string;
  postname?: string;
}

export default function BlogPost({ postname }: Props) {
  const { resolvedTheme } = useTheme();
  const allPosts = getSortedPosts();
  const currentPostIndex = allPosts.findIndex((post) => post.slug === postname);

  const post = allPosts[currentPostIndex];

  useEffect(() => {
    if (post) {
      document.title = `Pete Hampton - ${post.frontMatter.title}`;
    }
  }, [post]);

  if (!post) return <div>Post not found</div>;

  const previousPost =
    currentPostIndex < allPosts.length - 1
      ? allPosts[currentPostIndex + 1]
      : undefined;
  const nextPost =
    currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : undefined;

  const frontMatter = post.frontMatter;
  const markdownBody = post.markdownBody;

  return (
    <Layout
      pageTitle={`Pete Hampton | ${frontMatter.title}`}
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
  );
}
