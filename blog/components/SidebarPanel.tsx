import avatar from '@public/avatar.png'
import ThemeToggle from './ThemeToggle'
import SiteImage from '@components/SiteImage'

interface SidebarPanelProps {
  toggleMenu: () => void;
}

const SidebarPanel = ({ toggleMenu } : SidebarPanelProps) => {
  return (
    <div className='fixed sidepanel'>
      <button className="p-2.5" onClick={toggleMenu}>
        <SiteImage 
          alt='PJ Hampton Avatar'
          className=' p-1.5 rounded-full' 
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

export default SidebarPanel
