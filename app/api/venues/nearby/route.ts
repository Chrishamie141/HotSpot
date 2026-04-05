import { NextRequest, NextResponse } from "next/server";
import { milesToMeters, metersToMiles } from "@/lib/explore/distance";
import { computeVenueBuzz } from "@/lib/explore/ranking";
import { ExploreVenue, RegionKey } from "@/lib/explore/types";
import { FALLBACK_REGION_KEY, getRegionConfig } from "@/lib/explore/regions";
import { getVenueClassification } from "@/lib/services/aiVenueClassification";
import { searchNearbyNightlife } from "@/lib/services/googlePlaces";
import { enrichVenues } from "@/lib/services/venueEnrichment";

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

type NearbyResponse = {
  data: ExploreVenue[];
  meta: {
    region: RegionKey;
    center: { lat: number; lng: number };
    distanceMiles: number;
    distanceMeters: number;
    fallbackUsed: boolean;
  };
};

const responseCache = new Map<string, { data: NearbyResponse; expiresAt: number }>();

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const requestedRegion = (params.get("region") as RegionKey | null) ?? FALLBACK_REGION_KEY;
    const distanceMiles = Number(params.get("distanceMiles") ?? 10);
    const openNowOnly = params.get("openNowOnly") === "true";
    const lat = Number(params.get("lat"));
    const lng = Number(params.get("lng"));

    const region = getRegionConfig(requestedRegion);
    const useGeolocationCenter = requestedRegion === "near-me" && Number.isFinite(lat) && Number.isFinite(lng);
    const center = useGeolocationCenter ? { lat, lng } : region.key === "near-me" ? getRegionConfig(FALLBACK_REGION_KEY).center : region.center;
    const fallbackUsed = requestedRegion === "near-me" && !useGeolocationCenter;

    const radiusMeters = milesToMeters(distanceMiles);
    const cacheKey = JSON.stringify({ region: requestedRegion, lat: center.lat, lng: center.lng, radiusMeters, openNowOnly });
    const cached = responseCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
        }
      });
    }

    const googleVenues = await searchNearbyNightlife(center.lat, center.lng, radiusMeters);
    const normalized = await Promise.all(
      googleVenues.map(async (venue) => {
        const distMeters = distanceMeters(center.lat, center.lng, venue.lat, venue.lng);
        const classification = await getVenueClassification({
          googlePlaceId: venue.googlePlaceId,
          name: venue.name,
          address: venue.address,
          types: venue.types,
          rating: venue.rating,
          totalReviews: venue.totalReviews,
          priceLevel: venue.priceLevel,
          isOpenNow: venue.isOpenNow
        }).catch(() => null);

        const buzz = computeVenueBuzz({
          name: venue.name,
          types: venue.types,
          rating: venue.rating,
          totalReviews: venue.totalReviews,
          isOpenNow: venue.isOpenNow,
          distanceMeters: distMeters,
          aiClassification: classification?.aiClassification ?? null,
          nightlifeRelevanceScore: classification?.nightlifeRelevanceScore ?? null
        });

        return {
          id: venue.googlePlaceId,
          name: venue.name,
          address: venue.address,
          photoUrl: venue.photoUrl,
          rating: venue.rating,
          totalReviews: venue.totalReviews,
          priceLevel: venue.priceLevel,
          isOpenNow: venue.isOpenNow,
          openState: buzz.openState,
          distanceMeters: distMeters,
          distanceMiles: metersToMiles(distMeters),
          crowdLabel: buzz.crowdLabel,
          buzzScore: buzz.buzzScore,
          lat: venue.lat,
          lng: venue.lng,
          googlePlaceId: venue.googlePlaceId,
          types: venue.types,
          aiClassification: classification?.aiClassification ?? null,
          nightlifeRelevanceScore: classification?.nightlifeRelevanceScore ?? null,
          confidence: classification?.confidence ?? null
        } satisfies ExploreVenue;
      })
    );

    const filtered = normalized
      .filter((venue) => venue.distanceMeters !== undefined && venue.distanceMeters <= radiusMeters)
      .filter((venue) => (openNowOnly ? ["open_now", "closing_soon"].includes(venue.openState) : true));

    const enriched = await enrichVenues(filtered);
    const sorted = enriched.sort((a, b) => b.buzzScore - a.buzzScore || (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));

    const response: NearbyResponse = {
      data: sorted,
      meta: {
        region: requestedRegion,
        center,
        distanceMiles,
        distanceMeters: radiusMeters,
        fallbackUsed
      }
    };

    responseCache.set(cacheKey, { data: response, expiresAt: Date.now() + 1000 * 60 * 5 });

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load nearby nightlife venues", detail: String(error), data: [] },
      { status: 500 }
    );
  }
}
