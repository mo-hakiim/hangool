# Hangool Construction & Real Estate

A frontend-only corporate website built with React, TanStack Start, Vite, and Tailwind CSS. No backend, login, database, or form-service calls.

## Editable content

All company details, statistics, services, sample projects, team details, milestones, and updates live in `company-data.ts` at the project root.

## Placeholders to replace before publishing

- Phone, WhatsApp number (international format), email, office address, and working hours.
- Facebook, Instagram, TikTok, and YouTube links.
- Sample statistics: 10+ years, 50+ projects, 100+ clients, 30+ professionals are **not verified company facts**.
- All sample portfolio names, images, locations, years, and descriptions.
- Team names and photos, milestone dates, and post dates and content.
- Office map: currently a Hargeisa map placeholder rather than a verified office location.

Photographs are illustrative samples, not evidence of completed Hangool work. Brand text, colors, fonts, and logo follow the supplied identity guide (the final palette on page 20).

The quote form opens a prefilled WhatsApp inquiry only after a real number is supplied. Missing contact details show an honest message and never pretend to send. Social buttons remain unavailable until real URLs are entered.

## Development and tests

Run `bun install`, `bun run dev`, and `bun run test`.

## Static hosting

Public pages are configured for build-time prerendering: `/`, `/about`, `/services`, `/projects`, `/media`, and `/contact`. Publish only the generated static public output to GitHub Pages, not the server bundle. Each page receives a directory `index.html`, so direct refreshes work on static hosts. This preserves the fixed TanStack router rather than installing a second hash router.

For a GitHub Pages repository subpath, set the deployment base path for that repository before building; an exact repository URL was not supplied. Root-domain deployment is the configured default. Static output has been configured but a GitHub Pages deployment has not been performed or verified.
