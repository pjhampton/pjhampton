import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

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
        const files = fs.readdirSync(postsDir).filter((f: string) => f.endsWith('.md'));
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
          if (id.includes('react-syntax-highlighter') || id.includes('refractor') || id.includes('prismjs')) {
            return 'syntax-highlighter';
          }
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('unified') || id.includes('mdast') || id.includes('hast') || id.includes('micromark')) {
            return 'markdown';
          }
        }
      }
    }
  }
});
