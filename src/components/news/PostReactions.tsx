import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { handlePostReaction } from "./PostReactionHandler";
import { supabase } from "@/lib/supabase";

interface PostReactionsProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
}

export const PostReactions = ({ postId, initialLikes, initialDislikes }: PostReactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [dislikes, setDislikes] = useState(initialDislikes || 0);
  const [score, setScore] = useState((initialLikes || 0) - (initialDislikes || 0));

  useEffect(() => {
    const fetchReactions = async () => {
      if (user) {
        // Fetch user's current reaction on the post
        const { data, error } = await supabase
          .from('liked_posts')
          .select('reaction_type')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user reaction:", error);
        } else if (data) {
          setUserReaction(data.reaction_type as 'like' | 'dislike');
        } else {
          setUserReaction(null);
        }
      }

      // Fetch the current like and dislike counts for the post
      await fetchLikeDislikeCounts();
    };

    fetchReactions();
  }, [user, postId]);

  // Function to fetch the latest counts for likes and dislikes
  const fetchLikeDislikeCounts = async () => {
    // Fetch likes count
    const { count: likeCount } = await supabase
      .from('liked_posts')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('reaction_type', 'like');

    // Fetch dislikes count
    const { count: dislikeCount } = await supabase
      .from('liked_posts')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('reaction_type', 'dislike');

    // Ensure likes and dislikes default to 0 if undefined
    const finalLikes = likeCount ?? 0;
    const finalDislikes = dislikeCount ?? 0;

    setLikes(finalLikes);
    setDislikes(finalDislikes);
    setScore(finalLikes - finalDislikes); // Update the score based on latest counts
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to react to posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Handle reaction change and update userReaction state
      const newReaction = await handlePostReaction(postId, user.id, type, userReaction);
      setUserReaction(newReaction);

      // Refetch the updated counts and score from the database
      await fetchLikeDislikeCounts();

      toast({
        title: "Success",
        description: "Your reaction has been updated",
      });
    } catch (error: any) {
      console.error('Error updating reaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mt-2">
      <Button
        variant={userReaction === 'like' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleReaction('like')}
        className="flex items-center gap-2"
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">{score}</span>
      <Button
        variant={userReaction === 'dislike' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleReaction('dislike')}
        className="flex items-center gap-2"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
