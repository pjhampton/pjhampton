import Link from 'next/link'
import { PostGroup } from '../components/types'
import { DateFormatter } from '../utils/dates'

interface PostListProps {
  posts: PostGroup;
}

export default function PostList({ posts }: PostListProps) {

  return (
    <>
      {!posts && <div>No Posts yet</div>}
      {posts && 
        Object.keys(posts).reverse().map(function(key, index) {
          const articles = posts[key];
          const articleDetail = articles.map((post) => {
            return (
              <li key={post.slug} id={post.slug} style={{paddingBottom: '.15em'}}>
                {DateFormatter(post.frontMatter.date)} -{' '} 
                <Link href={{ pathname: `/post/${post.slug}` }}>
                  <a>{post.frontMatter.title}</a>
                </Link>
              </li>
            )
          })
          return (
            <div key={key}>
              <h1 className="special heading">{key}</h1>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {articleDetail}
              </ul>
            </div>
          )
        })
      }
    </>
  )
}
