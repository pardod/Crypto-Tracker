-- Add likes and dislikes columns to news_posts
ALTER TABLE public.news_posts 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;

-- Create a new table to track user reactions
CREATE TABLE IF NOT EXISTS public.news_post_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.news_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Set up RLS policies
ALTER TABLE public.news_post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own reactions"
    ON public.news_post_reactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions"
    ON public.news_post_reactions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
    ON public.news_post_reactions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read reactions"
    ON public.news_post_reactions
    FOR SELECT
    TO authenticated, anon
    USING (true);