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
      return data;
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