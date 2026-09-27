# Blog

Static blog built with Preact, Vite, and TypeScript.

```bash
cd blog
npm install
npm run dev     # Start dev server
```

```bash
npm run build   # Build for production
npm run preview # Run production build
```

## Interactive 3D charts

Use a `chart3d` fenced block in a Markdown post. Set `color` to a three or six
digit hex colour; the line, points, legend, and selection accents use it together.

````markdown
```chart3d
{
  "color": "#b84f35",
  "points": [
    { "name": "Deep", "tokens": 120000, "cost": 7.6, "score": 88 },
    { "name": "Brief", "tokens": 12000, "cost": 1.2, "score": 49 }
  ]
}
```
````

For separate colours in light and dark mode, use:

```json
"color": { "light": "#b84f35", "dark": "#ff8668" }
```

Omit `color` to keep the default theme colours. Invalid colours fall back to
the defaults. Existing blocks containing just an array of points still work.

## Mathematics

Add `math: true` to a post's front matter to enable LaTeX rendering with KaTeX.
Use `$...$` for inline mathematics and `$$` on separate lines for display equations:

````markdown
The prediction is $\hat{y} = a + bx$.

$$
L(a,b) = \sum_{i=1}^{n} (y_i - a - bx_i)^2
$$
````

Code fences keep their literal source. Escape a literal dollar sign as `\$` in
math-enabled prose. Posts without `math: true` keep normal Markdown handling,
including currency amounts. The original LaTeX is retained in Markdown exports.
