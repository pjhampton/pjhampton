import { NextSeo } from 'next-seo'
import Layout from '@components/Layout'
import PostList from '@components/PostList'
import { PostGroup } from '../@types/post'
import generateRssFeed from '@utils/generateRSSFeed'
import { getSortedPosts, groupPostsByYear  } from '@utils/posts'

interface IndexProps {
  title: string;
  posts: PostGroup;
}

export default function Index({ posts } : IndexProps) {

  return (
    <>
      <NextSeo
        title='Pete Hampton - Software Engineer'
        description={`Pete Hampton is a Software Engineer and freelance consultant from Belfast, N. Ireland. 
                      He mainly works with Java and TypeScript, and enjoys databases and digital signal processing.`} />
      <Layout pageTitle={'Pete Hampton'} showShare={false}>
      <main>
        <PostList posts={posts} />
      </main>
    </Layout>
    </>
  )
}

export async function getStaticProps() {
  await generateRssFeed()

  const posts = getSortedPosts()
  const groupedPosts = groupPostsByYear(posts)

  return {
    props: {
      posts: groupedPosts,
    },
  }
}
