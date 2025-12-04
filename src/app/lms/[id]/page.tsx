"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import { Play, Download, CheckCircle2 } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const courseId = params.id as string;
  const [course, setCourse] = useState(mockStore.courses.findById(courseId));
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const currentCourse = mockStore.courses.findById(courseId);
    if (!currentCourse) {
      router.push("/lms");
      return;
    }
    setCourse(currentCourse);

    if (session?.user?.id) {
      const courseProgress = mockStore.courseProgress.getByUserAndCourse(
        session.user.id,
        courseId
      );
      if (courseProgress) {
        setProgress(courseProgress.progress);
        setCompleted(courseProgress.completed);
      }
    }
  }, [courseId, router, session]);

  if (!course) {
    return null;
  }

  const handleProgressUpdate = (newProgress: number) => {
    if (!session?.user?.id) return;

    const isCompleted = newProgress >= 100;
    mockStore.courseProgress.update(session.user.id, courseId, newProgress, isCompleted);
    setProgress(newProgress);
    setCompleted(isCompleted);

    if (isCompleted) {
      toast({
        title: "Congratulations!",
        description: "You've completed this course!",
      });
    }
  };

  const handleDownloadCertificate = () => {
    if (!completed) {
      toast({
        title: "Not Available",
        description: "Complete the course to download certificate",
        variant: "destructive",
      });
      return;
    }

    // Mock certificate download
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded (mock)",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/lms")} className="mb-4">
          ← Back to Courses
        </Button>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2">{course.description}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Content</CardTitle>
            {completed && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Play className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Video content placeholder. In a real application, this would display the course video.
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {course.duration} minutes
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleProgressUpdate(Math.min(progress + 25, 100))}
              disabled={completed}
              className="flex-1"
            >
              {completed ? "Completed" : "Mark 25% Complete"}
            </Button>
            <Button
              onClick={() => handleProgressUpdate(100)}
              disabled={completed}
              variant="outline"
              className="flex-1"
            >
              Mark as Complete
            </Button>
          </div>

          {completed && (
            <div className="border-t pt-6">
              <Button onClick={handleDownloadCertificate} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

