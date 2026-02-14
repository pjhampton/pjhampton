import Layout from '../components/Layout';
import PostList from '../components/PostList';
import { getSortedPosts, groupPostsByYear } from '../utils/posts';

interface Props {
  path?: string;
}

export default function Index(_props: Props) {
  const posts = getSortedPosts();
  const groupedPosts = groupPostsByYear(posts);

  return (
    <Layout pageTitle="Pete Hampton" showShare={false}>
      <main>
        <PostList posts={groupedPosts} />
      </main>
    </Layout>
  );
}
