import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname.startsWith("/login");

  // ❌ Not logged in → block protected routes
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in → block login page
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
