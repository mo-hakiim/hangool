<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Hosting is static: GitHub Pages builds the site from `main` (`.github/workflows/deploy.yml`) and serves it at hangooldevelopment.com. Every page is prerendered; list new routes in the `pages` array in `vite.config.ts`.
- Use TanStack content routes with build-time static HTML for all public pages; directory index files support static-host refreshes without replacing the fixed router. Database-driven detail pages are single prerendered pages that read `?id=` (`/project`, `/property`, `/news/post`) and set their own title/description/og tags in the browser via `usePageMeta`.
- All public-site text lives in `src/i18n/en.ts` with a mirrored `src/i18n/so.ts` (typed `Dictionary`, checked by `src/test/i18n.test.ts`); components read it via `useI18n()` and never hardcode copy. Mark uncertain Somali with `// TODO(so): review`. The language choice is stored in localStorage (`hangool_lang`). The admin dashboard is English-only.
- Live content (projects, gallery, properties, team, blog, jobs, settings) is managed in Supabase through `/admin` (`src/routes/admin*.tsx`, `src/admin/`). The browser uses only the public anon key (`src/lib/supabase.ts`, `src/data/live.ts`); Row Level Security in `supabase/schema.sql` decides access. Never put the service_role key in the repo or frontend. This project uses its own Supabase project, not Lovable Cloud; `supabase/schema.sql` is run by hand (see SETUP.md) — still never add `supabase/migrations/`.
- No unconfirmed or placeholder company information on the public site: database lists show a "coming soon" state until items are published, and the company stats stay hidden until confirmed in Admin → Settings.
- `company-data.ts` holds the built-in defaults (phone, WhatsApp, email, the four social links, suggested stats, bundled images); values saved in Admin → Settings override them via `mergeSettings()`.
- Forms (contact, quote, viewing) insert into Supabase with a honeypot and minimum fill time; if saving fails they show an error plus a WhatsApp button with the message prefilled. Visitors can insert but never read requests.
- Centralize viewport reveals and delegated button interactions in the motion shell, using Framer Motion with reduced-motion guards; this covers all content pages without duplicating observers.
- Bundled optimized media is the fallback while no database content exists; no external image hotlinks are used.
- SEO: each route's static head comes from `pageHead()` in `src/lib/seo.ts` (English, canonical URL, og/twitter tags with `public/og-image.jpg`); `scripts/generate-sitemap.mjs` writes `public/sitemap.xml` before every build (static pages plus published database items); `public/robots.txt` keeps `/admin` out of search engines.
- Images: bundled photos are pre-compressed WebP (the hero has a 960px phone version via srcSet); below-the-fold images use `loading="lazy"`; admin uploads are resized to 1600px WebP in the browser before upload.
- Run `bun run test` after content or translation changes.
