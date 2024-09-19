import React from 'react'
import SiteImage from '@components/SiteImage'
import ThemeToggle from '@components/ThemeToggle'

import avatar from '@public/avatar.webp'

interface Props {
  toggleMenu: () => void;
}

const SidebarPanel = ({ toggleMenu } : Props) => {
  return (
    <div className='fixed sidepanel'>
      <button className="p-2.5" onClick={toggleMenu} aria-label="toggle menu">
        <SiteImage 
          alt='PJ Hampton Avatar'
          className=' p-1.5 rounded-xl' 
          src={avatar} 
          width='80'
          height='80'  />
      </button>

      <div className="absolute bottom-0 w-full">
        <div className='block text-center'>
          <div className='inline-block m-auto'>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SidebarPanel)
