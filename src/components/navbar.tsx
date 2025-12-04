"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              ASLON Portal
            </Link>
            {isVendor && (
              <div className="flex gap-4">
                <Link
                  href="/dashboard/vendor"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard/vendor" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/jobs"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/jobs") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  href="/lms"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/lms") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  LMS
                </Link>
                <Link
                  href="/forum"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/forum") ? "text-primary" : "text-muted-foreground"
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard/admin" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/vendors"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/dashboard/admin/vendors") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Vendors
                </Link>
                <Link
                  href="/dashboard/admin/announcements"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/dashboard/admin/announcements") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Announcements
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isVendor && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/vendor/profile">Profile</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

