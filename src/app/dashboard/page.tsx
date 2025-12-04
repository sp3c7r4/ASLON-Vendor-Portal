import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  // @ts-ignore
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/vendor");
  }
}

