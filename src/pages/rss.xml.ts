import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, settings } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${settings.name} · Blog`,
    description: settings.tagline,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/blog/${p.id}/`,
    })),
  });
}
