import { CodeComponent } from 'react-markdown/src/ast-to-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type CodeProps = Parameters<CodeComponent>[0]

const CodeContainer = {
  code({node, inline, className, children, ...props}: CodeProps) {
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
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
}

export default CodeContainer
