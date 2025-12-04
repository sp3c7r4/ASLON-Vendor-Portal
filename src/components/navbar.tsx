"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ 
      redirect: false
    });
    // Manually redirect to ensure we use the current origin
    router.push("/login");
    router.refresh();
  };

  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-black">
              ASLON Portal
            </Link>
            {isVendor && (
              <div className="flex gap-4">
                <Link
                  href="/dashboard/vendor"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname === "/dashboard/vendor" ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname?.startsWith("/jobs") ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  href="/lms"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname?.startsWith("/lms") ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  LMS
                </Link>
                <Link
                  href="/forum"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname?.startsWith("/forum") ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Forum
                </Link>
              </div>
            )}
            {isAdmin && (
              <div className="flex gap-4">
                <Link
                  href="/dashboard/admin"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname === "/dashboard/admin" ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/vendors"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname?.startsWith("/dashboard/admin/vendors") ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Vendors
                </Link>
                <Link
                  href="/dashboard/admin/announcements"
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname?.startsWith("/dashboard/admin/announcements") ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  Announcements
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Log out
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-black">{user?.name}</p>
                    <p className="text-xs leading-none text-gray-600">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isVendor && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/vendor/profile" className="text-black">Profile</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

