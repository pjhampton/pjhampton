import React from 'react';
import Link from 'next/link';
import FadeIn from 'react-fade-in';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import ShareUrl from '@components/ShareUrl';
import SocialIcons from '@components/SocialIcons';
import ThemeToggle from '@components/ThemeToggle';
import { Orb } from '@components/Orb';

interface Props {
  showShare: boolean;
}

const ProfileCard = ({ showShare = false }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <span style={{ position: 'fixed' }}>
      <figure className="p-8 text-center bg-white rounded-lg md:p-0 w-80 h-96">
        <div style={{ position: 'absolute', right: 0 }}>
          <ThemeToggle />
        </div>

        <span className="p-2 pt-6">
          <Link href="/" className="inline-flex" aria-label="return home">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <div className="mx-auto mt-6 mb-1">
                <Orb className="w-[150px] h-[150px]" />
              </div>
            </motion.div>
          </Link>
        </span>

        <div className="p-6 pt-8 space-y-4 text-center">
          <figcaption className="font-medium">
            <div className="text-black font-bold text-[1.2rem]">
              Pete Hampton
            </div>
            <div className="text-slate-700">Code Zookeeper</div>
          </figcaption>
        </div>

        <SocialIcons isSidebar={false} />
      </figure>

      {showShare && (
        <FadeIn className="visible xs:invisible">
          <figure className="p-8 mt-4 text-center bg-white rounded-lg h-28 md:p-0 w-80">
            <div className="pt-4 space-y-3 text-center">
              <figcaption className="font-medium uppercase">
                <div className="text-slate-700">Share</div>
              </figcaption>
            </div>

            <ShareUrl />
          </figure>
        </FadeIn>
      )}
    </span>
  );
};

export default React.memo(ProfileCard);
