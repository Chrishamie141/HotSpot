import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/feed", "/onboarding", "/settings", "/owner", "/favorites", "/events", "/live"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!isAuthPage && !isProtected) return NextResponse.next();

  const meRes = await fetch(new URL("/api/auth/me", origin), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (meRes.status === 401) {
    if (isProtected) return NextResponse.redirect(new URL("/login", origin));
    return NextResponse.next();
  }

  if (!meRes.ok) return NextResponse.next();

  const session = await meRes.json();
  const onboardingDone = Boolean(session?.user?.onboardingCompleted);

  if (isAuthPage) return NextResponse.redirect(new URL(onboardingDone ? "/profile" : "/onboarding", origin));
  if (!onboardingDone && isProtected && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
