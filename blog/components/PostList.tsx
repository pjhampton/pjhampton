import Link from 'next/link'
import { PostGroup } from '../@types/post'
import { formatDate } from '@utils/datetime'
import { useTheme } from 'next-themes';

interface PostListProps {
  posts: PostGroup;
}

export default function PostList({ posts }: PostListProps) {
  const { theme } = useTheme()

  return <>
    {!posts && <div>No Posts available</div>}
    
    {posts && 
      Object.keys(posts).reverse().map((key, _) => {
        const articles = posts[key];
        const articleDetail = articles.map((post) => {
          return (
            <li key={post.slug} id={post.slug} style={{paddingBottom: '.15em'}}>
              <span style={{width: '97px', display: 'inline-block'}}>
                {formatDate(post.frontMatter.date)}</span> ~&nbsp;&nbsp;&nbsp;
              <Link href={{ pathname: `/post/${post.slug}` }} legacyBehavior>
                {post.frontMatter.title}
              </Link>
            </li>
          );
        })
        return (
          <div className='postList' key={key} id={key}>
            <h1 className={`special ${theme === 'dark' ? 'cornsilk' : '' }`}>{key}</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {articleDetail}
            </ul>
          </div>
        )
      })
    }
  </>;
}
