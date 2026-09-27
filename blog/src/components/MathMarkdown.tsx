import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { postComponents } from './ChartBlock';
import 'katex/dist/katex.min.css';
import '../styles/math.css';

const remarkPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex];

export default function MathMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      components={postComponents}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {markdown}
    </ReactMarkdown>
  );
}
