import Link from 'next/link'
import { FaGithub, FaSpeakerDeck, FaLinkedin, FaAngellist, FaProductHunt } from 'react-icons/fa'

const SocialIcons = () => {
  return (
    <div className='inline-flex pt-5'>
      <div className='pr-4'>
        <Link href={'https://github.com/pjhampton'}>
          <a target='_blank' rel='noreferrer'>
            <FaGithub size={35} className="hover:opacity-80" />
          </a>
        </Link>
      </div>

      <div className='pr-4'>
        <Link href={'https://www.linkedin.com/in/pjhampton/'}>
          <a target='_blank' rel='noreferrer'>
            <FaLinkedin size={35} className="hover:opacity-80" />
          </a>
        </Link>
      </div>

      <div className='pr-4'>
        <Link href={'https://speakerdeck.com/pjhampton'}>
          <a target='_blank' rel='noreferrer'>
            <FaSpeakerDeck size={38} className="hover:opacity-80" />
          </a>
        </Link>
      </div>

      <div className='pr-4'>
        <Link href={'https://angel.co/u/pjhampton'}>
          <a target='_blank' rel='noreferrer'>
            <FaAngellist size={35} className="hover:opacity-80" />
          </a>
        </Link>
      </div>

      <div className='pr-4'>
        <Link href={'https://www.producthunt.com/@pete_hampton'}>
          <a target='_blank' rel='noreferrer'>
            <FaProductHunt size={35} className="hover:opacity-80" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SocialIcons
