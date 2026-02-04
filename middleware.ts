import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");
  const { pathname } = request.nextUrl;
  //pathname is just the path part of the URL, without domain or query string.

  const isLoginPage = pathname.startsWith("/login"); // this allows login, /login/reset and /login/anything
  //startsWith() is a Javascript string method, it returns true if the string begins with that prefix otherwise false

  // ❌ Not logged in → block protected routes
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in → block login page
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); //Everything is fine, continue to page rendering. If this is not returned, request is blocked
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};

{/*This means:

Match everything

EXCEPT:

_next (Next.js internals)

favicon.ico

assets (your static files)

Without this:

CSS files get redirected

JS chunks get redirected

Images break

App crashes

🔥 This line is critical. 
  */}
