-- Create a new table to track user liked posts
CREATE TABLE IF NOT EXISTS public.liked_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.news_posts(id) ON DELETE CASCADE,
    reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Set up RLS policies
ALTER TABLE public.liked_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own liked posts"
    ON public.liked_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liked posts"
    ON public.liked_posts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked posts"
    ON public.liked_posts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read liked posts"
    ON public.liked_posts
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS liked_posts_user_id_idx ON public.liked_posts(user_id);
CREATE INDEX IF NOT EXISTS liked_posts_post_id_idx ON public.liked_posts(post_id);