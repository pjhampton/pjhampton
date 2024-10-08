import Link from 'next/link';
import { push as Menu } from 'react-burger-menu';
import React, { Dispatch, SetStateAction } from 'react';

import SiteImage from '@components/SiteImage';
import SocialIcons from '@components/SocialIcons';
import ThemeToggle from '@components/ThemeToggle';

import avatar from '@public/avatar.webp';

interface Props {
  menuOpenState: boolean;
  setMenuOpenState: Dispatch<SetStateAction<boolean>>;
}

const SidebarMenu = ({ menuOpenState, setMenuOpenState }: Props) => {
  return (
    <Menu
      isOpen={menuOpenState}
      onStateChange={(state) => setMenuOpenState(state.isOpen)}
      customBurgerIcon={false}
    >
      <div className="p-2 pt-6">
        <Link href="/" className="pt-10">
          <SiteImage
            src={avatar}
            alt="Pete Hampton Avatar"
            width={32}
            height={32}
            className="object-center w-32 h-32 mx-auto rounded-md"
          />
        </Link>
      </div>

      <div className="p-6 pt-6 space-y-4 text-center">
        <figcaption className="font-medium">
          <div className="text-sky-500 dark:text-sky-400">Pete Hampton</div>
          <div className="text-slate-700 dark:text-slate-500">
            Code Zookeeper
          </div>
        </figcaption>
      </div>

      <Link href="/" id="posts" className="block menu-item">
        Posts
      </Link>

      <Link href="/about" id="about" className="block menu-item">
        About
      </Link>

      <div className="pt-12">
        <SocialIcons isSidebar={true} />
      </div>

      <div className="pt-12 text-center">
        <div className="inline-flex m-auto">
          <ThemeToggle />
        </div>
      </div>
    </Menu>
  );
};

export default React.memo(SidebarMenu);
