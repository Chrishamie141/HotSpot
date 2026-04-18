import { NextRequest, NextResponse } from "next/server";
import { toggleFavoriteForUser } from "@/lib/auth/favorites";
import { requireAuth } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    if (!body.venueId || !body.name) {
      return NextResponse.json({ error: "Venue id and name are required." }, { status: 400 });
    }

    const result = await toggleFavoriteForUser({
      userId: user.id,
      venueId: String(body.venueId),
      name: String(body.name),
      address: String(body.address ?? ""),
      type: body.type ?? "other",
      rating: typeof body.rating === "number" ? body.rating : null,
      photoUrl: typeof body.photoUrl === "string" ? body.photoUrl : null,
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
