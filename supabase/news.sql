create table if not exists public.news (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null,
  subtitle text default '',
  body_md text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now()
);

alter table public.news enable row level security;

drop policy if exists "news_public_read" on public.news;
drop policy if exists "news_admin_insert" on public.news;
drop policy if exists "news_admin_update" on public.news;
drop policy if exists "news_admin_delete" on public.news;

create policy "news_public_read"
  on public.news for select
  to anon, authenticated
  using (is_published = true);

create policy "news_admin_insert"
  on public.news for insert
  to authenticated
  with check (true);

create policy "news_admin_update"
  on public.news for update
  to authenticated
  using (true)
  with check (true);

create policy "news_admin_delete"
  on public.news for delete
  to authenticated
  using (true);
