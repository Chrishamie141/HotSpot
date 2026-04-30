import { NextResponse } from "next/server";
import { getCurrentUserFromSession } from "@/lib/auth-session";

export async function GET() {
  const user = await getCurrentUserFromSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      onboardingCompleted: user.socialProfile?.onboardingCompleted ?? false,
      socialProfile: user.socialProfile,
    },
  });
}
