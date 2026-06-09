import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Proxy (formerly "middleware" — renamed in Next.js 16). Runs before every
 * matched route and gates the whole app behind a login:
 *
 * - Not logged in + visiting any page → redirect to /login.
 * - Logged in + visiting /login → redirect to the app.
 *
 * Only the signed cookie is checked here (no database); the real per-request
 * user is loaded in Server Components via `getCurrentUser()`.
 */

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.includes(pathname);
  const session = verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/defects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
