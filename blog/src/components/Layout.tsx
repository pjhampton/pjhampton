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
            <header className="flex items-center justify-between gap-4 pt-2.5 md:hidden">
              <a
                href="/"
                className="rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-4"
                aria-label="Return home"
              >
                <Orb className="w-20 h-20" />
              </a>
              <button
                type="button"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 text-sm font-semibold cursor-pointer hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/10 dark:active:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4"
                onClick={() => setMenuOpenState((open) => !open)}
                aria-expanded={menuOpenState}
                aria-controls="mobile-menu"
              >
                <span aria-hidden="true">☰</span>
                Menu
              </button>
            </header>

            <section>{children}</section>
          </div>
        </div>
      </div>
    </>
  );
}
