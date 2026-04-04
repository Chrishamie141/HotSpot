import { NextRequest, NextResponse } from "next/server";
import { enrichVenues } from "@/lib/services/venueEnrichment";
import { searchNearbyNightlife } from "@/lib/services/googlePlaces";

const CITY_FALLBACK = { lat: 40.7128, lng: -74.006 };
const toRad = (value: number) => (value * Math.PI) / 180;
const distanceMeters = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const earth = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(earth * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = Number(searchParams.get("lat") ?? CITY_FALLBACK.lat);
    const lng = Number(searchParams.get("lng") ?? CITY_FALLBACK.lng);
    const radius = Number(searchParams.get("radius") ?? 4000);

    const minRating = Number(searchParams.get("minRating") ?? 0);
    const openNow = searchParams.get("openNow") === "true";
    const priceLevels = (searchParams.get("priceLevels") ?? "")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
    const type = searchParams.get("type");

    const venues = (await searchNearbyNightlife(lat, lng, Math.min(Math.max(radius, 3000), 5000))).map((venue) => ({
      ...venue,
      distanceMeters: distanceMeters(lat, lng, venue.lat, venue.lng)
    }));

    const filtered = venues.filter((venue) => {
      const ratingOk = (venue.rating ?? 0) >= minRating;
      const openOk = openNow ? venue.isOpenNow === true : true;
      const priceOk = priceLevels.length ? (venue.priceLevel ? priceLevels.includes(venue.priceLevel) : false) : true;
      const typeOk = type ? venue.types.includes(type) : true;
      return ratingOk && openOk && priceOk && typeOk;
    });

    const enriched = await enrichVenues(filtered);

    return NextResponse.json({ data: enriched, meta: { lat, lng, radius } });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load nightlife venues", detail: String(error) }, { status: 500 });
  }
}
