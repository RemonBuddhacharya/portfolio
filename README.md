# Reman Buddhacharya: portfolio, blog and gallery

Astro + Keystatic CMS, hosted free on Cloudflare (Workers with static assets).

## Run locally

```bash
npm install
npm run dev        # http://127.0.0.1:4321, admin at /keystatic
npm run build      # production build into dist/
```

Locally the admin edits files on disk. In production it commits to GitHub.

## Managing content (`/keystatic`)

| Section | What it controls |
|---|---|
| Blog posts | Posts with images inside the text, tags, draft toggle |
| Gallery albums | Albums and their photos (caption, location) |
| Experience / Projects | Cards in "Professional Experience" |
| Skills | Testing stack categories |
| Site Settings | Name, title, email, links, about text, resume PDF |

Tip: every save triggers a build (Workers Builds free tier: 3,000 build minutes/month). Batch your edits into one save.

## Project layout

```
src/components/   page sections and cards
src/layouts/      BaseLayout (head, SEO, nav, footer)
src/pages/        index, blog/, gallery/, 404, rss.xml
src/content/      posts (.mdoc), albums, projects, settings, skills (managed by Keystatic)
src/assets/       images uploaded through the admin (resized at build time)
src/lib/content.ts  shared content helpers
keystatic.config.ts the admin schema
```

## Deploy

Hosting: Cloudflare Workers Builds (free). Cloudflare builds on every push to `main`, so no GitHub Actions workflow is needed.
Final URL: https://remanbuddhacharya.com.np/. The admin commits to `Remonbuddhacharya/portfolio` (set in `keystatic.config.ts`).

### Variables

| Name | Value | Where to set | Type |
|---|---|---|---|
| `NODE_VERSION` | `22` | Build variables | plain |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | from `.env` | Build variables | plain |
| `KEYSTATIC_GITHUB_CLIENT_ID` | from `.env` | Variables and Secrets (runtime) | plain |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | from `.env` | Variables and Secrets (runtime) | secret |
| `KEYSTATIC_SECRET` | from `.env` | Variables and Secrets (runtime) | secret |

You never invent these. Keystatic creates them (step 2).

### Order

1. **Get the code on `main`.** On GitHub, open a pull request from `chandan-astro-switch` into `main` in `Remonbuddhacharya/portfolio` and merge it.
2. **Create the GitHub App and the secrets (local, once).**
   ```bash
   git pull && npm install
   KEYSTATIC_STORAGE=github npm run dev
   ```
   Open http://127.0.0.1:4321/keystatic → **Create GitHub App**.
   - Deployed URL: `https://remanbuddhacharya.com.np`
   - Approve on GitHub, then install the app on the `portfolio` repo only.
   - Keystatic writes `.env` with the 4 Keystatic values. `.env` is git-ignored; never commit it.
3. **Create the Cloudflare project.** Dashboard → Workers & Pages → Create → Import a repository → `Remonbuddhacharya/portfolio`, branch `main`.
   - Project name: `reman-portfolio` (must match `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
4. **Add the variables** from the table, then redeploy (Deployments → Retry). Use "Add secret" for the two secret rows.
5. **Check the default URL** `https://reman-portfolio.<account>.workers.dev`: the site loads. `/keystatic` login only works on the custom domain (the app's callback URLs point there), so continue.
6. **Attach the domain.**
   1. Cloudflare → Add a domain → `remanbuddhacharya.com.np` (free plan).
   2. At your `.np` registrar, change the nameservers to the two Cloudflare gives you. Wait until Cloudflare says Active.
   3. Worker → Settings → Domains & Routes → Add → Custom domain → `remanbuddhacharya.com.np` (and `www` if wanted).
   Workers custom domains need the domain's DNS on Cloudflare; a plain CNAME at another DNS host does not work.
7. **Log in:** `https://remanbuddhacharya.com.np/keystatic` → Sign in with GitHub. Upload the CV under Site Settings → Resume, then add posts and albums.

### Troubleshooting
- Login loops or "callback URL mismatch": GitHub → Settings → Developer settings → GitHub Apps → your app → add `https://remanbuddhacharya.com.np/api/keystatic/github/oauth/callback`.
- "KEYSTATIC_SECRET must be at least 32 characters": the secret was pasted wrong; copy it again from `.env`.
- Admin changes do not appear: wait for the Cloudflare build (about 1 minute) and check Deployments for errors.
