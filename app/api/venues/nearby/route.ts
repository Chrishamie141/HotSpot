import { NextRequest, NextResponse } from "next/server";
import { milesToMeters, metersToMiles } from "@/lib/explore/distance";
import { computeVenueBuzz } from "@/lib/explore/ranking";
import { ExploreVenue, RegionKey } from "@/lib/explore/types";
import { FALLBACK_REGION_KEY, getRegionConfig } from "@/lib/explore/regions";
import { getVenueClassification } from "@/lib/services/aiVenueClassification";
import { searchNearbyNightlife } from "@/lib/services/googlePlaces";
import { enrichVenues } from "@/lib/services/venueEnrichment";

const toRad = (value: number) => (value * Math.PI) / 180;

const calculateDistanceMeters = (
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
) => {
  const earth = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return Math.round(
    earth * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  );
};

type NearbyResponse = {
  data: ExploreVenue[];
  meta: {
    region: RegionKey;
    center: { lat: number; lng: number };
    distanceMiles: number;
    distanceMeters: number;
    fallbackUsed: boolean;
    reason?: string | null;
  };
  error?: string;
};

const responseCache = new Map<
  string,
  { data: NearbyResponse; expiresAt: number }
>();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const requestedRegion =
    (params.get("region") as RegionKey | null) ?? FALLBACK_REGION_KEY;

  const rawDistanceMiles = Number(params.get("distanceMiles") ?? 10);
  const distanceMiles =
    Number.isFinite(rawDistanceMiles) && rawDistanceMiles > 0
      ? rawDistanceMiles
      : 10;

  const openNowOnly = params.get("openNowOnly") === "true";
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));

  const region = getRegionConfig(requestedRegion);

  const useGeolocationCenter =
    requestedRegion === "near-me" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  const center = useGeolocationCenter
    ? { lat, lng }
    : region.key === "near-me"
      ? getRegionConfig(FALLBACK_REGION_KEY).center
      : region.center;

  const fallbackUsed = requestedRegion === "near-me" && !useGeolocationCenter;
  const radiusMeters = milesToMeters(distanceMiles);

  const cacheKey = JSON.stringify({
    region: requestedRegion,
    lat: center.lat,
    lng: center.lng,
    radiusMeters,
    openNowOnly,
  });

  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
      },
    });
  }

  console.log("[venues/nearby] request", {
    requestedRegion,
    center,
    distanceMiles,
    radiusMeters,
    openNowOnly,
    fallbackUsed,
  });

  let googleVenues: Awaited<ReturnType<typeof searchNearbyNightlife>> = [];

  try {
    googleVenues = await searchNearbyNightlife(
      center.lat,
      center.lng,
      radiusMeters
    );

    console.log("[venues/nearby] google venues count", googleVenues.length);
  } catch (error) {
    console.error("[venues/nearby] Google Places failed:", error);

    const failedResponse: NearbyResponse = {
      data: [],
      meta: {
        region: requestedRegion,
        center,
        distanceMiles,
        distanceMeters: radiusMeters,
        fallbackUsed,
        reason: "Google Places request failed",
      },
      error: "Unable to load nearby nightlife venues",
    };

    return NextResponse.json(failedResponse, { status: 200 });
  }

  const normalized = await Promise.all(
    googleVenues.map(async (venue) => {
      const distMeters = calculateDistanceMeters(
        center.lat,
        center.lng,
        venue.lat,
        venue.lng
      );

      let classification:
        | Awaited<ReturnType<typeof getVenueClassification>>
        | null = null;

      try {
        classification = await getVenueClassification({
          googlePlaceId: venue.googlePlaceId,
          name: venue.name,
          address: venue.address,
          types: venue.types,
          rating: venue.rating,
          totalReviews: venue.totalReviews,
          priceLevel: venue.priceLevel,
          isOpenNow: venue.isOpenNow,
        });
      } catch (error) {
        console.warn(
          "[venues/nearby] AI classification failed for:",
          venue.name,
          error
        );
      }

      const buzz = computeVenueBuzz({
        name: venue.name,
        types: venue.types,
        rating: venue.rating,
        totalReviews: venue.totalReviews,
        isOpenNow: venue.isOpenNow,
        distanceMeters: distMeters,
        aiClassification: classification?.aiClassification ?? null,
        nightlifeRelevanceScore:
          classification?.nightlifeRelevanceScore ?? null,
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
        nightlifeRelevanceScore:
          classification?.nightlifeRelevanceScore ?? null,
        confidence: classification?.confidence ?? null,
      } satisfies ExploreVenue;
    })
  );

  console.log("[venues/nearby] normalized count", normalized.length);

  const filtered = normalized.filter((venue) => {
    const withinRadius =
      typeof venue.distanceMeters !== "number"
        ? true
        : venue.distanceMeters <= radiusMeters;

    const matchesOpenState = openNowOnly
      ? ["open_now", "closing_soon"].includes(venue.openState)
      : true;

    return withinRadius && matchesOpenState;
  });

  console.log("[venues/nearby] filtered count", filtered.length);

  let enriched: ExploreVenue[] = filtered;

  try {
    enriched = await enrichVenues(filtered);
  } catch (error) {
    console.warn(
      "[venues/nearby] enrichment failed, using filtered venues:",
      error
    );
  }

  const sorted = [...enriched].sort(
    (a, b) =>
      b.buzzScore - a.buzzScore ||
      (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)
  );

  const reason =
    sorted.length === 0
      ? openNowOnly
        ? "No open nightlife venues found for the selected region and distance."
        : "No nightlife venues found for the selected region and distance."
      : null;

  const response: NearbyResponse = {
    data: sorted,
    meta: {
      region: requestedRegion,
      center,
      distanceMiles,
      distanceMeters: radiusMeters,
      fallbackUsed,
      reason,
    },
  };

  responseCache.set(cacheKey, {
    data: response,
    expiresAt: Date.now() + 1000 * 60 * 5,
  });

  console.log("[venues/nearby] final count", sorted.length);

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
    },
  });
}