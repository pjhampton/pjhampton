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

      <div className="w-full max-w-6xl mx-auto px-4 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-[20rem_minmax(0,1fr)] md:gap-8">
          <aside className="hidden md:block md:sticky md:top-10 md:self-start">
            <ProfileCard showShare={showShare} />
          </aside>

          <div className="min-w-0">
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
        </div>
      </div>
    </>
  );
}
