import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FaGithub, FaSpeakerDeck, FaLinkedin } from 'react-icons/fa'

interface Props {
  isSidebar: boolean;
}

const SocialIcons = ({ isSidebar } : Props) => {
  const { theme } = useTheme();

  const socialHighlight = 
    (isSidebar && theme == 'dark') ? 'text-slate-200' : '';

  return (
    <div className='inline-flex pt-4'>
      <div className='pl-2 pr-2'>
        <Link 
          href={'https://github.com/pjhampton'} 
          target='_blank' 
          rel='noreferrer' 
          aria-label='Pete Hampton Github'>
          <FaGithub 
            size={35} 
            className={`hover:opacity-80 ${socialHighlight}`} />
        </Link>
      </div>

      <div className='pl-2 pr-2'>
        <Link
          href={'https://www.linkedin.com/in/pjhampton/'}
          target='_blank'
          rel='noreferrer'
          aria-label='Pete Hampton LinkedIn'>
          <FaLinkedin 
            size={35} 
            className={`hover:opacity-80 ${socialHighlight}`} />
        </Link>
      </div>

      <div className='pl-2 pr-2'>
        <Link
          href={'https://speakerdeck.com/pjhampton'}
          target='_blank'
          rel='noreferrer'
          aria-label='Pete Hampton SpeakerDeck'>
          <FaSpeakerDeck 
            size={38} 
            className={`hover:opacity-80 ${socialHighlight}`} />
        </Link>
      </div>
    </div>
  )
}

export default React.memo(SocialIcons)
