import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const DASHBOARD_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  const isDashboard = pathname.startsWith(DASHBOARD_ROUTE);

  // Not logged in → block dashboard only
  if (!accessToken) {
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Logged in → block auth pages
  if (isAuthRoute) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  // root redirect (optional UX improvement)
  if (pathname === "/") {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard/:path*",
    "/collectibles/:path*",
    "/collection/:path*",
    "/defects/:path*",
    "/leaderboard/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/report/:path*",
    "/scan/:path*",
    "/token/:path*",
  ],
};
