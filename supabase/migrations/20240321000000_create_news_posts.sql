create table if not exists public.news_posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text default null,
    link text default null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) not null,
    user_email text not null
);

-- Set up Row Level Security (RLS)
alter table public.news_posts enable row level security;

-- Create policies
create policy "Anyone can read news posts"
    on public.news_posts
    for select
    to authenticated, anon
    using (true);

create policy "Users can create their own posts"
    on public.news_posts
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
    on public.news_posts
    for delete
    to authenticated
    using (auth.uid() = user_id);