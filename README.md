# Next.js App Router Supabase Auth

Minimal authentication scaffold for an AI job marketplace MVP.

## Features

- Email/password signup
- Email/password login
- Session stored with Supabase SSR cookies
- Redirect to protected routes after login
- Protected dashboard page

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your Supabase project values.

3. In Supabase Auth settings, make sure your site URL matches your local app, for example:

```text
http://localhost:3000
```

4. Run the app:

```bash
npm run dev
```

## Routes

- `/` public landing page
- `/signup` signup page
- `/login` login page
- `/dashboard` protected page
- `/profile` protected profile page
- `/jobs` public job listing page
- `/dashboard/jobs/new` protected job posting page
- `/api/jobs` authenticated job creation endpoint

## Supabase table

Create a `jobs` table with these columns:

```sql
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  required_skills text[] not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
```

Enable Row Level Security and add policies so only the creator can edit or delete their own jobs:

```sql
alter table public.jobs enable row level security;

create policy "jobs are viewable by everyone"
on public.jobs
for select
using (true);

create policy "authenticated users can create jobs"
on public.jobs
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "creators can update their own jobs"
on public.jobs
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

create policy "creators can delete their own jobs"
on public.jobs
for delete
to authenticated
using (auth.uid() = created_by);
```

Create a `profiles` table with these columns:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  skills text[] not null default '{}'
);
```

Enable Row Level Security for profiles too:

```sql
alter table public.profiles enable row level security;

create policy "users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
```
