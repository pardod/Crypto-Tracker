import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { handlePostReaction } from "./PostReactionHandler";
import { supabase } from "@/lib/supabase";

interface PostReactionsProps {
  postId: string;
  initialScore: number;
}

export const PostReactions = ({ postId, initialScore }: PostReactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    if (user) {
      const fetchUserReaction = async () => {
        const { data, error } = await supabase
          .from('liked_posts')
          .select('reaction_type')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user reaction:", error);
        } else if (data) {
          setUserReaction(data.reaction_type as 'like' | 'dislike');
        }
      };

      fetchUserReaction();
    }
  }, [user, postId]);

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
      const newReaction = await handlePostReaction(postId, user.id, type, userReaction);
      setUserReaction(newReaction);

      // Fetch the updated score
      const { data, error } = await supabase
        .from('news_posts')
        .select('score')
        .eq('id', postId)
        .single();

      if (error) throw error;
      setScore(data.score);

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