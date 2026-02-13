import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';

function ShareUrl() {
  const [isCopied, setIsCopied] = useState(false);

  const getUrl = () => `https://pjhampton.com${window.location.pathname}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getUrl());
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={getUrl()}
        readOnly
        onClick={copyToClipboard}
        className="bg-white url-input"
      />

      {isCopied && <span className="copied-animation">Copied!</span>}
    </div>
  );
}

export default memo(ShareUrl);
