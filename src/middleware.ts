import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes - allow access without auth
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isLoggedIn) {
      // @ts-ignore
      const role = req.auth?.user?.role;
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (role === "vendor") {
        return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
      }
      // If role is not set, still redirect to dashboard (let page handle it)
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    // Add return URL to preserve where user wanted to go
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // @ts-ignore
  const role = req.auth?.user?.role;

  // Allow /dashboard to handle its own redirects
  if (pathname === "/dashboard") {
    return NextResponse.next();
  }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin")) {
    if (role !== "admin") {
      if (role === "vendor") {
        return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
      }
      // No role or unknown role - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Vendor-only routes
  if (
    pathname.startsWith("/dashboard/vendor") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/forum") ||
    pathname.startsWith("/lms")
  ) {
    if (role !== "vendor") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      // No role or unknown role - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

