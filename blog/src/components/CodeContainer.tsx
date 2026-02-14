import { useState, useEffect } from 'preact/hooks';
import { CopyIcon } from './Icons';

function CodeBlock({
  className,
  inline,
  children,
  ...props
}: any) {
  const [copied, setCopied] = useState(false);
  const [Highlighter, setHighlighter] = useState<any>(null);
  const [highlightStyle, setHighlightStyle] = useState<any>(null);
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\r?\n$/, '');
  const isOneLine = !codeContent.includes('\n');

  useEffect(() => {
    if (!inline && match && !Highlighter) {
      Promise.all([
        import('react-syntax-highlighter'),
        import('react-syntax-highlighter/dist/esm/styles/prism')
      ]).then(([mod, styles]) => {
        setHighlighter(() => mod.Prism);
        setHighlightStyle(styles.atomDark);
      });
    }
  }, [inline, match, Highlighter]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!inline && match) {
    return (
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
            (e.currentTarget as HTMLElement).style.background =
              'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              'rgba(0, 0, 0, 0.7)';
          }}
          title="Copy code"
        >
          <CopyIcon size={16} style={{ color: '#ffffff' }} />
        </button>
        {copied && <span className="copied-animation-code">Copied!</span>}
        {Highlighter && highlightStyle ? (
          <Highlighter
            language={match[1]}
            PreTag="div"
            style={highlightStyle}
            wrapLines={false}
          >
            {codeContent}
          </Highlighter>
        ) : (
          <pre style={{
            backgroundColor: 'rgb(29, 31, 33)',
            padding: '1em',
            borderRadius: '5px',
            color: '#ccc',
            overflow: 'auto'
          }}>
            <code>{codeContent}</code>
          </pre>
        )}
      </div>
    );
  }

  return (
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
