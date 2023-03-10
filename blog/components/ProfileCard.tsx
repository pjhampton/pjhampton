import Link from 'next/link'
import avatar from '@public/avatar.webp'
import SocialIcons from './SocialIcons'
import SiteImage from '@components/SiteImage'
import ThemeToggle from '@components/ThemeToggle'
import { motion } from "framer-motion";

const ProfileCard = () => {

  return (
    <figure className='p-8 text-center bg-white rounded-xl md:p-0 dark:bg-slate-800 w-80 h-96' style={{position: 'fixed'}}>

    <div style={{ position: 'absolute', right: 0 }}>
      <ThemeToggle />
    </div>

    <div className='p-2 pt-6'>
      <Link href="/" className='pt-10' aria-label='return home'>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <SiteImage 
            alt='Pete Hampton Avatar' 
            className='mx-auto rounded-full ' 
            src={avatar}
            width='150' 
            height='150' />
        </motion.div>
      </Link>
    </div>

    <div className='p-6 pt-8 space-y-4 text-center'>
      <figcaption className='font-medium'>
        <div className='text-sky-500 dark:text-sky-400'>
          Pete Hampton
        </div>
        <div className='text-slate-700 dark:text-slate-500'>
          Code Zookeeper
        </div>
      </figcaption>
    </div>

    <SocialIcons />
  </figure>
  );
}

export default ProfileCard
