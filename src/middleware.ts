import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isLoggedIn) {
      // @ts-ignore
      const role = req.auth?.user?.role;
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (role === "vendor") {
        return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // @ts-ignore
  const role = req.auth?.user?.role;

  // Skip role checks if role is not set (let the page handle it)
  if (!role) {
    return NextResponse.next();
  }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    if (role === "vendor") {
      return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Vendor-only routes
  if (
    (pathname.startsWith("/dashboard/vendor") ||
      pathname.startsWith("/jobs") ||
      pathname.startsWith("/forum") ||
      pathname.startsWith("/lms")) &&
    role !== "vendor"
  ) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

