import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { updateUserProfile } from "@/lib/auth/users";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    if (typeof body.currentPassword === "string" && typeof body.newPassword === "string") {
      if (user.password !== body.currentPassword) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    const updated = await updateUserProfile(user.id, {
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      bio: typeof body.bio === "string" ? body.bio : undefined,
      avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : undefined,
      username: typeof body.username === "string" ? body.username : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      privacyEnabled: typeof body.privacyEnabled === "boolean" ? body.privacyEnabled : undefined,
      notificationsEnabled: typeof body.notificationsEnabled === "boolean" ? body.notificationsEnabled : undefined,
      contentPreferencesEnabled: typeof body.contentPreferencesEnabled === "boolean" ? body.contentPreferencesEnabled : undefined,
      nightlifePreferences: Array.isArray(body.nightlifePreferences) ? body.nightlifePreferences : undefined,
      password: typeof body.newPassword === "string" ? body.newPassword : undefined,
      savedPostIds: Array.isArray(body.savedPostIds) ? body.savedPostIds : undefined,
      taggedPostIds: Array.isArray(body.taggedPostIds) ? body.taggedPostIds : undefined,
    });

    if ("error" in updated) {
      return NextResponse.json({ error: updated.error }, { status: 400 });
    }

    return NextResponse.json({ user: updated.user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
