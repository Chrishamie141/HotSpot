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
  distanceMeters?: number;
};

type NearbyResult = {
  place_id: string;
  name: string;
  vicinity?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: { open_now?: boolean };
  photos?: Array<{ photo_reference: string }>;
  types?: string[];
  business_status?: string;
};

type PlaceDetailResult = {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: { open_now?: boolean; weekday_text?: string[] };
  photos?: Array<{ photo_reference: string }>;
  types?: string[];
  business_status?: string;
  website?: string;
  formatted_phone_number?: string;
  url?: string;
};

function getApiKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_MAPS_API_KEY");
  return key;
}

function photoUrl(photoReference?: string) {
  if (!photoReference) return null;
  const params = new URLSearchParams({
    maxwidth: "800",
    photoreference: photoReference,
    key: getApiKey()
  });
  return `${GOOGLE_PLACES_BASE_URL}/photo?${params.toString()}`;
}

function mapVenue(result: NearbyResult): GoogleVenue {
  return {
    id: result.place_id,
    source: "google",
    name: result.name,
    address: result.vicinity ?? "",
    lat: result.geometry?.location?.lat ?? 0,
    lng: result.geometry?.location?.lng ?? 0,
    rating: result.rating ?? null,
    totalReviews: result.user_ratings_total ?? 0,
    priceLevel: result.price_level ?? null,
    isOpenNow: result.opening_hours?.open_now ?? null,
    photoUrl: photoUrl(result.photos?.[0]?.photo_reference),
    types: result.types ?? [],
    businessStatus: result.business_status ?? null
  };
}

export async function searchNearbyNightlife(lat: number, lng: number, radius = 4000) {
  const key = getApiKey();
  const types = ["bar", "night_club"];
  const allResults: NearbyResult[] = [];

  for (const type of types) {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radius),
      type,
      key
    });

    const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?${params.toString()}`, {
      next: { revalidate: 180 }
    });

    if (!response.ok) throw new Error(`Google Nearby Search failed for ${type}`);
    const payload = await response.json();
    allResults.push(...(payload.results ?? []));
  }

  const deduped = Array.from(new Map(allResults.map((item) => [item.place_id, item])).values());
  return deduped.map(mapVenue);
}

export async function getPlaceDetails(placeId: string) {
  const key = getApiKey();
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "place_id,name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,photos,business_status,types,website,formatted_phone_number,url",
    key
  });

  const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/details/json?${params.toString()}`, {
    next: { revalidate: 180 }
  });

  if (!response.ok) throw new Error("Google Place Details failed");
  const payload = await response.json();
  const details = payload.result as PlaceDetailResult;

  return {
    id: details.place_id,
    source: "google" as const,
    name: details.name,
    address: details.formatted_address ?? "",
    lat: details.geometry?.location?.lat ?? 0,
    lng: details.geometry?.location?.lng ?? 0,
    rating: details.rating ?? null,
    totalReviews: details.user_ratings_total ?? 0,
    priceLevel: details.price_level ?? null,
    isOpenNow: details.opening_hours?.open_now ?? null,
    photoUrl: photoUrl(details.photos?.[0]?.photo_reference),
    types: details.types ?? [],
    businessStatus: details.business_status ?? null,
    phone: details.formatted_phone_number ?? null,
    website: details.website ?? null,
    mapsUrl: details.url ?? null,
    openingHoursText: details.opening_hours?.weekday_text ?? []
  };
}
