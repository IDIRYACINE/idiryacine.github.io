import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypePrism from 'rehype-prism-plus';

// Adds a `wordCount` to article frontmatter so reading time works without a server
function remarkWordCount() {
  return (tree, file) => {
    const yaml = tree.children.find(node => node.type === 'yaml');
    if (!yaml) return;

    const body = String(file.value).replace(/^---[\s\S]*?---/, '');
    const wordCount = body.trim().split(/\s+/).length;
    yaml.value += `\nwordCount: ${wordCount}`;
  };
}

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024,
  },
  server: {
    port: 7777,
  },
  plugins: [
    mdx({
      rehypePlugins: [rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkWordCount, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    remix({
      // Static SPA build so the site can be hosted on GitHub Pages
      ssr: false,
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),
    jsconfigPaths(),
  ],
});
