import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FaGithub, FaSpeakerDeck } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface Props {
  isSidebar: boolean;
}

const SocialIcons = ({ isSidebar }: Props) => {
  const { resolvedTheme } = useTheme();

  const socialHighlight =
    isSidebar && resolvedTheme == 'dark' ? 'text-slate-200' : '';

  return (
    <div className="inline-flex pt-4">
      <div className="pl-2 pr-2">
        <Link
          href={'https://github.com/pjhampton'}
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton Github"
        >
          <FaGithub
            size={35}
            className={`hover:opacity-80 ${socialHighlight}`}
          />
        </Link>
      </div>

      <div className="pl-2 pr-2">
        <Link
          href={'https://x.com/_pjhampton'}
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton X (Twitter)"
        >
          <FaXTwitter
            size={35}
            className={`hover:opacity-80 ${socialHighlight}`}
          />
        </Link>
      </div>

      <div className="pl-2 pr-2">
        <Link
          href={'https://speakerdeck.com/pjhampton'}
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton SpeakerDeck"
        >
          <FaSpeakerDeck
            size={48}
            className={`hover:opacity-80 ${socialHighlight} -mt-2`}
          />
        </Link>
      </div>
    </div>
  );
};

export default React.memo(SocialIcons);
