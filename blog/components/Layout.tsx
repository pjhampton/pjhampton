import NavLink from './NavLink'
import ProfileCard from './ProfileCard'
import SidebarMenu from './SidebarMenu'
import SidebarPanel from './SidebarPanel'
import { ReactChildren, ReactChild, useEffect, useState } from 'react'

interface LayoutProps {
  pageTitle: string;
  showShare: boolean;
  children: ReactChild | ReactChildren;
}

export default function Layout({ children, showShare, pageTitle } : LayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpenState, setMenuOpenState] = useState(false)

  const toggleMenu = () => setMenuOpenState(!menuOpenState)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {isMounted &&
      <>
      <div className='visible md:invisible'>
        <SidebarMenu menuOpenState={menuOpenState} setMenuOpenState={setMenuOpenState} />
        <SidebarPanel toggleMenu={toggleMenu} />
      </div>
      
      <div className='container w-full pt-10 mx-auto md:max-w-6xl'>
        <span className='grid grid-cols-12'>
          
          <div className='hidden md:block'>
            <div className='col-start-1 col-end-4'>
              <ProfileCard showShare={showShare} pageTitle={pageTitle} />
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
