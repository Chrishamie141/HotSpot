import { NextResponse } from "next/server";
import { getPlaceDetails } from "@/lib/services/googlePlaces";
import { enrichVenueDetail } from "@/lib/services/venueEnrichment";

export async function GET(_: Request, { params }: { params: Promise<{ placeId: string }> }) {
  try {
    const { placeId } = await params;
    const details = await getPlaceDetails(placeId);
    const venue = await enrichVenueDetail(placeId, details);
    return NextResponse.json({ data: venue });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load venue", detail: String(error) }, { status: 500 });
  }
}
