-- Add score column to news_posts
ALTER TABLE public.news_posts 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;