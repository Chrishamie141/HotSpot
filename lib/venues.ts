import { ExploreVenue } from "@/lib/explore/types";

export type { ExploreVenue };

type GetExploreVenuesOptions = {
  region?: string;
  distanceMiles?: number;
  openNowOnly?: boolean;
  lat?: number;
  lng?: number;
};

type NearbyResponse = {
  data: ExploreVenue[];
  meta?: {
    region?: string;
    center?: { lat: number; lng: number };
    distanceMiles?: number;
    distanceMeters?: number;
    fallbackUsed?: boolean;
    reason?: string | null;
  };
  error?: string;
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "";
}

function getFallbackVenues(): ExploreVenue[] {
  return [
    {
      id: "fallback-no-venues",
      googlePlaceId: "fallback-no-venues",
      name: "No venues available",
      address: "Check connection",
      photoUrl: null,
      rating: null,
      totalReviews: 0,
      priceLevel: null,
      isOpenNow: null,
      openState: "hours_unavailable",
      distanceMeters: 0,
      distanceMiles: 0,
      crowdLabel: "Quiet",
      buzzScore: 0,
      lat: 0,
      lng: 0,
      types: [],
      aiClassification: "unclear",
      nightlifeRelevanceScore: 0,
      confidence: 0,
      // extra fallback fields requested for safer UI states
      waitTime: 0,
      distance: 0,
      status: "unknown",
    } as ExploreVenue,
  ];
}

export async function getExploreVenues(
  options: GetExploreVenuesOptions = {}
): Promise<ExploreVenue[]> {
  const {
    region = "old-bridge",
    distanceMiles = 10,
    openNowOnly = false,
    lat,
    lng,
  } = options;

  const params = new URLSearchParams({
    region,
    distanceMiles: String(distanceMiles),
    openNowOnly: String(openNowOnly),
  });

  if (typeof lat === "number" && Number.isFinite(lat)) {
    params.set("lat", String(lat));
  }

  if (typeof lng === "number" && Number.isFinite(lng)) {
    params.set("lng", String(lng));
  }

  const baseUrl = getBaseUrl();
  const url = baseUrl
    ? `${baseUrl}/api/venues/nearby?${params.toString()}`
    : `/api/venues/nearby?${params.toString()}`;

  console.log("Fetching venues from:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    console.log("Status:", response.status);

    if (!response.ok) {
      console.error("[getExploreVenues] request failed", response.status, url);
      return getFallbackVenues();
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.error("[getExploreVenues] invalid content-type", contentType, url);
      return getFallbackVenues();
    }

    const rawBody = await response.text();
    let json: NearbyResponse;

    try {
      json = JSON.parse(rawBody) as NearbyResponse;
    } catch (parseError) {
      console.error("[getExploreVenues] JSON parse failed", parseError);
      return getFallbackVenues();
    }

    if (!json || !Array.isArray(json.data)) {
      console.warn("[getExploreVenues] unexpected response shape", json);
      return getFallbackVenues();
    }

    return json.data;
  } catch (error) {
    console.error("Venue fetch failed:", error);
    return getFallbackVenues();
  }
}
