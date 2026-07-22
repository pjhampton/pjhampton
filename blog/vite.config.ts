import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import type { Connect } from 'vite';

import {
  renderHomepageMarkdown,
  renderPostMarkdown,
  siteUrl
} from './scripts/post-markdown.js';

function acceptsMarkdown(accept: string | undefined): boolean {
  return (accept || '')
    .split(',')
    .map((mediaType) => mediaType.trim())
    .some((mediaType) =>
      /^(text\/markdown|text\/x-markdown)(?:\s*;|$)/i.test(mediaType)
    );
}

function markdownMiddleware(postsDir: string): Connect.NextHandleFunction {
  return (request, response, next) => {
    if (!['GET', 'HEAD'].includes(request.method || '')) return next();

    const url = new URL(request.url || '/', 'http://localhost');
    const match = url.pathname.match(/^\/post\/([^/]+)\/?$/);
    const isHomepage = url.pathname === '/';
    const requestsMarkdown =
      url.searchParams.get('format')?.toLowerCase() === 'markdown';

    if (
      (!match && !isHomepage) ||
      (!requestsMarkdown && !acceptsMarkdown(request.headers.accept))
    ) {
      return next();
    }

    if (isHomepage) {
      const posts = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
          const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
          const { data } = matter(raw);
          return { slug: file.replace(/\.md$/, ''), frontMatter: data };
        });
      const markdown = renderHomepageMarkdown(posts);

      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      response.setHeader('Content-Disposition', 'inline; filename="index.md"');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Link', `<${siteUrl}>; rel="canonical"`);
      response.setHeader('Vary', 'Accept');
      response.end(request.method === 'HEAD' ? undefined : markdown);
      return;
    }
    if (!match) return next();

    let slug: string;
    try {
      slug = decodeURIComponent(match[1]);
    } catch {
      return next();
    }
    if (!/^[a-z0-9-]+$/.test(slug)) return next();

    const postPath = path.join(postsDir, `${slug}.md`);
    if (!fs.existsSync(postPath)) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.end('Post not found\n');
      return;
    }

    const raw = fs.readFileSync(postPath, 'utf-8');
    const { data, content } = matter(raw);
    const markdown = renderPostMarkdown(slug, data, content);
    const canonicalUrl = `${siteUrl}/post/${encodeURIComponent(slug)}`;

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    response.setHeader('Content-Disposition', `inline; filename="${slug}.md"`);
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
    response.setHeader('Vary', 'Accept');
    response.end(request.method === 'HEAD' ? undefined : markdown);
  };
}

function markdownPlugin() {
  const postsDir = path.resolve(__dirname, 'posts');
  const virtualModuleId = 'virtual:posts';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'markdown-posts',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const files = fs
          .readdirSync(postsDir)
          .filter((f: string) => f.endsWith('.md'));
        const posts = files.map((file: string) => {
          const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
          const { data, content: markdownBody } = matter(content);
          if (data.date) {
            data.date = new Date(data.date).toISOString();
          }
          return {
            frontMatter: data,
            markdownBody,
            slug: file.replace('.md', '')
          };
        });
        return `export default ${JSON.stringify(posts)};`;
      }
    },
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(markdownMiddleware(postsDir));
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(markdownMiddleware(postsDir));
    },
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.endsWith('.md') && file.includes('/posts/')) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [markdownPlugin(), preact()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
      '@public': '/public',
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('react-syntax-highlighter') ||
            id.includes('refractor') ||
            id.includes('prismjs')
          ) {
            return 'syntax-highlighter';
          }
          if (
            id.includes('react-markdown') ||
            id.includes('remark') ||
            id.includes('rehype') ||
            id.includes('unified') ||
            id.includes('mdast') ||
            id.includes('hast') ||
            id.includes('micromark')
          ) {
            return 'markdown';
          }
        }
      }
    }
  }
});
