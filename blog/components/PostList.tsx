import Link from 'next/link'
import { PostGroup } from '../@types/post'
import { formatDate } from '@utils/datetime'

interface PostListProps {
  posts: PostGroup;
}

export default function PostList({ posts }: PostListProps) {

  return (
    <>
      {!posts && <div>No Posts yet</div>}
      
      {posts && 
        Object.keys(posts).reverse().map((key, _) => {
          const articles = posts[key];
          const articleDetail = articles.map((post) => {
            return (
              <li key={post.slug} id={post.slug} style={{paddingBottom: '.15em'}}>
                <span style={{width: '97px', display: 'inline-block'}}>
                  {formatDate(post.frontMatter.date)}</span> ~&nbsp;&nbsp;&nbsp;
                <Link href={{ pathname: `/post/${post.slug}` }}>
                  <a>{post.frontMatter.title}</a>
                </Link>
              </li>
            )
          })
          return (
            <div className='postList' key={key} id={key}>
              <h1 className='special'>{key}</h1>
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
