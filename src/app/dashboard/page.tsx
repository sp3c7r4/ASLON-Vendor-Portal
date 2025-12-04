import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // @ts-ignore
  const role = session.user.role;

  // Redirect based on role
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "vendor") {
    redirect("/dashboard/vendor");
  } else {
    // If role is not set, redirect to login to re-authenticate
    redirect("/login?error=SessionInvalid");
  }
}

