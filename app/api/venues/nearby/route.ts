import { NextRequest, NextResponse } from "next/server";
import { inferClassificationFromTypes, computeVenueBuzz } from "@/lib/explore/ranking";
import { milesToMeters, metersToMiles, DEFAULT_DISTANCE_MILES, DISTANCE_OPTIONS } from "@/lib/explore/distance";
import { ExploreSort, ExploreVenue, RegionKey, VenueClassification, VenueTypeFilter } from "@/lib/explore/types";
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
    emptyReason?: string;
  };
};

const responseCache = new Map<string, { data: NearbyResponse; expiresAt: number }>();

function parseDistanceMiles(value: string | null) {
  const parsed = Number(value ?? DEFAULT_DISTANCE_MILES);
  if (DISTANCE_OPTIONS.some((option) => option.miles === parsed)) return parsed;
  return DEFAULT_DISTANCE_MILES;
}

function parseSort(value: string | null): ExploreSort {
  if (value === "closest" || value === "highest-rated" || value === "hottest-now" || value === "best-match") {
    return value;
  }
  return "best-match";
}

function parseTypeFilters(value: string | null): VenueTypeFilter[] {
  if (!value) return [];
  const allowed: VenueTypeFilter[] = ["bars", "clubs", "lounges", "rooftops", "sports-bars", "hookah-lounges"];
  return value.split(",").map((item) => item.trim() as VenueTypeFilter).filter((item) => allowed.includes(item));
}

function resolveClassification(venue: ExploreVenue): VenueClassification {
  return venue.aiClassification ?? inferClassificationFromTypes(venue.types);
}

function matchesTypeFilters(venue: ExploreVenue, selectedTypes: VenueTypeFilter[]) {
  if (!selectedTypes.length) return true;
  const classification = resolveClassification(venue);

  const checks: Record<VenueTypeFilter, boolean> = {
    bars: ["bar", "cocktail_bar", "bar_restaurant"].includes(classification),
    clubs: classification === "club",
    lounges: classification === "lounge",
    rooftops: classification === "rooftop" || venue.name.toLowerCase().includes("rooftop"),
    "sports-bars": classification === "sports_bar" || venue.name.toLowerCase().includes("sports"),
    "hookah-lounges": classification === "hookah_lounge" || venue.name.toLowerCase().includes("hookah")
  };

  return selectedTypes.some((type) => checks[type]);
}

function sortVenues(venues: ExploreVenue[], sort: ExploreSort) {
  if (sort === "closest") {
    return venues.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0) || b.buzzScore - a.buzzScore);
  }
  if (sort === "highest-rated") {
    return venues.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.totalReviews - a.totalReviews);
  }
  if (sort === "hottest-now") {
    return venues.sort((a, b) => b.buzzScore - a.buzzScore || (b.isOpenNow ? 1 : 0) - (a.isOpenNow ? 1 : 0));
  }

  return venues.sort((a, b) => {
    const openDelta = (b.isOpenNow ? 1 : 0) - (a.isOpenNow ? 1 : 0);
    if (openDelta !== 0) return openDelta;
    return b.buzzScore - a.buzzScore || (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0);
  });
}

