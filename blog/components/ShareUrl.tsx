import { useRouter } from 'next/router';
import React, { useState } from 'react';

function ShareUrl() {
  const { asPath } = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const getUrl = () => `https://pjhampton.com${asPath}`;

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

export default React.memo(ShareUrl);
