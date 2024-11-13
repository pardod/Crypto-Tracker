import { supabase } from "@/lib/supabase";

export const handlePostReaction = async (
  postId: string,
  userId: string,
  type: 'like' | 'dislike',
  currentReaction: 'like' | 'dislike' | null
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No session");

  try {
    // Step 1: Remove current reaction if it exists
    if (currentReaction) {
      const { error: deleteError } = await supabase
        .from('liked_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
    }

    // If clicking the same reaction type, we're done (the reaction was just removed)
    if (currentReaction === type) {
      return null;
    }

    // Step 2: Add new reaction to liked_posts
    const { error: insertError } = await supabase
      .from('liked_posts')
      .insert([
        {
          post_id: postId,
          user_id: userId,
          reaction_type: type,
        }
      ]);

    if (insertError) throw insertError;

    return type;
  } catch (error) {
    console.error('Error in handlePostReaction:', error);
    throw error;
  }
};
