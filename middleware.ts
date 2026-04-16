import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

const PROTECTED_PREFIXES = ["/feed", "/live", "/explore", "/profile", "/favorites", "/venue"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isProtected = isProtectedPath || pathname === "/";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed/:path*", "/live/:path*", "/explore/:path*", "/profile/:path*", "/favorites/:path*", "/venue/:path*", "/login", "/signup"],
};
