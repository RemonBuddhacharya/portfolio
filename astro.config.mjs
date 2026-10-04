import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

// The Cloudflare adapter runs dev inside workerd, which cannot load Keystatic's
// CommonJS deps ("exports is not defined"). Dev uses plain Node; the adapter is for build/deploy.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://remanbuddhacharya.com.np',
  adapter: isDev ? undefined : cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [react(), markdoc(), keystatic(), sitemap()],
});
