import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/social-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const user = await prisma.user.findUnique({ where: { email }, include: { socialProfile: true } });
  if (!user?.passwordHash) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  await setAuthCookie(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      onboardingCompleted: user.socialProfile?.onboardingCompleted ?? false,
    },
  });
}
