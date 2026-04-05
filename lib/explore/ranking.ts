import { ExploreVenue, OpenVenueState, VenueClassification } from "@/lib/explore/types";

export type RankingInput = {
  name: string;
  types: string[];
  rating: number | null;
  totalReviews: number;
  isOpenNow: boolean | null;
  distanceMeters?: number;
  nightlifeRelevanceScore?: number | null;
  aiClassification?: VenueClassification | null;
};

const typeWeights: Record<VenueClassification, number> = {
  club: 1,
  bar: 0.9,
  cocktail_bar: 0.95,
  sports_bar: 0.8,
  lounge: 0.92,
  rooftop: 0.88,
  hookah_lounge: 0.78,
  bar_restaurant: 0.72,
  restaurant: 0.45,
  event_space: 0.6,
  unclear: 0.5
};

const nightlifeKeywords = [
  "lounge",
  "rooftop",
  "cocktail",
  "speakeasy",
  "sports bar",
  "hookah",
  "nightclub",
  "night club",
  "bar"
];

export function getOpenVenueState(isOpenNow: boolean | null, hour: number): OpenVenueState {
  if (isOpenNow === null) return "hours_unavailable";
  if (!isOpenNow) return "closed";
  if (hour >= 1 && hour <= 2) return "closing_soon";
  return "open_now";
}

function getTimeOfDayFit(classification: VenueClassification, hour: number) {
  const isLateNight = hour >= 22 || hour < 2;
  const isEvening = hour >= 18 && hour < 22;

  if (classification === "club") return isLateNight ? 1 : isEvening ? 0.75 : 0.35;
  if (["bar", "cocktail_bar", "lounge", "rooftop", "sports_bar"].includes(classification)) {
    return isEvening ? 1 : isLateNight ? 0.8 : 0.45;
  }

  return isEvening ? 0.7 : 0.4;
}

function getDayFit(classification: VenueClassification, day: number) {
  const weekend = day === 5 || day === 6;
  if (!weekend) return 0.68;
  if (classification === "club") return 1;
  if (["bar", "cocktail_bar", "sports_bar", "lounge", "rooftop"].includes(classification)) return 0.9;
  return 0.75;
}

function getKeywordMatch(name: string, types: string[]) {
  const haystack = `${name} ${types.join(" ")}`.toLowerCase();
  const matches = nightlifeKeywords.filter((keyword) => haystack.includes(keyword)).length;
  return Math.min(1, matches / 3);
}

function getRatingScore(rating: number | null, reviewCount: number) {
  if (!rating) return 0.45;
  const quality = Math.min(1, rating / 5);
  const confidence = Math.min(1, Math.log10(reviewCount + 1) / 3);
  return 0.7 * quality + 0.3 * confidence;
}

function distancePenalty(distanceMeters = 0) {
  if (distanceMeters <= 8047) return 0;
  if (distanceMeters <= 16093) return 0.08;
  if (distanceMeters <= 40234) return 0.2;
  return 0.36;
}

function getOpenStateWeight(state: OpenVenueState) {
  if (state === "open_now") return 1;
  if (state === "closing_soon") return 0.75;
  if (state === "hours_unavailable") return 0.55;
  return 0.18;
}

export function computeVenueBuzz(input: RankingInput, now = new Date()) {
  const day = now.getDay();
  const hour = now.getHours();

  const openState = getOpenVenueState(input.isOpenNow, hour);
  const classification = input.aiClassification ?? inferClassificationFromTypes(input.types);
  const typeFit = typeWeights[classification] ?? typeWeights.unclear;
  const keywordScore = getKeywordMatch(input.name, input.types);
  const ratingScore = getRatingScore(input.rating, input.totalReviews);
  const todFit = getTimeOfDayFit(classification, hour);
  const dowFit = getDayFit(classification, day);
  const aiRelevance = input.nightlifeRelevanceScore ?? 0.5;

  const weighted =
    getOpenStateWeight(openState) * 0.24 +
    todFit * 0.12 +
    dowFit * 0.08 +
    typeFit * 0.15 +
    keywordScore * 0.1 +
    ratingScore * 0.17 +
    aiRelevance * 0.14;

  const score = Math.round(Math.max(0, Math.min(100, (weighted - distancePenalty(input.distanceMeters)) * 100)));

  const crowdLabel: ExploreVenue["crowdLabel"] =
    score >= 82 ? "Packed" : score >= 66 ? "Hot" : score >= 45 ? "Active" : "Quiet";

  return {
    buzzScore: score,
    crowdLabel,
    openState,
    classification
  };
}

export function inferClassificationFromTypes(types: string[]): VenueClassification {
  const joined = types.join(" ").toLowerCase();
  if (joined.includes("night_club")) return "club";
  if (joined.includes("bar") && joined.includes("restaurant")) return "bar_restaurant";
  if (joined.includes("bar")) return "bar";
  if (joined.includes("restaurant")) return "restaurant";
  return "unclear";
}
