import { memo } from 'preact/compat';

import SocialIcons from './SocialIcons';
import ThemeToggle from './ThemeToggle';
import { Orb } from './Orb';

interface Props {
  menuOpenState: boolean;
  setMenuOpenState: (open: boolean) => void;
}

const SidebarMenu = ({ menuOpenState, setMenuOpenState }: Props) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${menuOpenState ? 'sidebar-overlay--open' : ''}`}
        onClick={() => setMenuOpenState(false)}
      />

      {/* Menu panel */}
      <nav className={`sidebar-menu ${menuOpenState ? 'sidebar-menu--open' : ''}`}>
        <button
          className="sidebar-close"
          onClick={() => setMenuOpenState(false)}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className="p-2 pt-6">
          <a href="/" className="pt-10">
            <div className="flex justify-center">
              <Orb className="w-32 h-32" />
            </div>
          </a>
        </div>

        <div className="p-6 pt-6 space-y-4 text-center">
          <figcaption className="font-medium">
            <div className="text-sky-500 dark:text-sky-400">Pete Hampton</div>
            <div className="text-slate-700 dark:text-slate-500">
              Code Zookeeper
            </div>
          </figcaption>
        </div>

        <div className="pt-12">
          <SocialIcons isSidebar={true} />
        </div>

        <div className="pt-12 text-center">
          <div className="inline-flex m-auto">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(SidebarMenu);
