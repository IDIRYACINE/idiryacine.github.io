import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024,
  },
  server: {
    port: 7777,
  },
  plugins: [
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
