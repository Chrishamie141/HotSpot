export type RegionKey =
  | "near-me"
  | "new-brunswick"
  | "princeton"
  | "edison-metuchen"
  | "red-bank"
  | "asbury-park-shore"
  | "freehold"
  | "all-central-jersey";

export type OpenVenueState = "open_now" | "closing_soon" | "closed" | "hours_unavailable";

export type VenueClassification =
  | "club"
  | "bar"
  | "cocktail_bar"
  | "sports_bar"
  | "lounge"
  | "rooftop"
  | "hookah_lounge"
  | "bar_restaurant"
  | "restaurant"
  | "event_space"
  | "unclear";

export type ExploreVenue = {
  id: string;
  name: string;
  address: string;
  photoUrl: string | null;
  rating: number | null;
  totalReviews: number;
  priceLevel: number | null;
  isOpenNow: boolean | null;
  openState: OpenVenueState;
  distanceMeters?: number;
  distanceMiles?: number;
  crowdLabel: "Quiet" | "Active" | "Hot" | "Packed";
  buzzScore: number;
  lat: number;
  lng: number;
  googlePlaceId: string;
  types: string[];
  aiClassification?: VenueClassification | null;
  nightlifeRelevanceScore?: number | null;
  confidence?: number | null;
};

export type DistanceOption = {
  miles: 5 | 10 | 25 | 50;
  meters: number;
  label: string;
};

export type RegionConfig = {
  key: RegionKey;
  label: string;
  center: { lat: number; lng: number };
  supportsGeolocation?: boolean;
};
