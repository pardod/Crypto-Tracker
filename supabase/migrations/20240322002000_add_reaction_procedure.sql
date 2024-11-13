-- Create a function to update post reactions atomically
CREATE OR REPLACE FUNCTION public.update_post_reaction(
  post_id_input UUID,
  likes_adjustment INT,
  dislikes_adjustment INT,
  score_adjustment INT
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.news_posts
  SET 
    likes = GREATEST(0, likes + likes_adjustment),
    dislikes = GREATEST(0, dislikes + dislikes_adjustment),
    score = score + score_adjustment
  WHERE id = post_id_input;
END;
$$;