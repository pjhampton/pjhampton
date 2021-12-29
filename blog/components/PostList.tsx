import Link from 'next/link'
import { Post } from '../components/types'
import { DateFormatter } from '../utils/dates'

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {

  return (
    <div>
      {!posts && <div>No Posts</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts &&
          posts.map((post) => {
            return (
              <li key={post.slug}>
                  {DateFormatter(post.frontMatter.date)} -{' '} 
                  <Link href={{ pathname: `/post/${post.slug}` }}>
                    <a>{post.frontMatter.title}</a>
                  </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
