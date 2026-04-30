import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/social-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    id: user.id,
    displayName: user.socialProfile?.displayName ?? user.displayName ?? "User",
    handle: user.socialProfile?.handle ?? "user",
    avatarUrl: user.socialProfile?.avatarUrl ?? null,
    onboardingCompleted: user.socialProfile?.onboardingCompleted ?? false,
  });
}
