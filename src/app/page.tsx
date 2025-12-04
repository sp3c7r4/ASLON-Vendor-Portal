import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    // @ts-ignore
    if (session.user.role === "ADMIN") {
      redirect("/dashboard/admin");
    } else {
      redirect("/dashboard/vendor");
    }
  } else {
    redirect("/login");
  }
}
