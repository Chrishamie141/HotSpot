import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth-session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const authSecret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!code || !clientId || !clientSecret || !appUrl || !authSecret) return NextResponse.redirect(`${appUrl || ""}/login?error=google_config`);

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  if (!tokenRes.ok) return NextResponse.redirect(`${appUrl}/login?error=google`);
  const tokenData = await tokenRes.json();

  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) return NextResponse.redirect(`${appUrl}/login?error=google`);
  const profile = await profileRes.json();
  const email = typeof profile.email === "string" ? profile.email.toLowerCase() : "";
  if (!email) return NextResponse.redirect(`${appUrl}/login?error=google`);

  const user = await prisma.user.upsert({
    where: { email },
    update: { displayName: profile.name || undefined, provider: "google", providerAccountId: profile.sub || undefined },
    create: { email, displayName: profile.name || "", provider: "google", providerAccountId: profile.sub || undefined },
    include: { socialProfile: true },
  });

  if (!user.socialProfile) {
    await prisma.socialProfile.create({ data: { userId: user.id, handle: `user${Date.now()}`, displayName: user.displayName || "User", onboardingCompleted: false, onboarding: {} } });
  }

  const full = await prisma.user.findUnique({ where: { id: user.id }, include: { socialProfile: true } });
  await setSessionCookie(user.id);
  const destination = full?.socialProfile?.onboardingCompleted ? "/profile" : "/onboarding";
  return NextResponse.redirect(`${appUrl}${destination}`);
}
