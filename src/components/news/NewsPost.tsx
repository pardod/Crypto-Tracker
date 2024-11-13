import { Card } from "@/components/ui/card";
import { NewsPostActions } from "./NewsPostActions";
import { PostReactions } from "./PostReactions";
import { format, isToday, isYesterday } from "date-fns";

interface NewsPostProps {
  post: {
    id: string;
    title: string;
    content?: string | null;
    link?: string | null;
    created_at: string;
    user_id: string;
    user_email: string;
    username: string;
    score: number;
  };
  currentUserId?: string;
  onDelete: () => void;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MM/dd/yy h:mm a');
};

export const NewsPost = ({ post, currentUserId, onDelete }: NewsPostProps) => {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h2 className="text-xl font-bold">{post.title}</h2>
          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {post.link}
            </a>
          )}
          {post.content && (
            <p className="whitespace-pre-wrap text-muted-foreground">
              {post.content}
            </p>
          )}
          <PostReactions postId={post.id} initialScore={post.score} />
          <p className="text-sm text-muted-foreground">
            Posted by {post.username || post.user_email} on{" "}
            {formatTimestamp(post.created_at)}
          </p>
        </div>
        <NewsPostActions
          postId={post.id}
          userId={post.user_id}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
};