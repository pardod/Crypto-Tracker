import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CreatePostDialog } from "@/components/news/CreatePostDialog";
import { NewsPost } from "@/components/news/NewsPost";

const News = () => {
  const { user } = useAuth();
  const { data: posts, refetch } = useQuery({
    queryKey: ["news-posts"],
    queryFn: async () => {
      // Fetch posts and calculate like counts
      const { data, error } = await supabase
        .from("news_posts")
        .select(`
          *,
          liked_posts (
            reaction_type
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Calculate the like count for each post by filtering liked_posts
      const postsWithLikeCount = data.map((post) => {
        const likeCount = post.liked_posts?.filter(
          (reaction) => reaction.reaction_type === 'like'
        ).length || 0;

        return {
          ...post,
          likeCount,
        };
      });

      return postsWithLikeCount;
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Crypto News & Discussion</h1>
        {user && <CreatePostDialog onPostCreated={refetch} />}
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <NewsPost
            key={post.id}
            post={post}
            currentUserId={user?.id}
            onDelete={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default News;
