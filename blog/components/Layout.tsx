import { ReactChildren, ReactChild, useEffect, useState } from 'react'

import NavLink from '@components/NavLink'
import SiteImage from '@components/SiteImage'
import ProfileCard from '@components/ProfileCard'
import SidebarMenu from '@components/SidebarMenu'

import avatar from '@public/avatar.webp'

interface Props {
  pageTitle: string;
  showShare: boolean;
  children: ReactChild | ReactChildren;
}

export default function Layout({ children, showShare } : Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpenState, setMenuOpenState] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {isMounted && <>
        <div className='container w-full mx-auto md:pt-10 md:max-w-6xl'>
          <span className='grid grid-cols-12'>
            
            <div className='hidden md:block'>
              <div className='col-start-1 col-end-4'>
                <ProfileCard showShare={showShare} />
              </div>
            </div>

            <div className='col-start-2 col-end-12 md:col-start-5'>
              <div className='hidden md:block'>
                <ul role="tablist" className='flex flex-col flex-wrap pl-0 mb-8 list-none nav nav-tabs nav-justified md:flex-row' id='tabs-tabJustify'>
                  <li className='flex-grow text-center nav-item' role='presentation'>
                    <NavLink text='Posts' href='/' otherHrefMatches={['/post']} />
                  </li>
                  <li className='flex-grow text-center nav-item' role='presentation'>
                    <NavLink text='About' href='/about' otherHrefMatches={[]} />
                  </li>
                </ul>
              </div>
              
              <div className='visible md:hidden'>
                <SidebarMenu 
                  menuOpenState={menuOpenState} 
                  setMenuOpenState={setMenuOpenState} /> 
                <button 
                  className="pt-2.5" 
                  onClick={() => setMenuOpenState(!menuOpenState)} 
                  aria-label="toggle menu on smaller devices">
                  <SiteImage 
                    alt='PJ Hampton Avatar'
                    className='p-1 rounded-xl' 
                    src={avatar} 
                    width={80}
                    height={80} />
                </button>
              </div>

              <section>
                {children}
              </section>
            </div>
          </span>
        </div>
      </>} 
    </>
  )
}
