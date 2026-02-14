import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

import ProfileCard from './ProfileCard';
import SidebarMenu from './SidebarMenu';
import { Orb } from './Orb';

interface Props {
  pageTitle: string;
  showShare: boolean;
  children: ComponentChildren;
}

export default function Layout({ children, showShare }: Props) {
  const [menuOpenState, setMenuOpenState] = useState(false);

  return (
    <>
      <div className="visible md:hidden">
        <SidebarMenu
          menuOpenState={menuOpenState}
          setMenuOpenState={setMenuOpenState}
        />
      </div>

      <div className="container w-full mx-auto md:pt-10 md:max-w-6xl">
        <span className="grid grid-cols-12">
          <div className="hidden md:block">
            <div className="col-start-1 col-end-4">
              <ProfileCard showShare={showShare} />
            </div>
          </div>

          <div className="col-span-full px-4 md:px-0 md:col-span-auto md:col-start-5 md:col-end-12">
            <div className="visible md:hidden">
              <button
                className="pt-2.5 cursor-pointer"
                onClick={() => setMenuOpenState(!menuOpenState)}
                aria-label="toggle menu on smaller devices"
              >
                <div className="p-1">
                  <Orb className="w-20 h-20" />
                </div>
              </button>
            </div>

            <section>{children}</section>
          </div>
        </span>
      </div>
    </>
  );
}
