import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    // @ts-ignore
    const role = session.user.role;
    if (role === "admin") {
      redirect("/dashboard/admin");
    } else if (role === "vendor") {
      redirect("/dashboard/vendor");
    } else {
      // Invalid role, redirect to login
      redirect("/login");
    }
  } else {
    redirect("/login");
  }
}
