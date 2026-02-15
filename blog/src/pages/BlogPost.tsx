import { useEffect } from 'preact/hooks';
import ReactMarkdown from 'react-markdown';

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
      document.title = `Pete Hampton's blog - ${post.frontMatter.title}`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.frontMatter.title,
        author: {
          '@type': 'Person',
          name: post.frontMatter.author,
        },
        datePublished: post.frontMatter.date,
        description: post.frontMatter.excerpt || post.frontMatter.description || '',
        url: `https://pjhampton.com/post/${post.slug}`,
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      script.id = 'json-ld';

      const existing = document.getElementById('json-ld');
      if (existing) {
        existing.remove();
      }
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById('json-ld');
        if (el) el.remove();
      };
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
  );
}