async function normalizeAndRankVenues(
  center: { lat: number; lng: number },
  radiusMeters: number,
  googleVenues: Awaited<ReturnType<typeof searchNearbyNightlife>>,
  selectedTypes: VenueTypeFilter[],
  openNowOnly: boolean,
  sort: ExploreSort
) {
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
      }).catch((classificationError) => {
        console.warn("[Explore API] Classification failed", {
          placeId: venue.googlePlaceId,
          error: classificationError instanceof Error ? classificationError.message : String(classificationError)
        });
        return null;
      });

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

  const deduped = Array.from(new Map(normalized.map((item) => [item.googlePlaceId, item])).values());
  const withinRadius = deduped.filter((venue) => venue.distanceMeters !== undefined && venue.distanceMeters <= radiusMeters);
  const typeFiltered = withinRadius.filter((venue) => matchesTypeFilters(venue, selectedTypes));

  const openFiltered = openNowOnly
    ? typeFiltered.filter((venue) => ["open_now", "closing_soon"].includes(venue.openState))
    : typeFiltered;

  const enriched = await enrichVenues(openFiltered);
  const sorted = sortVenues(enriched, sort);

  return { sorted, withinRadius, typeFiltered, openFiltered };
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const requestedRegion = (params.get("region") as RegionKey | null) ?? FALLBACK_REGION_KEY;
    const distanceMiles = parseDistanceMiles(params.get("distanceMiles"));
    const openNowOnly = params.get("openNowOnly") === "true";
    const sort = parseSort(params.get("sort"));
    const selectedTypes = parseTypeFilters(params.get("types"));

    const lat = Number(params.get("lat"));
    const lng = Number(params.get("lng"));

    const region = getRegionConfig(requestedRegion);
    const useGeolocationCenter = requestedRegion === "near-me" && Number.isFinite(lat) && Number.isFinite(lng);
    const fallbackCenter = getRegionConfig(FALLBACK_REGION_KEY).center;
    const center = useGeolocationCenter
      ? { lat, lng }
      : requestedRegion === "near-me"
        ? fallbackCenter
        : region.center;
    const fallbackUsed = requestedRegion === "near-me" && !useGeolocationCenter;

    const radiusMeters = milesToMeters(distanceMiles);
    const cacheKey = JSON.stringify({ region: requestedRegion, lat: center.lat, lng: center.lng, radiusMeters, openNowOnly, sort, selectedTypes });
    const cached = responseCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" }
      });
    }

    console.info("[Explore API] fetch", {
      region: requestedRegion,
      center,
      distanceMiles,
      radiusMeters,
      openNowOnly,
      sort,
      selectedTypes,
      fallbackUsed
    });

    const googleVenues = await searchNearbyNightlife(center.lat, center.lng, radiusMeters);
    let effectiveDistanceMiles = distanceMiles;
    let effectiveRadiusMeters = radiusMeters;
    let fallbackExpandUsed = false;

    let { sorted, withinRadius, typeFiltered, openFiltered } = await normalizeAndRankVenues(
      center,
      effectiveRadiusMeters,
      googleVenues,
      selectedTypes,
      openNowOnly,
      sort
    );

    if (!sorted.length && distanceMiles < 25) {
      fallbackExpandUsed = true;
      effectiveDistanceMiles = 25;
      effectiveRadiusMeters = milesToMeters(25);
      console.info("[Explore API] retrying with expanded radius", { fromMiles: distanceMiles, toMiles: 25 });
      const fallbackGoogleVenues = await searchNearbyNightlife(center.lat, center.lng, effectiveRadiusMeters);
      ({ sorted, withinRadius, typeFiltered, openFiltered } = await normalizeAndRankVenues(
        center,
        effectiveRadiusMeters,
        fallbackGoogleVenues,
        selectedTypes,
        openNowOnly,
        sort
      ));
    }

    if (!sorted.length && effectiveDistanceMiles < 50) {
      fallbackExpandUsed = true;
      effectiveDistanceMiles = 50;
      effectiveRadiusMeters = milesToMeters(50);
      console.info("[Explore API] retrying with expanded radius", { fromMiles: distanceMiles, toMiles: 50 });
      const fallbackGoogleVenues = await searchNearbyNightlife(center.lat, center.lng, effectiveRadiusMeters);
      ({ sorted, withinRadius, typeFiltered, openFiltered } = await normalizeAndRankVenues(
        center,
        effectiveRadiusMeters,
        fallbackGoogleVenues,
        selectedTypes,
        openNowOnly,
        sort
      ));
    }

    let emptyReason: string | undefined;
    if (!withinRadius.length) emptyReason = "No Google Places nightlife results were returned for this center and radius.";
    else if (!typeFiltered.length) emptyReason = "Results were found but none matched the selected venue types.";
    else if (!openFiltered.length && openNowOnly) emptyReason = "No venues are currently open in this area with Open now only enabled.";

    if (!sorted.length) {
      console.warn("[Explore API] empty result", {
        region: requestedRegion,
        center,
        distanceMiles,
        openNowOnly,
        selectedTypes,
        emptyReason
      });
    }

    const response: NearbyResponse = {
      data: sorted,
      meta: {
        region: requestedRegion,
        center,
        distanceMiles: effectiveDistanceMiles,
        distanceMeters: effectiveRadiusMeters,
        fallbackUsed: fallbackUsed || fallbackExpandUsed,
        emptyReason
      }
    };

    responseCache.set(cacheKey, { data: response, expiresAt: Date.now() + 1000 * 60 * 5 });

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" }
    });
  } catch (error) {
    console.error("[Explore API] Unable to load nearby nightlife venues", error);
    return NextResponse.json(
      { error: "Unable to load nearby nightlife venues", detail: String(error), data: [] },
      { status: 500 }
    );
  }
}
