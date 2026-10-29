// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed as a GitHub Pages *user site* at the repo `priangshu17.github.io`,
// which serves from the root — so no `base` path is needed.
export default defineConfig({
  site: 'https://priangshu17.github.io',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
