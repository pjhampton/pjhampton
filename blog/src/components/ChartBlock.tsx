import { lazy, Suspense } from 'preact/compat';
import type { ComponentChildren } from 'preact';
import type { Element } from 'hast';
import CodeContainer from './CodeContainer';

const TradeoffChart = lazy(() => import('./TradeoffChart'));

// Read the code block at the pre level so a figure never ends up inside <pre>.
const ChartBlock = ({
  node,
  children
}: {
  node: Element;
  children?: ComponentChildren;
}) => {
  const code = node.children[0];
  if (
    code?.type === 'element' &&
    code.tagName === 'code' &&
    Array.isArray(code.properties?.className) &&
    code.properties.className.includes('language-chart3d')
  ) {
    const source = code.children
      .filter((child) => child.type === 'text')
      .map((child) => (child.type === 'text' ? child.value : ''))
      .join('');
    return (
      <Suspense fallback={<p role="status">Loading interactive chart…</p>}>
        <TradeoffChart source={source} />
      </Suspense>
    );
  }
  return <pre>{children}</pre>;
};

export const postComponents = { ...CodeContainer, pre: ChartBlock };
