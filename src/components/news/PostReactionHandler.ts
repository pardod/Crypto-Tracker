import { supabase } from "@/lib/supabase";

export const handlePostReaction = async (
  postId: string,
  userId: string,
  type: 'like' | 'dislike',
  currentReaction: 'like' | 'dislike' | null
) => {
  // Start a transaction
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No session");

  try {
    // If there's a current reaction, remove it first
    if (currentReaction) {
      const { error: deleteError } = await supabase
        .from('liked_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Update score based on removing previous reaction
      const scoreChange = currentReaction === 'like' ? -1 : 1;
      const { error: updateError } = await supabase
        .from('news_posts')
        .update({ score: supabase.rpc('increment', { value: scoreChange }) })
        .eq('id', postId);

      if (updateError) throw updateError;
    }

    // If clicking the same reaction type, we're done (it was removed)
    if (currentReaction === type) {
      return null;
    }

    // Add new reaction
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

    // Update score based on new reaction
    const scoreChange = type === 'like' ? 1 : -1;
    const { error: updateError } = await supabase
      .from('news_posts')
      .update({ score: supabase.rpc('increment', { value: scoreChange }) })
      .eq('id', postId);

    if (updateError) throw updateError;

    return type;
  } catch (error) {
    console.error('Error in handlePostReaction:', error);
    throw error;
  }
};