import React from 'react';
import Link from 'next/link'
import { useTheme } from 'next-themes';
import { PostGroup } from '../@types/post'
import { formatDate } from '@utils/datetime'

interface Props {
  posts: PostGroup;
}

const PostList = ({ posts }: Props) => {
  const { resolvedTheme } = useTheme()

  return <>
    {!posts && <div>No Posts available</div>}
    
    {posts && 
      Object.keys(posts).reverse().map((key) => {
        const articles = posts[key];
        const articleDetail = articles.map((post) => {
          return (
            <li key={post.slug} id={post.slug} style={{paddingBottom: '.15em'}}>
              <span className="hidden md:inline-block">
                <span style={{width: '97px', display: 'inline-block'}}>
                  {formatDate(post.frontMatter.date)}
                </span>
                &nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;
              </span>
              <Link href={{ pathname: `/post/${post.slug}` }} legacyBehavior>
                {post.frontMatter.title}
              </Link>
            </li>
          );
        })
        return (
          <div className='postList' key={key} id={key}>
            <h1 className={`special ${resolvedTheme === 'dark' ? 'cornsilk' : 'navy' }`}>{key}</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {articleDetail}
            </ul>
          </div>
        )
      })
    }
  </>;
}

export default React.memo(PostList)
