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

  return "http://localhost:3000";
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

  const url = `${getBaseUrl()}/api/venues/nearby?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[getExploreVenues] request failed", response.status, url);
      return [];
    }

    const json = (await response.json()) as NearbyResponse;

    if (!json || !Array.isArray(json.data)) {
      console.warn("[getExploreVenues] unexpected response shape", json);
      return [];
    }

    return json.data;
  } catch (error) {
    console.error("[getExploreVenues] unexpected error", error);
    return [];
  }
}