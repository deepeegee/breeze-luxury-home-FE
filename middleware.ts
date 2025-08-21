import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAMES = [
  "admin_session",
  "auth_token",
  "session_token",
  "token",
  "access_token",
  "accessToken",
  "jwt",
];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only applied to routes in the matcher below, but keep a tiny guard:
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/dashboard-") ||
    pathname === "/dashboard-home";

  if (!isProtectedRoute) return NextResponse.next();

  const hasAuth = AUTH_COOKIE_NAMES.some((name) => req.cookies.has(name));

  if (!hasAuth) {
    // remember where the user was going
    const loginUrl = new URL("/login", req.url);
    const from = `${pathname}${search ?? ""}`;
    loginUrl.searchParams.set("from", from);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/dashboard-home",
    // covers routes like /dashboard-add-property, /dashboard-my-profile, etc.
    "/dashboard-:path*",
  ],
};
