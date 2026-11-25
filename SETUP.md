# Hangool website — setup checklist

The website is a static site on GitHub Pages (hangooldevelopment.com). Live content
— projects, properties, gallery, team, news, jobs, settings — and all form messages
are stored in a free Supabase project and managed at **hangooldevelopment.com/admin**.

Until steps 1–6 are done, the site still works: lists show "coming soon", the
company figures stay hidden, forms show an error with a WhatsApp button, and
`/admin` says it isn't connected.

## 1. Create the Supabase project

1. Go to <https://supabase.com>, sign in and click **New project**.
2. Name it `hangool`, set a strong database password (save it somewhere safe; the
   website never needs it), pick the region closest to Somaliland (for example
   **Frankfurt** or **Mumbai**), and create the project.

## 2. Create the tables, security rules and photo storage

1. In the project, open **SQL Editor → New query**.
2. Paste the whole of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. You should see "Success. No rows returned". The file is safe to run again later
   (for example after an update); it never deletes your data.

This creates every table with Row Level Security, the `site_settings` row, the
`is_admin()` check, flood protection on the forms, and a public `site-media`
storage bucket for photos.

## 3. Create the admin user

1. Open **Authentication → Users → Add user → Create new user**.
2. Enter the owner's email and a strong password, tick **Auto Confirm User**, and
   create the user.
3. Back in **SQL Editor**, run (with the owner's email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'OWNER@EXAMPLE.COM'
   on conflict do nothing;
   ```

   Repeat for any other staff account that should manage the website. Only users in
   `public.admins` can sign in to the dashboard; there is no sign-up page.

4. Turn off public sign-ups: **Authentication → Sign In / Providers → Email** (or
   **User Signups**) → switch **Allow new users to sign up** off. Admin accounts are
   only ever created by you in step 3.

## 4. Password reset links (URL configuration)

Open **Authentication → URL Configuration** and set:

| Setting | Value |
| --- | --- |
| Site URL | `https://hangooldevelopment.com` |
| Redirect URLs | `https://hangooldevelopment.com/admin/reset-password` |

"Forgot password?" on the sign-in page emails a link that opens
`/admin/reset-password`. Supabase's built-in email service only sends a few emails
per hour; for regular use, add your own SMTP under **Authentication → Emails →
SMTP Settings** (optional).

## 5. Connect the website (GitHub variables)

1. In Supabase open **Project Settings**. Copy (the menu names vary slightly between
   dashboard versions: **API**, **API Keys** and **Data API**):
   - **Project URL** — looks like `https://abcd1234.supabase.co`
   - **anon public** key (or **publishable** key, starts with `sb_publishable_`)

   Never use the `service_role` / `sb_secret_` key — the deploy fails on purpose if
   you do.
2. On GitHub open the `hangool` repository → **Settings → Secrets and variables →
   Actions → Variables** → **New repository variable**, and add:

   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | the Project URL |
   | `VITE_SUPABASE_ANON_KEY` | the anon / publishable key |

   (Secrets work too; these values are public by design, so variables are fine.)

## 6. Rebuild the site

Open **Actions → Deploy to GitHub Pages → Run workflow** (or push any commit to
`main`). The build log's "Check Supabase settings" step should say
"Supabase settings found".

## 7. Keep the free database awake

Free Supabase projects pause after a week without traffic. The **Keep Supabase
awake** workflow pings the database every 3 days using the same two variables.
Run it once by hand (**Actions → Keep Supabase awake → Run workflow**) and check
it's green.

## 8. First things to do in the dashboard

Sign in at **hangooldevelopment.com/admin**, then:

1. **Settings** — confirm or change the company figures (10+ years, 50+ projects,
   100+ clients, 30+ professionals are only suggestions) and tick "Show these
   figures"; check the contact details; add the office address and map location
   when you have them (the map appears on the Contact page automatically).
2. **Projects / Properties / Gallery / Team / News / Careers** — add items, upload
   photos (they are resized automatically) and tick **Published** to show them.
3. **Requests** — contact messages, quote requests and viewing requests arrive
   here. Reply by phone, WhatsApp or email, then **Mark as handled**.

**Change password:** Account (top right) → Change password.

## Local development (optional)

```bash
cp .env.example .env   # fill in the two values from step 5
bun install
bun run dev
```

Add `http://localhost:8080/admin/reset-password` (or the port Vite shows) to the
Redirect URLs if you want to test password reset locally.
