import Link from 'next/link'
import { FaGithub, FaSpeakerDeck, FaLinkedin, FaAngellist, FaProductHunt } from 'react-icons/fa'

const SocialIcons = () => {
  return (
    <div className='inline-flex pt-5'>
      <div className='pl-2 pr-2'>
        <Link 
          href={'https://github.com/pjhampton'} 
          target='_blank' 
          rel='noreferrer' 
          aria-label='Pete Hampton Github'>
          <FaGithub size={35} className="hover:opacity-80" />
        </Link>
      </div>

      <div className='pl-2 pr-2'>
        <Link
          href={'https://www.linkedin.com/in/pjhampton/'}
          target='_blank'
          rel='noreferrer'
          aria-label='Pete Hampton LinkedIn'>
          <FaLinkedin size={35} className="hover:opacity-80" />
        </Link>
      </div>

      <div className='pl-2 pr-2'>
        <Link
          href={'https://speakerdeck.com/pjhampton'}
          target='_blank'
          rel='noreferrer'
          aria-label='Pete Hampton SpeakerDeck'>
          <FaSpeakerDeck size={38} className="hover:opacity-80" />
        </Link>
      </div>

      <div className='pl-2 pr-2'>
        <Link
          href={'https://www.producthunt.com/@pjhampton'}
          target='_blank'
          rel='noreferrer'
          aria-label='Pete Hampton ProductHunt'>
          <FaProductHunt size={35} className="hover:opacity-80" />
        </Link>
      </div>
    </div>
  );
}

export default SocialIcons
