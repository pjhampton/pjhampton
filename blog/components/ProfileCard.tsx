import React from 'react'
import Link from 'next/link'
import FadeIn from 'react-fade-in'
import { motion } from "framer-motion"

import ShareUrl from '@components/ShareUrl'
import SiteImage from '@components/SiteImage'
import SocialIcons from '@components/SocialIcons'
import ThemeToggle from '@components/ThemeToggle'

import avatar from '@public/avatar.webp'

interface Props {
  showShare: boolean;
}

const ProfileCard = ({ showShare = false } : Props) => {

  return (
    <span style={{position: 'fixed'}}>
      <figure className='p-8 text-center bg-white rounded-xl md:p-0 w-80 h-96'>

      <div style={{ position: 'absolute', right: 0 }}>
        <ThemeToggle />
      </div>

      <span className='p-2 pt-6'>
        <Link href="/" className='inline-flex' aria-label='return home'>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <SiteImage 
              alt='Pete Hampton Avatar' 
              className='mx-auto mt-6 mb-1 rounded-xl' 
              src={avatar}
              width={150} 
              height={150} />
          </motion.div>
        </Link>
      </span>

      <div className='p-6 pt-8 space-y-4 text-center'>
        <figcaption className='font-medium'>
          <div className='text-sky-500'>
            Pete Hampton
          </div>
          <div className='text-slate-700'>
            Code Zookeeper
          </div>
        </figcaption>
      </div>

      <SocialIcons 
        isSidebar={false} />
    </figure>

    {showShare &&
    <FadeIn className='visible xs:invisible'>
      <figure className='p-8 mt-4 text-center bg-white rounded-xl md:p-0 w-80 h-23'>

        <div className='pt-4 space-y-3 text-center'>
          <figcaption className='font-medium uppercase'>
            <div className='text-slate-700'>
              Share this post
            </div>
          </figcaption>
        </div>

        <ShareUrl />
        
      </figure>
    </FadeIn>}
  </span>
  );
}

export default React.memo(ProfileCard);
