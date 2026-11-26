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
   insert into public.admin_roles (user_id, role, email)
   select id, 'owner', email from auth.users where email = 'OWNER@EXAMPLE.COM'
   on conflict (user_id) do update set role = 'owner', active = true;
   ```

   This is only needed for the first owner. Everyone else is invited from
   **Admin → Staff** (step 9). There is no sign-up page.

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

Sign in at **hangooldevelopment.com/admin** (staff see only the sections their role
allows), then:

1. **Settings** — confirm or change the company figures (10+ years, 50+ projects,
   100+ clients, 30+ professionals are only suggestions) and tick "Show these
   figures"; check the contact details; add the office address and map location
   when you have them (the map appears on the Contact page automatically).
2. **Projects / Properties / Gallery / Team / News / Careers** — add items, upload
   photos (they are resized automatically) and tick **Published** to show them.
3. **Requests** — contact messages, quote requests and viewing requests arrive
   here. Reply by phone, WhatsApp or email, then **Mark as handled**.

**Change password:** Account (top right) → Change password.

## 9. Staff invites (Admin → Staff)

Roles: **Owner** (everything, including settings and staff), **Editor** (projects,
properties, gallery, team, news, careers), **Requests** (contact, quote and viewing
requests only). Inviting and removing logins is done by the `staff-admin` Edge
Function, which uses the service_role key from Supabase's own secrets — the key
never goes into the website or this repository.

1. **Upgrade the database:** SQL Editor → paste the latest
   [`supabase/schema.sql`](supabase/schema.sql) → **Run**. Everyone in the old
   `admins` table becomes an **owner** in the new `admin_roles` table.
2. **Deploy the function** (either way):
   - *Dashboard:* **Edge Functions → Deploy a new function → Via Editor**, name it
     `staff-admin`, replace the sample code with the whole of
     [`supabase/functions/staff-admin/index.ts`](supabase/functions/staff-admin/index.ts),
     and click **Deploy**. Leave **Verify JWT** switched **on**.
   - *Command line:* `npx supabase login`, then
     `npx supabase link --project-ref jqxuwvnfauusttncnrnx`, then
     `npx supabase functions deploy staff-admin`.
3. **Secrets:** Supabase gives every function `SUPABASE_URL`,
   `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` automatically — check
   **Edge Functions → Secrets**. If your project only has the new key system and
   those two keys are missing there, add them yourself as `ANON_KEY` (publishable
   key) and `SERVICE_ROLE_KEY` (secret key). Optional: `SITE_URL` if the site moves
   away from https://hangooldevelopment.com.
4. **Invite emails:** they use **Authentication → Emails → Invite user**. Supabase's
   built-in email sender only sends a few emails per hour; for reliable invites and
   password resets, set up Resend's SMTP (step 10, item 6).
5. **Test:** Admin → Staff → invite a second address as **Editor**, open the email,
   set a password, sign in — you should only see the content sections.

## 10. Email alerts for new requests

Every new contact message, quote request and viewing request is emailed to the
**Alert email** in Admin → Settings (default info@hangooldevelopment.com), through
the `notify-request` Edge Function and the free [Resend](https://resend.com) service
(3,000 emails a month, 100 a day).

1. **Resend account:** sign up at resend.com.
2. **Your domain:** Resend → **Domains → Add domain** → `hangooldevelopment.com`.
   Resend shows a few DNS records (TXT/MX/CNAME). Add them where the domain's DNS is
   managed (the same place you pointed the domain at GitHub Pages) and click
   **Verify**. Until it is verified, Resend only delivers to the email address of
   your Resend account.
3. **API key:** Resend → **API Keys → Create API key** (permission: *Sending
   access*). Copy it — it is shown only once.
4. **Supabase secrets:** **Edge Functions → Secrets → Add new secret**:

   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | the key from step 3 (starts with `re_`) |
   | `NOTIFY_FROM` | `Hangool Website <alerts@hangooldevelopment.com>` |
   | `WEBHOOK_SECRET` | a long random password you make up (30+ characters) |

5. **Deploy the function** `notify-request` the same way as in step 9, using
   [`supabase/functions/notify-request/index.ts`](supabase/functions/notify-request/index.ts),
   but switch **Verify JWT off** (the webhooks prove themselves with
   `WEBHOOK_SECRET` instead). Command line:
   `npx supabase functions deploy notify-request --no-verify-jwt`.
6. *(Recommended)* **Use Resend for Supabase's own emails too** (invites, password
   resets): **Authentication → Emails → SMTP Settings** → enable custom SMTP with
   host `smtp.resend.com`, port `465`, username `resend`, password = your Resend API
   key, sender `alerts@hangooldevelopment.com`.
7. **Webhooks:** **Database → Webhooks → Create a new hook**, three times:

   | Name | Table | Events |
   | --- | --- | --- |
   | `alert-contact` | `inquiries` | Insert |
   | `alert-quote` | `quote_requests` | Insert |
   | `alert-viewing` | `viewing_requests` | Insert |

   For each: type **Supabase Edge Functions** → function `notify-request`, method
   **POST**, and under **HTTP Headers** add `x-webhook-secret` with the same value
   as `WEBHOOK_SECRET`.
8. **Test:** send the contact form on the website. The email should arrive within a
   minute. If not, open **Edge Functions → notify-request → Logs**: `401` means the
   header doesn't match `WEBHOOK_SECRET`; a Resend error means the key or domain
   isn't set up yet. The request is saved in the inbox either way.

## Local development (optional)

```bash
cp .env.example .env   # fill in the two values from step 5
bun install
bun run dev
```

Add `http://localhost:8080/admin/reset-password` (or the port Vite shows) to the
Redirect URLs if you want to test password reset locally.
