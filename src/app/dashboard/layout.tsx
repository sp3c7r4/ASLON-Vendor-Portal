import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Chatbot } from "@/components/chatbot";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
      {/* @ts-ignore */}
      {session.user.role === "vendor" && <Chatbot />}
    </div>
  );
}

