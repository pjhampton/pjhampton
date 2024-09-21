import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import type { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type CodeComponentProps = JSX.IntrinsicElements['code'] &
  ReactMarkdownProps & {
    inline?: boolean;
  };

const CodeContainer = {
  code({ className, inline, children, ...props }: CodeComponentProps) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        language={match[1]}
        PreTag='div'
        style={atomDark}
        wrapLines={false}>
        {String(children).replace(/\r?\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} style={{
        backgroundColor: 'rgb(29, 31, 33)',
        padding: '5px',
        borderRadius: '5px',
        color: 'rgb(218, 208, 133)'
      }} {...props}>
        {children}
      </code>
    );
  }
}

export default CodeContainer
