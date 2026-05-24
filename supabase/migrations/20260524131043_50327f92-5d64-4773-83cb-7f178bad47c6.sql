
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Scrape jobs
create table public.scrape_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  status text not null default 'pending',
  resource_count int not null default 0,
  total_size bigint not null default 0,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.scrape_jobs enable row level security;
create policy "Users view own jobs" on public.scrape_jobs for select using (auth.uid() = user_id);
create policy "Users insert own jobs" on public.scrape_jobs for insert with check (auth.uid() = user_id);
create policy "Users update own jobs" on public.scrape_jobs for update using (auth.uid() = user_id);
create policy "Users delete own jobs" on public.scrape_jobs for delete using (auth.uid() = user_id);
create index scrape_jobs_user_idx on public.scrape_jobs(user_id, created_at desc);

-- Scrape resources
create table public.scrape_resources (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.scrape_jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  filename text not null,
  source_url text not null,
  size bigint not null default 0,
  content_type text,
  created_at timestamptz not null default now()
);
alter table public.scrape_resources enable row level security;
create policy "Users view own resources" on public.scrape_resources for select using (auth.uid() = user_id);
create policy "Users insert own resources" on public.scrape_resources for insert with check (auth.uid() = user_id);
create policy "Users delete own resources" on public.scrape_resources for delete using (auth.uid() = user_id);
create index scrape_resources_job_idx on public.scrape_resources(job_id);
