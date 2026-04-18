import { NextResponse } from "next/server";
import { listFavoritesForUser } from "@/lib/auth/favorites";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await requireAuth();
    const favorites = await listFavoritesForUser(user.id);
    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
