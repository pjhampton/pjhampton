import { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CodeComponentProps = JSX.IntrinsicElements['code'] &
  ReactMarkdownProps & {
    inline?: boolean;
  };

function CodeBlock({
  className,
  inline,
  children,
  ...props
}: CodeComponentProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\r?\n$/, '');
  const isOneLine = !codeContent.includes('\n');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return !inline && match ? (
    <div style={{ position: 'relative' }}>
      <button
        onClick={copyToClipboard}
        style={{
          position: 'absolute',
          top: isOneLine ? '50%' : '8px',
          right: '8px',
          transform: isOneLine ? 'translateY(-50%)' : 'none',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '6px',
          cursor: 'pointer',
          zIndex: 1,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
        }}
        title="Copy code"
      >
        <MdContentCopy size={16} style={{ color: '#ffffff' }} />
      </button>
      {copied && <span className="copied-animation-code">Copied!</span>}
      <SyntaxHighlighter
        language={match[1]}
        PreTag="div"
        style={atomDark}
        wrapLines={false}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      className={className}
      style={{
        backgroundColor: 'rgb(29, 31, 33)',
        padding: '5px',
        borderRadius: '5px',
        color: 'rgb(218, 208, 133)'
      }}
      {...props}
    >
      {children}
    </code>
  );
}

const CodeContainer = {
  code: CodeBlock
};

export default CodeContainer;
