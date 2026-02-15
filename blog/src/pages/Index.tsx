import { useEffect } from 'preact/hooks';
import PostList from '../components/PostList';
import { getSortedPosts, groupPostsByYear } from '../utils/posts';

interface Props {
  path?: string;
}

export default function Index(_props: Props) {
  const posts = getSortedPosts();
  const groupedPosts = groupPostsByYear(posts);

  useEffect(() => {
    document.title = "Pete Hampton's blog";
  }, []);

  return (
    <main>
      <PostList posts={groupedPosts} />
    </main>
  );
}
