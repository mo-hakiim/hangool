-- =====================================================================
-- HANGOOL CONSTRUCTION & REAL ESTATE — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run again: it only creates what is missing and refreshes policies.
--
-- Security model (Row Level Security is ON for every table)
--   • Visitors (anon key) can READ published content and the site settings.
--   • Visitors can only INSERT contact messages, quote requests and viewing
--     requests — they can never read, change or delete them, and they can only
--     fill in the form columns (not status / handled fields).
--   • Only signed-in users listed in public.admins can add, edit, delete,
--     publish content and read / handle requests.
--   • The service_role key is never needed by the website.
-- =====================================================================

create extension if not exists pgcrypto;

-- Keeps updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Admins ----------
-- One row per user allowed to manage the website. There is deliberately NO
-- policy that lets anyone insert here from the website: add admins only from
-- this SQL editor (see SETUP.md).
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- =====================================================================
-- CONTENT (managed in /admin, shown on the website when published)
-- =====================================================================

create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 1 and 200),
  name_so        text check (char_length(name_so) <= 200),
  location       text check (char_length(location) <= 200),
  description    text check (char_length(description) <= 10000),
  description_so text check (char_length(description_so) <= 10000),
  category       text not null default 'residential'
                 check (category in ('residential', 'commercial', 'industrial', 'road', 'renovation', 'other')),
  status         text not null default 'completed'
                 check (status in ('completed', 'ongoing', 'upcoming')),
  start_date     date,
  end_date       date,
  images         text[] not null default '{}',   -- paths in the site-media bucket; first = cover
  video_urls     text[] not null default '{}',   -- YouTube (embedded) or other links
  published      boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  category   text not null check (category in
             ('completed', 'ongoing', 'construction', 'realEstate', 'engineering', 'equipment', 'events', 'video')),
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  url        text not null check (char_length(url) between 1 and 1000),  -- bucket path (image) or video link
  caption    text check (char_length(caption) <= 300),
  caption_so text check (char_length(caption_so) <= 300),
  published  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 1 and 200),
  name_so        text check (char_length(name_so) <= 200),
  property_type  text not null default 'house'
                 check (property_type in ('apartment', 'villa', 'house', 'land', 'commercial', 'office')),
  deal           text not null default 'sale' check (deal in ('sale', 'rent')),
  price          numeric(14, 2) check (price is null or price >= 0),   -- US dollars; rent = per month; null = on request
  location       text not null check (char_length(location) between 1 and 200),
  size_sqm       numeric(12, 2) check (size_sqm is null or size_sqm > 0),
  bedrooms       smallint check (bedrooms is null or bedrooms between 0 and 100),
  bathrooms      smallint check (bathrooms is null or bathrooms between 0 and 100),
  description    text check (char_length(description) <= 10000),
  description_so text check (char_length(description_so) <= 10000),
  images         text[] not null default '{}',
  availability   text not null default 'available'
                 check (availability in ('available', 'reserved', 'sold', 'rented', 'unavailable')),
  featured       boolean not null default false,
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 160),
  role       text not null check (char_length(role) between 1 and 160),
  role_so    text check (char_length(role_so) <= 160),
  bio        text check (char_length(bio) <= 3000),
  bio_so     text check (char_length(bio_so) <= 3000),
  photo      text,
  published  boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 1 and 250),
  title_so     text check (char_length(title_so) <= 250),
  excerpt      text check (char_length(excerpt) <= 600),
  excerpt_so   text check (char_length(excerpt_so) <= 600),
  body         text check (char_length(body) <= 50000),
  body_so      text check (char_length(body_so) <= 50000),
  cover_image  text,
  published_at date not null default current_date,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.job_openings (
  id              uuid primary key default gen_random_uuid(),
  title           text not null check (char_length(title) between 1 and 200),
  title_so        text check (char_length(title_so) <= 200),
  department      text check (char_length(department) <= 120),
  location        text check (char_length(location) <= 160),
  employment_type text not null default 'full_time'
                  check (employment_type in ('full_time', 'part_time', 'contract', 'internship')),
  description     text check (char_length(description) <= 10000),
  description_so  text check (char_length(description_so) <= 10000),
  deadline        date,   -- hidden on the website after this day
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- One row (id = 1). Empty fields fall back to the defaults built into the site
-- (company-data.ts). stats stays NULL — and hidden on the website — until the
-- owner confirms the figures in Admin → Settings.
create table if not exists public.site_settings (
  id          smallint primary key default 1 check (id = 1),
  stats       jsonb check (stats is null or jsonb_typeof(stats) = 'object'),
  phone       text check (char_length(phone) <= 40),
  whatsapp    text check (char_length(whatsapp) <= 40),
  email       text check (char_length(email) <= 160),
  facebook    text check (char_length(facebook) <= 300),
  tiktok      text check (char_length(tiktok) <= 300),
  instagram   text check (char_length(instagram) <= 300),
  youtube     text check (char_length(youtube) <= 300),
  address     text check (char_length(address) <= 300),
  address_so  text check (char_length(address_so) <= 300),
  map_query   text check (char_length(map_query) <= 300),   -- address or "lat,lng"; empty = no map
  updated_at  timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- =====================================================================
-- VISITOR REQUESTS (insert-only for the public)
-- =====================================================================

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (phone ~ '^\+?[0-9 ()-]{7,22}$'),
  email      text check (email is null or (char_length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  message    text not null check (char_length(message) between 1 and 3000),
  language   text not null default 'en' check (language in ('en', 'so')),
  status     text not null default 'new' check (status in ('new', 'handled')),
  handled_at timestamptz,
  notes      text check (char_length(notes) <= 3000),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 1 and 120),
  phone        text not null check (phone ~ '^\+?[0-9 ()-]{7,22}$'),
  email        text check (email is null or (char_length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  service_type text not null check (char_length(service_type) between 1 and 160),
  location     text check (char_length(location) <= 160),
  budget_range text check (char_length(budget_range) <= 80),
  message      text not null check (char_length(message) between 1 and 3000),
  language     text not null default 'en' check (language in ('en', 'so')),
  status       text not null default 'new' check (status in ('new', 'handled')),
  handled_at   timestamptz,
  notes        text check (char_length(notes) <= 3000),
  created_at   timestamptz not null default now()
);

create table if not exists public.viewing_requests (
  id             uuid primary key default gen_random_uuid(),
  property_id    uuid references public.properties (id) on delete set null,
  property_name  text check (char_length(property_name) <= 200),   -- kept if the property is deleted
  name           text not null check (char_length(name) between 1 and 120),
  phone          text not null check (phone ~ '^\+?[0-9 ()-]{7,22}$'),
  email          text check (email is null or (char_length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  preferred_date date,
  message        text check (char_length(message) <= 3000),
  language       text not null default 'en' check (language in ('en', 'so')),
  status         text not null default 'new' check (status in ('new', 'handled')),
  handled_at     timestamptz,
  notes          text check (char_length(notes) <= 3000),
  created_at     timestamptz not null default now()
);

create index if not exists inquiries_created_idx        on public.inquiries (created_at desc);
create index if not exists quote_requests_created_idx   on public.quote_requests (created_at desc);
create index if not exists viewing_requests_created_idx on public.viewing_requests (created_at desc);
create index if not exists viewing_requests_property_idx on public.viewing_requests (property_id);
create index if not exists projects_published_idx       on public.projects (published, sort_order);
create index if not exists properties_published_idx     on public.properties (published, created_at desc);

-- Basic flood protection: at most 5 requests per phone number per table in 10 minutes.
create or replace function public.limit_requests()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent integer;
begin
  execute format(
    'select count(*) from public.%I where phone = $1 and created_at > now() - interval ''10 minutes''',
    tg_table_name
  ) into recent using new.phone;
  if recent >= 5 then
    raise exception 'Too many requests. Please try again later.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

-- updated_at + flood-protection triggers
do $$
declare t text;
begin
  foreach t in array array['projects', 'gallery_items', 'properties', 'team_members', 'blog_posts', 'job_openings', 'site_settings'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
  foreach t in array array['inquiries', 'quote_requests', 'viewing_requests'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_limit', t);
    execute format('create trigger %I before insert on public.%I for each row execute function public.limit_requests()', t || '_limit', t);
  end loop;
end;
$$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- Content tables: published rows are public; admins see and manage everything.
do $$
declare t text;
begin
  foreach t in array array['projects', 'gallery_items', 'properties', 'team_members', 'blog_posts', 'job_openings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists "Published rows are public" on public.%I', t);
    execute format('drop policy if exists "Admins can add" on public.%I', t);
    execute format('drop policy if exists "Admins can edit" on public.%I', t);
    execute format('drop policy if exists "Admins can delete" on public.%I', t);
    execute format('create policy "Published rows are public" on public.%I for select to anon, authenticated using (published or public.is_admin())', t);
    execute format('create policy "Admins can add" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "Admins can edit" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "Admins can delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end;
$$;

-- Site settings: everyone reads, only admins change.
alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
drop policy if exists "Settings are public"      on public.site_settings;
drop policy if exists "Admins can add settings"  on public.site_settings;
drop policy if exists "Admins can edit settings" on public.site_settings;
create policy "Settings are public"      on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can add settings"  on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "Admins can edit settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Requests: the public may only INSERT the form columns; admins read, handle and delete.
alter table public.inquiries        enable row level security;
alter table public.quote_requests   enable row level security;
alter table public.viewing_requests enable row level security;
revoke all on public.inquiries, public.quote_requests, public.viewing_requests from anon, authenticated;

grant insert (name, phone, email, message, language)
  on public.inquiries to anon, authenticated;
grant insert (name, phone, email, service_type, location, budget_range, message, language)
  on public.quote_requests to anon, authenticated;
grant insert (property_id, property_name, name, phone, email, preferred_date, message, language)
  on public.viewing_requests to anon, authenticated;
grant select, delete on public.inquiries, public.quote_requests, public.viewing_requests to authenticated;
grant update (status, handled_at, notes)
  on public.inquiries, public.quote_requests, public.viewing_requests to authenticated;

do $$
declare t text;
begin
  foreach t in array array['inquiries', 'quote_requests', 'viewing_requests'] loop
    execute format('drop policy if exists "Anyone can send" on public.%I', t);
    execute format('drop policy if exists "Admins can read" on public.%I', t);
    execute format('drop policy if exists "Admins can handle" on public.%I', t);
    execute format('drop policy if exists "Admins can delete" on public.%I', t);
    execute format('create policy "Anyone can send" on public.%I for insert to anon, authenticated with check (status = ''new'' and handled_at is null)', t);
    execute format('create policy "Admins can read" on public.%I for select to authenticated using (public.is_admin())', t);
    execute format('create policy "Admins can handle" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "Admins can delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end;
$$;

-- A viewing request may only point at a property that is published.
drop policy if exists "Anyone can send" on public.viewing_requests;
create policy "Anyone can send" on public.viewing_requests for insert to anon, authenticated
  with check (
    status = 'new' and handled_at is null
    and (property_id is null or exists (select 1 from public.properties p where p.id = property_id and p.published))
  );

-- Admins: a signed-in user may only see whether they themselves are an admin.
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;
drop policy if exists "Users can see their own admin row" on public.admins;
create policy "Users can see their own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

-- =====================================================================
-- STORAGE: public bucket for photos (projects, properties, gallery, team, blog)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Site media is public"        on storage.objects;
drop policy if exists "Admins can upload site media" on storage.objects;
drop policy if exists "Admins can update site media" on storage.objects;
drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Site media is public"         on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
create policy "Admins can upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
create policy "Admins can update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
create policy "Admins can delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());
