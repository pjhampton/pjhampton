import { memo } from 'preact/compat';
import { GitHubIcon, XTwitterIcon, SpeakerDeckIcon } from './Icons';

interface Props {
  isSidebar: boolean;
}

const SocialIcons = ({ isSidebar }: Props) => {
  const iconClass = isSidebar
    ? 'text-black dark:text-slate-500 hover:opacity-80'
    : 'text-black hover:opacity-80';

  return (
    <div className="inline-flex items-center pt-4">
      <div className="pl-2 pr-2">
        <a
          href="https://github.com/pjhampton"
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton Github"
        >
          <GitHubIcon size={24} className={iconClass} />
        </a>
      </div>

      <div className="pl-2 pr-2">
        <a
          href="https://x.com/pjhampton"
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton X (Twitter)"
        >
          <XTwitterIcon size={24} className={iconClass} />
        </a>
      </div>

      <div className="pl-2 pr-2">
        <a
          href="https://speakerdeck.com/pjhampton"
          target="_blank"
          rel="noreferrer"
          aria-label="Pete Hampton SpeakerDeck"
        >
          <SpeakerDeckIcon size={30} className={iconClass} />
        </a>
      </div>
    </div>
  );
};

export default memo(SocialIcons);
