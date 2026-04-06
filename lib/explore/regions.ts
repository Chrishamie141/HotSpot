import { RegionConfig, RegionKey } from "@/lib/explore/types";

export const CENTRAL_JERSEY_REGIONS: RegionConfig[] = [
  {
    key: "near-me",
    label: "Near Me",
    center: { lat: 40.4862, lng: -74.4518 },
    supportsGeolocation: true,
    description: "Use your current location to find nearby nightlife."
  },
  {
    key: "new-brunswick",
    label: "New Brunswick",
    center: { lat: 40.4862, lng: -74.4518 },
    description: "College bars, late-night lounges, and packed downtown energy."
  },
  {
    key: "princeton",
    label: "Princeton",
    center: { lat: 40.3573, lng: -74.6672 },
    description: "Upscale cocktail spots, wine bars, and date-night energy."
  },
  {
    key: "edison-metuchen",
    label: "Edison / Metuchen",
    center: { lat: 40.5384, lng: -74.3624 },
    description: "Neighborhood bars, lounges, and reliable weekend crowds."
  },
  {
    key: "red-bank",
    label: "Red Bank",
    center: { lat: 40.3471, lng: -74.0643 },
    description: "Live music venues, cocktails, and walkable nightlife streets."
  },
  {
    key: "asbury-park-shore",
    label: "Asbury Park / Shore",
    center: { lat: 40.2204, lng: -74.0121 },
    description: "Boardwalk nightlife, music clubs, and high-energy shore nights."
  },
  {
    key: "freehold",
    label: "Freehold",
    center: { lat: 40.2601, lng: -74.2746 },
    description: "Downtown bars and late-night local favorites."
  },
  {
    key: "all-central-jersey",
    label: "All Central Jersey",
    center: { lat: 40.3784, lng: -74.4066 },
    description: "Broader Central Jersey sweep for the strongest options tonight."
  }
];

export const FALLBACK_REGION_KEY: RegionKey = "new-brunswick";

export function getRegionConfig(region: RegionKey): RegionConfig {
  return CENTRAL_JERSEY_REGIONS.find((item) => item.key === region)
    ?? CENTRAL_JERSEY_REGIONS.find((item) => item.key === FALLBACK_REGION_KEY)!;
}
