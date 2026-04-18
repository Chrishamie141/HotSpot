import { NextRequest, NextResponse } from "next/server";
import { isFavoriteForUser } from "@/lib/auth/favorites";
import { requireAuth } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const venueId = request.nextUrl.searchParams.get("venueId") ?? "";
    if (!venueId) return NextResponse.json({ saved: false });

    const saved = await isFavoriteForUser(user.id, venueId);
    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
