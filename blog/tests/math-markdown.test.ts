import { describe, expect, it } from 'vitest';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function render(markdown: string, math = true, throwOnError = true) {
  return JSON.stringify(
    ReactMarkdown({
      children: markdown,
      remarkPlugins: math ? [remarkMath] : [],
      rehypePlugins: math ? [[rehypeKatex, { throwOnError }]] : []
    })
  );
}

describe('LaTeX in Markdown', () => {
  it('renders inline and display math with accessible MathML', () => {
    const output = render('Inline $x^2$.\n\n$$\n\\frac{1}{3}\n$$');
    expect(output).toContain('katex-mathml');
    expect(output).toContain('katex-display');
    expect(output).toContain('application/x-tex');
    expect(output).not.toContain('katex-error');
  });

  it('keeps literal LaTeX in code fences and inline code', () => {
    const output = render('`$x^2$`\n\n```latex\n$$\nx^2\n$$\n```');
    expect(output).toContain('$x^2$');
    expect(output).toContain('language-latex');
    expect(output).not.toContain('katex');
  });

  it('does not interpret currency in posts without math enabled', () => {
    const output = render('Costs $3.90 or $3.70 per task.', false);
    expect(output).toContain('Costs $3.90 or $3.70 per task.');
    expect(output).not.toContain('katex');
  });

  it.each([
    String.raw`L(a,b) = \sum_{i=1}^{n} (y_i-a-bx_i)^2`,
    String.raw`\begin{aligned} b &= \frac{3}{2} \\ a &= \frac{1}{3} \end{aligned}`,
    String.raw`\begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}`,
    String.raw`|r| = \begin{cases} r, & r \geq 0, \\ -r, & r < 0. \end{cases}`,
    String.raw`\int_0^1 t^2\,\mathrm{d}t = \frac{1}{3}`
  ])('renders a display expression without a KaTeX error: %s', (source) => {
    const output = render(`$$\n${source}\n$$`);
    expect(output.match(/katex-display/g)).toHaveLength(1);
    expect(output).not.toContain('katex-error');
  });

  it('leaves invalid LaTeX readable without failing the post', () => {
    const output = render('$\\notARealCommand{x}$', true, false);
    expect(output).toContain('notARealCommand');
  });
});
