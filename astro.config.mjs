import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://remanbuddhacharya.com.np',
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [react(), markdoc(), keystatic(), sitemap()],
});
