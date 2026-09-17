-- ================================================================
--  WAVEXO CMS — Supabase setup script
--  Run this once in: Supabase Dashboard → SQL Editor → New query
--  Everything below is idempotent (safe to run more than once).
-- ================================================================

-- 1) Site content document -------------------------------------------
-- One JSONB row ('main') holds all CMS content: settings, services,
-- hero, pricing, portfolio, blog, testimonials, FAQs, team, media
-- references, SEO config, about content, etc.
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 2) Leads / form submissions ----------------------------------------
create table if not exists public.leads (
  id          text primary key,
  payload     jsonb not null,            -- full lead object (name, email, status, notes…)
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- 3) Analytics visits --------------------------------------------------
create table if not exists public.visits (
  id      bigint generated always as identity primary key,
  t       timestamptz not null default now(),
  path    text,
  device  text,
  source  text
);
create index if not exists visits_t_idx on public.visits (t desc);

-- 4) Activity log -------------------------------------------------------
create table if not exists public.activity (
  id          text primary key,
  t           bigint not null,
  user_name   text,
  action      text,
  detail      text,
  created_at  timestamptz not null default now()
);
create index if not exists activity_t_idx on public.activity (t desc);

-- 5) Row Level Security -------------------------------------------------
-- The panel authenticates with its own admin login, so the anon key
-- needs read/write here. (See the hardening block at the bottom for
-- locking this down with Supabase Auth when you're ready.)
alter table public.site_content enable row level security;
alter table public.leads        enable row level security;
alter table public.visits       enable row level security;
alter table public.activity     enable row level security;

drop policy if exists "site_content_select" on public.site_content;
drop policy if exists "site_content_insert" on public.site_content;
drop policy if exists "site_content_update" on public.site_content;
create policy "site_content_select" on public.site_content for select using (true);
create policy "site_content_insert" on public.site_content for insert with check (true);
create policy "site_content_update" on public.site_content for update using (true);

drop policy if exists "leads_select" on public.leads;
drop policy if exists "leads_insert" on public.leads;
drop policy if exists "leads_update" on public.leads;
drop policy if exists "leads_delete" on public.leads;
create policy "leads_select" on public.leads for select using (true);
create policy "leads_insert" on public.leads for insert with check (true);
create policy "leads_update" on public.leads for update using (true);
create policy "leads_delete" on public.leads for delete using (true);

drop policy if exists "visits_select" on public.visits;
drop policy if exists "visits_insert" on public.visits;
drop policy if exists "visits_delete" on public.visits;
create policy "visits_select" on public.visits for select using (true);
create policy "visits_insert" on public.visits for insert with check (true);
create policy "visits_delete" on public.visits for delete using (true);

drop policy if exists "activity_select" on public.activity;
drop policy if exists "activity_insert" on public.activity;
drop policy if exists "activity_delete" on public.activity;
create policy "activity_select" on public.activity for select using (true);
create policy "activity_insert" on public.activity for insert with check (true);
create policy "activity_delete" on public.activity for delete using (true);

-- 6) Realtime — lets every open admin session see edits live -----------
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_content') then
    alter publication supabase_realtime add table public.site_content;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'leads') then
    alter publication supabase_realtime add table public.leads;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'activity') then
    alter publication supabase_realtime add table public.activity;
  end if;
end $$;

-- 7) Media storage bucket (public uploads for images/PDFs) -------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
drop policy if exists "media_public_upload" on storage.objects;
drop policy if exists "media_public_delete" on storage.objects;
create policy "media_public_read"   on storage.objects for select using (bucket_id = 'media');
create policy "media_public_upload" on storage.objects for insert with check (bucket_id = 'media');
create policy "media_public_delete" on storage.objects for delete using (bucket_id = 'media');

-- ================================================================
--  OPTIONAL HARDENING (recommended before public launch)
--  1. Dashboard → Authentication → add your owner user
--  2. Swap the app's login to supabase.auth.signInWithPassword()
--  3. Then run:
--
--   drop policy "site_content_insert" on public.site_content;
--   drop policy "site_content_update" on public.site_content;
--   drop policy "leads_select"  on public.leads;
--   drop policy "leads_update"  on public.leads;
--   drop policy "leads_delete"  on public.leads;
--   drop policy "visits_select" on public.visits;
--   drop policy "visits_delete" on public.visits;
--   drop policy "activity_select" on public.activity;
--   drop policy "activity_delete" on public.activity;
--
--   create policy "admin_write_content" on public.site_content
--     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
--   create policy "admin_leads" on public.leads
--     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
--   create policy "admin_visits" on public.visits
--     for select using (auth.role() = 'authenticated');
--   create policy "admin_activity" on public.activity
--     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
--
--  (Public visitors keep: site_content SELECT, leads INSERT,
--   visits INSERT, activity INSERT — everything the site needs.)
-- ================================================================
