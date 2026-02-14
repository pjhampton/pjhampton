import { memo } from 'preact/compat';
import { useTheme } from '../utils/theme';

import ShareUrl from './ShareUrl';
import SocialIcons from './SocialIcons';
import ThemeToggle from './ThemeToggle';
import { Orb } from './Orb';

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
          <a href="/" className="inline-flex cursor-pointer" aria-label="return home">
            <div className="mx-auto mt-6 mb-1 transition-transform hover:scale-[1.03] active:scale-[0.98]">
              <Orb className="w-[150px] h-[150px]" />
            </div>
          </a>
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
        <figure className="p-8 mt-4 text-center bg-white rounded-lg h-28 md:p-0 w-80">
          <div className="pt-4 space-y-3 text-center">
            <figcaption className="font-medium uppercase">
              <div className="text-slate-700">Share</div>
            </figcaption>
          </div>

          <ShareUrl />
        </figure>
      )}
    </span>
  );
};

export default memo(ProfileCard);
