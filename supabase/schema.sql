
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Create policy to allow users to view their own profile
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Create policy to allow authenticated users to insert their own profile
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Create interview_sessions table
create table interview_sessions (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references auth.users not null,
  setup jsonb not null,
  questions jsonb not null,
  answers jsonb,
  feedback jsonb,
  status text not null check (status in ('created', 'in-progress', 'completed')),
  "createdAt" timestamp with time zone default now() not null
);

-- Enable RLS for interview_sessions
alter table interview_sessions enable row level security;

-- Create policy to allow users to view their own interview sessions
create policy "Users can view their own interview sessions" on interview_sessions
  for select using (auth.uid() = "userId");

-- Create policy to allow users to insert their own interview sessions
create policy "Users can insert their own interview sessions" on interview_sessions
  for insert with check (auth.uid() = "userId");

-- Create policy to allow users to update their own interview sessions
create policy "Users can update their own interview sessions" on interview_sessions
  for update using (auth.uid() = "userId");

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
