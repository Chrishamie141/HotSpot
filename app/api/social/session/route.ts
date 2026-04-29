import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/social-auth";

export async function GET() {
  const user = await getOrCreateLocalUser();

  return NextResponse.json({
    id: user.id,
    displayName: user.socialProfile?.displayName ?? user.displayName ?? "User",
    handle: user.socialProfile?.handle ?? "user",
    avatarUrl: user.socialProfile?.avatarUrl ?? null,
  });
}
