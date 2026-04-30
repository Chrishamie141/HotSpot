import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth-session";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!EMAIL_REGEX.test(email)) return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const handleBase = (displayName || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) || "user";
  const handle = `${handleBase}${Date.now().toString().slice(-5)}`;

  const user = await prisma.user.create({
    data: {
      email,
      displayName: displayName || null,
      passwordHash,
      provider: "credentials",
      socialProfile: { create: { handle, displayName: displayName || "User", onboardingCompleted: false, onboarding: {} } },
    },
  });

  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
