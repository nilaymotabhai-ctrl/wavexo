-- ================================================================
--  WAVEXO CMS — SECURE SUPABASE SETUP (production)
--  Run once in: Supabase Dashboard → SQL Editor → New query
--  Idempotent — safe to re-run after edits.
--
--  Access model (enforced server-side by Row Level Security):
--    PUBLIC (anon key):  site_content SELECT
--                        leads / visits / activity  INSERT only
--    ADMIN (Supabase Auth session):  full access to all tables
-- ================================================================

-- 1) Tables ------------------------------------------------------------
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.leads (
  id          text primary key,
  payload     jsonb not null,
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create table if not exists public.visits (
  id      bigint generated always as identity primary key,
  t       timestamptz not null default now(),
  path    text,
  device  text,
  source  text
);
create index if not exists visits_t_idx on public.visits (t desc);

create table if not exists public.activity (
  id          text primary key,
  t           bigint not null,
  user_name   text,
  action      text,
  detail      text,
  created_at  timestamptz not null default now()
);
create index if not exists activity_t_idx on public.activity (t desc);

-- 2) Enable RLS ---------------------------------------------------------
alter table public.site_content enable row level security;
alter table public.leads        enable row level security;
alter table public.visits       enable row level security;
alter table public.activity     enable row level security;

-- 3) Drop any older/legacy policies ------------------------------------
drop policy if exists "site_content_select" on public.site_content;
drop policy if exists "site_content_insert" on public.site_content;
drop policy if exists "site_content_update" on public.site_content;
drop policy if exists "sc_select"           on public.site_content;
drop policy if exists "sc_insert"           on public.site_content;
drop policy if exists "sc_update"           on public.site_content;
drop policy if exists "content_public_read" on public.site_content;
drop policy if exists "content_admin_write" on public.site_content;
drop policy if exists "content_admin_update" on public.site_content;

drop policy if exists "leads_select"  on public.leads;
drop policy if exists "leads_insert"  on public.leads;
drop policy if exists "leads_update"  on public.leads;
drop policy if exists "leads_delete"  on public.leads;
drop policy if exists "leads_all"     on public.leads;
drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_admin_read"    on public.leads;
drop policy if exists "leads_admin_update"  on public.leads;
drop policy if exists "leads_admin_delete"  on public.leads;

drop policy if exists "visits_select" on public.visits;
drop policy if exists "visits_insert" on public.visits;
drop policy if exists "visits_delete" on public.visits;
drop policy if exists "visits_all"    on public.visits;
drop policy if exists "visits_public_insert" on public.visits;
drop policy if exists "visits_admin_read"    on public.visits;
drop policy if exists "visits_admin_delete"  on public.visits;

drop policy if exists "activity_select" on public.activity;
drop policy if exists "activity_insert" on public.activity;
drop policy if exists "activity_delete" on public.activity;
drop policy if exists "activity_all"    on public.activity;
drop policy if exists "activity_public_insert" on public.activity;
drop policy if exists "activity_admin_read"    on public.activity;
drop policy if exists "activity_admin_delete"  on public.activity;

-- 4) site_content — public read, admin-only write -----------------------
create policy "content_public_read" on public.site_content
  for select using (true);

create policy "content_admin_write" on public.site_content
  for insert with check (auth.role() = 'authenticated');

create policy "content_admin_update" on public.site_content
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 5) leads — public can SUBMIT, only admin can read/manage --------------
create policy "leads_public_insert" on public.leads
  for insert with check (true);

create policy "leads_admin_read" on public.leads
  for select using (auth.role() = 'authenticated');

create policy "leads_admin_update" on public.leads
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "leads_admin_delete" on public.leads
  for delete using (auth.role() = 'authenticated');

-- 6) visits — public tracking INSERT, admin-only read/delete ------------
create policy "visits_public_insert" on public.visits
  for insert with check (true);

create policy "visits_admin_read" on public.visits
  for select using (auth.role() = 'authenticated');

create policy "visits_admin_delete" on public.visits
  for delete using (auth.role() = 'authenticated');

-- 7) activity — public INSERT (lead events), admin-only read/delete -----
create policy "activity_public_insert" on public.activity
  for insert with check (true);

create policy "activity_admin_read" on public.activity
  for select using (auth.role() = 'authenticated');

create policy "activity_admin_delete" on public.activity
  for delete using (auth.role() = 'authenticated');

-- 8) Realtime — public pages get live content updates -------------------
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

-- 9) Media bucket — public read, admin-only upload/delete ---------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read"   on storage.objects;
drop policy if exists "media_public_upload" on storage.objects;
drop policy if exists "media_public_delete" on storage.objects;
drop policy if exists "media_read"          on storage.objects;
drop policy if exists "media_upload"        on storage.objects;
drop policy if exists "media_delete"        on storage.objects;

create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media_admin_upload" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ================================================================
--  ADMIN ACCOUNT (one-time, do in the dashboard — NOT here):
--    Authentication → Users → Add user
--      email:    <your admin email>
--      password: <strong password>
--      ✔ Auto Confirm User
--  Also recommended: Authentication → Sign In / Up →
--    turn OFF "Allow new users to sign up" (public signups).
-- ================================================================
