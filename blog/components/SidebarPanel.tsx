import React from 'react'
import SiteImage from '@components/SiteImage'

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
    </div>
  )
}

export default React.memo(SidebarPanel)
