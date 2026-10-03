import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      cover: image().nullish(),
      coverAlt: z.string().default(''),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const albums = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/albums' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().default(''),
      cover: image().nullish(),
      draft: z.boolean().default(false),
      photos: z.array(
        z.object({
          image: image(),
          alt: z.string(),
          caption: z.string().default(''),
          location: z.string().default(''),
        }),
      ),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    order: z.number().default(1),
    description: z.string(),
    points: z.array(z.string()),
  }),
});

export const collections = { posts, albums, projects };
