import { config, fields, collection, singleton } from '@keystatic/core';

// Local files in dev, GitHub commits in production (admin login via GitHub OAuth).
// Run `KEYSTATIC_STORAGE=github npm run dev` once to create the GitHub App (see README).
const storage = import.meta.env.PROD || import.meta.env.KEYSTATIC_STORAGE === 'github'
  ? ({ kind: 'github', repo: { owner: 'RemonBuddhacharya', name: 'portfolio' } } as const)
  : ({ kind: 'local' } as const);

const tags = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  itemLabel: (p) => p.value,
});

export default config({
  storage,
  ui: { brand: { name: 'Reman · Content' } },
  singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name' }),
        jobTitle: fields.text({ label: 'Job title' }),
        tagline: fields.text({ label: 'Hero tagline', multiline: true }),
        email: fields.text({ label: 'Email' }),
        location: fields.text({ label: 'Location' }),
        github: fields.url({ label: 'GitHub URL' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        resume: fields.file({
          label: 'Resume (PDF)',
          directory: 'public/files',
          publicPath: '/files/',
        }),
        about: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'About paragraphs',
          itemLabel: (p) => p.value.slice(0, 40),
        }),
        aboutHighlight: fields.text({ label: 'About closing line', multiline: true }),
      },
    }),
    skills: singleton({
      label: 'Skills',
      path: 'src/content/skills',
      format: 'json',
      schema: {
        groups: fields.array(
          fields.object({
            title: fields.text({ label: 'Category' }),
            items: fields.array(fields.text({ label: 'Skill' }), {
              label: 'Skills',
              itemLabel: (p) => p.value,
            }),
          }),
          { label: 'Skill categories', itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary (shown on cards and in search results)', multiline: true, validation: { isRequired: true } }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'src/assets/images/posts',
          publicPath: '../../assets/images/posts/',
        }),
        coverAlt: fields.text({ label: 'Cover image description (alt text)' }),
        tags,
        draft: fields.checkbox({ label: 'Draft (hidden from the site)', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '../../assets/images/posts/',
            },
          },
        }),
      },
    }),
    albums: collection({
      label: 'Gallery albums',
      slugField: 'title',
      path: 'src/content/albums/*',
      format: 'json',
      schema: {
        title: fields.slug({ name: { label: 'Album title' } }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        cover: fields.image({
          label: 'Cover (optional, defaults to first photo)',
          directory: 'src/assets/images/gallery',
          publicPath: '../../assets/images/gallery/',
        }),
        draft: fields.checkbox({ label: 'Draft (hidden from the site)', defaultValue: false }),
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: 'Photo',
              directory: 'src/assets/images/gallery',
              publicPath: '../../assets/images/gallery/',
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: 'Description (alt text)', validation: { isRequired: true } }),
            caption: fields.text({ label: 'Caption (optional)' }),
            location: fields.text({ label: 'Location (optional)' }),
          }),
          { label: 'Photos', itemLabel: (p) => p.fields.alt.value || 'Photo' },
        ),
      },
    }),
    projects: collection({
      label: 'Experience / Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: 'json',
      schema: {
        title: fields.slug({ name: { label: 'Project title' } }),
        org: fields.text({ label: 'Organisation' }),
        order: fields.integer({ label: 'Order (1 = first)', defaultValue: 1 }),
        description: fields.text({ label: 'Description', multiline: true }),
        points: fields.array(fields.text({ label: 'Point', multiline: true }), {
          label: 'What I did',
          itemLabel: (p) => p.value.slice(0, 50),
        }),
      },
    }),
  },
});
