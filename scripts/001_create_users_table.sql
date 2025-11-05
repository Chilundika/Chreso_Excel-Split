-- Create users table for storing user credentials
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  cu_id text unique not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies for users table
-- Users can view their own data
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own data
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

-- Allow anyone to insert (for registration)
create policy "users_insert_public"
  on public.users for insert
  with check (true);

-- Create index on cu_id for faster lookups
create index if not exists users_cu_id_idx on public.users(cu_id);
