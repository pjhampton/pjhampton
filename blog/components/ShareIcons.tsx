import Link from 'next/link'
import { useRouter } from 'next/router';
import { FaSquareXTwitter, FaSquareReddit } from "react-icons/fa6";

interface ShareIconsProps {
  pageTitle: string;
}

const ShareIcons = ({ pageTitle } : ShareIconsProps) => {
  const { asPath } = useRouter()
  
  const getUrl = () =>
    encodeURIComponent(`https://pjhampton.com${asPath}`)

  const getPostTitle = () =>
    encodeURIComponent(pageTitle)

  const getBoilerplatePost = () => `${getPostTitle()} ${getUrl()}`

  return (
    <div className='inline-flex'>
      <div className='pl-2 pr-2'>
        <Link
          href={`https://x.com/intent/tweet?text=${getBoilerplatePost()}`}
          target='_blank'
          rel='noreferrer'
          aria-label='Share on X'>
          <FaSquareXTwitter size={42} className="hover:opacity-80" />
        </Link>
      </div>

      <div className='pb-4 pl-2 pr-2'>
        <Link 
          href={`https://reddit.com/submit?url=${getUrl()}&title=${getPostTitle()}`} 
          target='_blank' 
          rel='noreferrer' 
          aria-label='Share on Reddit'>
          <FaSquareReddit size={42} className="hover:opacity-80" style={{color: "#FF5700"}} />
        </Link>
      </div>
    </div>
  );
}

export default ShareIcons
