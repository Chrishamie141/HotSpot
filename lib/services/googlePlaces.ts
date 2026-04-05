const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export type GoogleVenue = {
  id: string;
  source: "google";
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  totalReviews: number;
  priceLevel: number | null;
  isOpenNow: boolean | null;
  photoUrl: string | null;
  types: string[];
  businessStatus: string | null;
  googlePlaceId: string;
};

type PlacesResult = {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: { open_now?: boolean };
  photos?: Array<{ photo_reference: string }>;
  types?: string[];
  business_status?: string;
};

type SearchMode =
  | { kind: "nearby"; type?: string; keyword?: string }
  | { kind: "text"; query: string };

const NIGHTLIFE_SEARCH_PLAN: SearchMode[] = [
  { kind: "nearby", type: "bar" },
  { kind: "nearby", type: "night_club" },
  { kind: "nearby", keyword: "lounge" },
  { kind: "text", query: "rooftop bar" },
  { kind: "text", query: "cocktail bar" },
  { kind: "text", query: "sports bar" },
  { kind: "text", query: "hookah lounge" }
];

function getApiKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_MAPS_API_KEY");
  return key;
}

function createPhotoUrl(photoReference?: string) {
  if (!photoReference) return null;
  const params = new URLSearchParams({
    maxwidth: "800",
    photoreference: photoReference,
    key: getApiKey()
  });
  return `${GOOGLE_PLACES_BASE_URL}/photo?${params.toString()}`;
}

function mapGoogleVenue(result: PlacesResult): GoogleVenue {
  return {
    id: result.place_id,
    googlePlaceId: result.place_id,
    source: "google",
    name: result.name,
    address: result.formatted_address ?? result.vicinity ?? "",
    lat: result.geometry?.location?.lat ?? 0,
    lng: result.geometry?.location?.lng ?? 0,
    rating: result.rating ?? null,
    totalReviews: result.user_ratings_total ?? 0,
    priceLevel: result.price_level ?? null,
    isOpenNow: result.opening_hours?.open_now ?? null,
    photoUrl: createPhotoUrl(result.photos?.[0]?.photo_reference),
    types: result.types ?? [],
    businessStatus: result.business_status ?? null
  };
}

async function executeSearch(mode: SearchMode, lat: number, lng: number, radius: number) {
  const key = getApiKey();
  const baseParams = { location: `${lat},${lng}`, radius: String(radius), key };

  if (mode.kind === "nearby") {
    const params = new URLSearchParams({
      ...baseParams,
      ...(mode.type ? { type: mode.type } : {}),
      ...(mode.keyword ? { keyword: mode.keyword } : {})
    });

    const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?${params.toString()}`, {
      next: { revalidate: 60 * 10 }
    });

    if (!response.ok) throw new Error(`Nearby Search failed: ${mode.type ?? mode.keyword}`);
    const payload = await response.json() as { results?: PlacesResult[] };
    return payload.results ?? [];
  }

  const params = new URLSearchParams({
    query: `${mode.query} near ${lat},${lng}`,
    ...baseParams
  });

  const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/textsearch/json?${params.toString()}`, {
    next: { revalidate: 60 * 10 }
  });

  if (!response.ok) throw new Error(`Text Search failed: ${mode.query}`);
  const payload = await response.json() as { results?: PlacesResult[] };
  return payload.results ?? [];
}

export async function searchNearbyNightlife(lat: number, lng: number, radius: number) {
  const resultSets = await Promise.all(NIGHTLIFE_SEARCH_PLAN.map((mode) => executeSearch(mode, lat, lng, radius)));
  const allResults = resultSets.flat();
  const deduped = Array.from(new Map(allResults.map((item) => [item.place_id, item])).values());

  return deduped
    .map(mapGoogleVenue)
    .filter((venue) => venue.lat && venue.lng)
    .filter((venue) => venue.businessStatus !== "CLOSED_PERMANENTLY");
}

export async function getPlaceDetails(placeId: string) {
  const key = getApiKey();
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "place_id,name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,photos,business_status,types,website,formatted_phone_number,url",
    key
  });

  const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/details/json?${params.toString()}`, {
    next: { revalidate: 60 * 30 }
  });

  if (!response.ok) throw new Error("Google Place Details failed");
  const payload = await response.json() as { result: PlacesResult & { website?: string; formatted_phone_number?: string; url?: string; opening_hours?: { open_now?: boolean; weekday_text?: string[] } } };
  const details = payload.result;

  return {
    ...mapGoogleVenue(details),
    phone: details.formatted_phone_number ?? null,
    website: details.website ?? null,
    mapsUrl: details.url ?? null,
    openingHoursText: details.opening_hours?.weekday_text ?? []
  };
}
