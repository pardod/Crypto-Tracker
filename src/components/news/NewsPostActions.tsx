import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

interface NewsPostActionsProps {
  postId: string;
  userId: string;
  currentUserId?: string;
  onDelete: () => void;
}

export const NewsPostActions = ({ postId, userId, currentUserId, onDelete }: NewsPostActionsProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("news_posts")
        .delete()
        .match({ id: postId, user_id: userId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      onDelete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete post",
      });
    }
  };

  if (currentUserId !== userId) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive/90"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};