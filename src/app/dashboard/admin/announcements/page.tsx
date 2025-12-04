"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(mockStore.announcements.getAll());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setAnnouncements(mockStore.announcements.getAll());
  }, []);

  // @ts-ignore
  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  const handleCreate = () => {
    if (!session?.user?.id || !title || !content) return;

    mockStore.announcements.create({
      title,
      content,
      authorId: session.user.id,
    });

    setAnnouncements(mockStore.announcements.getAll());
    setTitle("");
    setContent("");
    setIsCreateOpen(false);
    toast({
      title: "Success",
      description: "Announcement created",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage system announcements</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Share important updates with all vendors</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Announcement content..."
                  rows={6}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((ann) => (
            <Card key={ann.id}>
              <CardHeader>
                <CardTitle>{ann.title}</CardTitle>
                <CardDescription>
                  {new Date(ann.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{ann.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

