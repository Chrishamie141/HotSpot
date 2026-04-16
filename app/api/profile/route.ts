import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { updateUserProfile } from "@/lib/auth/users";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const updated = await updateUserProfile(user.id, {
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      bio: typeof body.bio === "string" ? body.bio : undefined,
      avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : undefined,
      username: typeof body.username === "string" ? body.username : undefined,
    });

    if ("error" in updated) {
      return NextResponse.json({ error: updated.error }, { status: 400 });
    }

    return NextResponse.json({ user: updated.user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
