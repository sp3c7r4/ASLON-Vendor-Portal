import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { mockStore } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";

export default async function LMSPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "vendor") {
    redirect("/login");
  }

  const courses = mockStore.courses.getAll();
  const progress = mockStore.courseProgress.getByUser(session.user.id || "");

  const getProgress = (courseId: string) => {
    const courseProgress = progress.find((p) => p.courseId === courseId);
    return courseProgress?.progress || 0;
  };

  const isCompleted = (courseId: string) => {
    const courseProgress = progress.find((p) => p.courseId === courseId);
    return courseProgress?.completed || false;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Management System</h1>
        <p className="text-muted-foreground">Complete courses to improve your skills</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const progressValue = getProgress(course.id);
          const completed = isCompleted(course.id);

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <BookOpen className="h-8 w-8 text-primary" />
                  {completed && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} minutes</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                </div>
                <Link href={`/lms/${course.id}`} className="block">
                  <Button className="w-full" variant={completed ? "outline" : "default"}>
                    {completed ? "Review Course" : progressValue > 0 ? "Continue" : "Start Course"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

