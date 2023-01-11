import Link from 'next/link'
import SiteImage from './SiteImage'
import avatar from '@public/avatar.png'
import ThemeToggle from './ThemeToggle'
import SocialIcons from './SocialIcons'
import { push as Menu } from 'react-burger-menu'
import { Dispatch, SetStateAction } from 'react'

interface SidebarMenuProps {
  menuOpenState: boolean;
  setMenuOpenState: Dispatch<SetStateAction<boolean>>;
}

const SidebarMenu = ({menuOpenState, setMenuOpenState} : SidebarMenuProps) => {
  return (
    <Menu
      isOpen={menuOpenState}
      onStateChange={(state) => setMenuOpenState(state.isOpen)}
      customBurgerIcon={false}>
      <div className='p-2 pt-6'>
        <Link href="/" className='pt-10'>

          <SiteImage className='object-center w-24 h-24 mx-auto rounded-full' src={avatar} alt='PJ Hampton Avatar' />

        </Link>
      </div>

      <div className='p-6 pt-6 space-y-4 text-center'>
        <figcaption className='font-medium'>
          <div className='text-sky-500 dark:text-sky-400'>
            Pete Hampton
          </div>
          <div className='text-slate-700 dark:text-slate-500'>
            Code Zookeeper
          </div>
        </figcaption>
      </div>

      <Link href="/" id="posts" className="block menu-item">
        Posts
      </Link>
      
      <Link href="/about" id="about" className="block menu-item">
        About
      </Link>

      <div className="pt-12">
        <SocialIcons />
      </div>
    </Menu>
  );
}

export default SidebarMenu
