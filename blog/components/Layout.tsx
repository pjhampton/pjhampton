import { ReactChildren, ReactChild, useEffect, useState } from 'react'

import NavLink from '@components/NavLink'
import ProfileCard from '@components/ProfileCard'
import SidebarMenu from '@components/SidebarMenu'
import SidebarPanel from '@components/SidebarPanel'

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
      {isMounted &&
      <>
        <div className='visible md:invisible'>
          <SidebarMenu menuOpenState={menuOpenState} setMenuOpenState={setMenuOpenState} />
          <SidebarPanel toggleMenu={() => setMenuOpenState(!menuOpenState)} />
        </div>
        
        <div className='container w-full pt-10 mx-auto md:max-w-6xl'>
          <span className='grid grid-cols-12'>
            
            <div className='hidden md:block'>
              <div className='col-start-1 col-end-4'>
                <ProfileCard showShare={showShare} />
              </div>
            </div>

            <div className='col-start-4 col-end-12 md:col-start-5'>
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
              
              <section>
                {children}
              </section>
            </div>
          </span>
        </div>
      </>
      } 
    </>
  )
}
