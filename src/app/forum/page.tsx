"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ForumPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [posts, setPosts] = useState(mockStore.forumPosts.getAll());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setPosts(mockStore.forumPosts.getAll());
  }, []);

  const handleCreatePost = () => {
    if (!session?.user?.id || !title || !content) return;

    const user = mockStore.users.findById(session.user.id);
    if (!user) return;

    mockStore.forumPosts.create({
      title,
      content,
      authorId: session.user.id,
      authorName: user.name,
    });

    setPosts(mockStore.forumPosts.getAll());
    setTitle("");
    setContent("");
    setIsCreateOpen(false);
    toast({
      title: "Success",
      description: "Post created successfully",
    });
  };

  const handleDeletePost = (postId: string) => {
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") return;
    mockStore.forumPosts.delete(postId);
    setPosts(mockStore.forumPosts.getAll());
    toast({
      title: "Success",
      description: "Post deleted",
    });
  };

  // @ts-ignore
  if (!session?.user || session.user.role !== "VENDOR") {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Forum</h1>
          <p className="text-muted-foreground">Discuss with other vendors</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Share your thoughts with the community</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post..."
                  rows={6}
                />
              </div>
              <Button onClick={handleCreatePost} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No posts yet. Be the first to post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback>{post.authorName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        by {post.authorName} • {new Date(post.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  {/* @ts-ignore */}
                  {session?.user?.role === "ADMIN" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap mb-4">{post.content}</p>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">
                    Replies ({post.replies.length})
                  </p>
                  <div className="space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 pl-4 border-l-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {reply.authorName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reply.authorName}</p>
                          <p className="text-sm text-muted-foreground">{reply.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <ReplyForm postId={post.id} onReply={() => setPosts(mockStore.forumPosts.getAll())} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ReplyForm({ postId, onReply }: { postId: string; onReply: () => void }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const user = mockStore.users.findById(session.user.id);
      if (!user) return;
      
      // @ts-ignore
      mockStore.forumPosts.addReply(postId, {
        content,
        authorId: session.user.id,
        authorName: user.name,
      });

      setContent("");
      onReply();
      toast({
        title: "Success",
        description: "Reply posted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        Reply
      </Button>
    </form>
  );
}

