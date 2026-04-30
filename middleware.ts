import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/feed", "/onboarding", "/settings", "/owner", "/favorites", "/events", "/live"];

function parsePayload(token: string) {
  try { const body = token.split(".")[1]; return JSON.parse(Buffer.from(body, "base64url").toString("utf-8")); } catch { return null; }
}

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) return NextResponse.next();

  const token = request.cookies.get("hotspot_session")?.value;
  const payload = token ? parsePayload(token) : null;
  const authed = Boolean(payload?.userId && payload?.exp * 1000 > Date.now());
  const onboardingDone = Boolean(payload?.onboardingCompleted);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!authed && isProtected) return NextResponse.redirect(new URL("/login", origin));
  if (authed && isAuthPage) return NextResponse.redirect(new URL("/profile", origin));
  if (authed && !onboardingDone && isProtected && !pathname.startsWith("/onboarding")) return NextResponse.redirect(new URL("/onboarding", origin));

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
