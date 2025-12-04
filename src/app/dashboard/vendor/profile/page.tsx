import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { mockStore } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  // @ts-ignore
  if (!session?.user || session.user.role !== "vendor") {
    redirect("/login");
  }

  const user = mockStore.users.findById(session.user.id || "");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
