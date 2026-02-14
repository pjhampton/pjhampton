import { memo } from 'preact/compat';
import { useTheme } from '../utils/theme';
import { formatDate } from '../utils/datetime';
import type { PostGroup } from '../types/post';

interface Props {
  posts: PostGroup;
}

const PostList = ({ posts }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {!posts && <div>No Posts available</div>}

      {posts &&
        Object.keys(posts)
          .reverse()
          .map((key) => {
            const articles = posts[key];
            const articleDetail = articles.map((post) => {
              return (
                <li
                  key={post.slug}
                  id={post.slug}
                  style={{ paddingBottom: '.15em' }}
                >
                  <span className="hidden md:inline-block">
                    <span style={{ width: '97px', display: 'inline-block' }}>
                      {formatDate(post.frontMatter.date)}
                    </span>
                    &nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;
                  </span>
                  <a href={`/post/${post.slug}`}>
                    {post.frontMatter.title}
                  </a>
                </li>
              );
            });
            return (
              <div className="postList" key={key} id={key}>
                <h1
                  className={`special ${resolvedTheme === 'dark' ? 'cornsilk' : 'navy'}`}
                >
                  {key}
                </h1>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {articleDetail}
                </ul>
              </div>
            );
          })}
    </>
  );
};

export default memo(PostList);
