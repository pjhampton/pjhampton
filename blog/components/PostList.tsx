import Link from 'next/link'
import { PostGroup } from '../components/types'

interface PostListProps {
  posts: PostGroup;
}

export default function PostList({ posts }: PostListProps) {

  const formatDate = (date: string) =>
    date.split("-").reverse().join(" ")

  return (
    <>
      {!posts && <div>No Posts yet</div>}
      {posts && 
        Object.keys(posts).reverse().map(function(key, index) {
          const articles = posts[key];
          const articleDetail = articles.map((post) => {
            return (
              <li key={post.slug} id={post.slug} style={{paddingBottom: '.15em'}}>
                <span style={{width: "97px", display: "inline-block"}}>{formatDate(post.frontMatter.date)}</span> ~{' '} 
                <Link href={{ pathname: `/post/${post.slug}` }}>
                  <a>{post.frontMatter.title}</a>
                </Link>
              </li>
            )
          })
          return (
            <div key={key} id={key}>
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
