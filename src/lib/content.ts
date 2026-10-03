import { getCollection, type CollectionEntry } from 'astro:content';
import settings from '../content/settings.json';
import skills from '../content/skills.json';

export { settings, skills };

// Drafts show in dev so they can be previewed, never in production.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getPosts() {
  const posts = await getCollection('posts', visible);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAlbums() {
  const albums = await getCollection('albums', visible);
  return albums.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export const albumCover = (album: CollectionEntry<'albums'>) =>
  album.data.cover ?? album.data.photos[0]?.image;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const readingTime = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
