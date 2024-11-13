import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { NewsPost } from "@/components/news/NewsPost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UsernameDialog } from "@/components/auth/UsernameDialog";
import { useState } from "react";
import { PencilIcon } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);

  const { data: likedPosts } = useQuery({
    queryKey: ["liked-posts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("news_posts")
        .select(`
          *,
          liked_posts!inner(*)
        `)
        .eq("liked_posts.user_id", user.id)
        .eq("liked_posts.reaction_type", "like");

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: dislikedPosts } = useQuery({
    queryKey: ["disliked-posts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("news_posts")
        .select(`
          *,
          liked_posts!inner(*)
        `)
        .eq("liked_posts.user_id", user.id)
        .eq("liked_posts.reaction_type", "dislike");

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-lg font-semibold">Username</h2>
              <p className="text-muted-foreground">{user.email?.split("@")[0]}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUsernameDialog(true)}
              className="h-8 w-8"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Member Since</h2>
            <p className="text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList>
          <TabsTrigger value="liked">Liked Posts ({likedPosts?.length || 0})</TabsTrigger>
          <TabsTrigger value="disliked">Disliked Posts ({dislikedPosts?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="liked" className="space-y-4">
          {likedPosts?.map((post) => (
            <NewsPost
              key={post.id}
              post={post}
              currentUserId={user.id}
              onDelete={() => {}}
            />
          ))}
          {likedPosts?.length === 0 && (
            <p className="text-muted-foreground">No liked posts yet.</p>
          )}
        </TabsContent>
        <TabsContent value="disliked" className="space-y-4">
          {dislikedPosts?.map((post) => (
            <NewsPost
              key={post.id}
              post={post}
              currentUserId={user.id}
              onDelete={() => {}}
            />
          ))}
          {dislikedPosts?.length === 0 && (
            <p className="text-muted-foreground">No disliked posts yet.</p>
          )}
        </TabsContent>
      </Tabs>

      <UsernameDialog
        isOpen={showUsernameDialog}
        onClose={() => setShowUsernameDialog(false)}
        userId={user.id}
      />
    </div>
  );
};

export default Profile;