import type { VenueType } from "@/lib/live/getVenueType";

export type VenueTypeConfidence = "high" | "medium" | "low";

export type VenueTypeClassification = {
  venueType: VenueType;
  confidence: VenueTypeConfidence;
  reason: string;
  ambiguous: boolean;
  source: "rules" | "fallback";
};

type ClassifyInput = {
  name?: string | null;
  types?: string[] | null;
  aiClassification?: string | null;
};

const CLUB_TYPES = new Set(["night_club"]);
const BAR_TYPES = new Set(["bar", "pub", "brewery"]);
const LOUNGE_TYPES = new Set(["hookah_lounge"]);
const RESTAURANT_TYPES = new Set(["restaurant", "food", "meal_takeaway", "meal_delivery", "cafe"]);

const CLUB_KEYWORDS = ["nightclub", "night club", "dance", "dj", "afterhours", "discotheque"];
const BAR_KEYWORDS = ["bar", "pub", "taproom", "tavern", "cocktail", "wine bar", "sports bar", "brewery", "speakeasy"];
const LOUNGE_KEYWORDS = ["lounge", "hookah", "shisha", "cigar lounge", "rooftop lounge"];
const RESTAURANT_KEYWORDS = ["restaurant", "kitchen", "eatery", "grill", "steakhouse", "sushi", "pizza", "diner", "cafe", "bistro"];
const NON_BAR_GUARD_KEYWORDS = ["comedy", "theater", "performance", "cinema", "movie"];

function containsKeyword(input: string, keywords: string[]) {
  return keywords.some((keyword) => input.includes(keyword));
}

export function classifyVenueTypeWithRules(input: ClassifyInput): VenueTypeClassification {
  const name = (input.name ?? "").toLowerCase();
  const types = (input.types ?? []).map((value) => value.toLowerCase());
  const aiClass = (input.aiClassification ?? "").toLowerCase();

  let clubScore = 0;
  let barScore = 0;
  let loungeScore = 0;
  let restaurantScore = 0;
  const reasons: string[] = [];

  if (types.some((type) => CLUB_TYPES.has(type))) {
    clubScore += 5;
    reasons.push("Matched Google type night_club");
  }
  if (types.some((type) => BAR_TYPES.has(type))) {
    barScore += 4;
    reasons.push("Matched bar/pub/brewery Google type");
  }
  if (types.some((type) => LOUNGE_TYPES.has(type))) {
    loungeScore += 4;
    reasons.push("Matched lounge Google type");
  }
  if (types.some((type) => RESTAURANT_TYPES.has(type))) {
    restaurantScore += 4;
    reasons.push("Matched restaurant/food Google type");
  }

  if (containsKeyword(name, CLUB_KEYWORDS)) {
    clubScore += 4;
    reasons.push("Matched club keyword in name");
  }
  if (containsKeyword(name, BAR_KEYWORDS)) {
    barScore += 3;
    reasons.push("Matched bar keyword in name");
  }
  if (containsKeyword(name, LOUNGE_KEYWORDS)) {
    loungeScore += 3;
    reasons.push("Matched lounge keyword in name");
  }
  if (containsKeyword(name, RESTAURANT_KEYWORDS)) {
    restaurantScore += 3;
    reasons.push("Matched restaurant keyword in name");
  }

  if (containsKeyword(name, NON_BAR_GUARD_KEYWORDS)) {
    barScore -= 3;
    loungeScore -= 2;
    reasons.push("Applied non-bar guard keyword");
  }

  if (aiClass.includes("club") || aiClass.includes("nightlife")) clubScore += 2;
  if (aiClass.includes("bar") || aiClass.includes("cocktail")) barScore += 2;
  if (aiClass.includes("lounge") || aiClass.includes("hookah")) loungeScore += 2;
  if (aiClass.includes("restaurant")) restaurantScore += 2;

  const scored: Array<{ venueType: VenueType; score: number }> = [
    { venueType: "club" as const, score: clubScore },
    { venueType: "bar" as const, score: barScore },
    { venueType: "lounge" as const, score: loungeScore },
    { venueType: "restaurant" as const, score: restaurantScore },
  ].sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];

  if (top.score <= 0) {
    return {
      venueType: "other",
      confidence: "low",
      reason: "No strong venue-type signals",
      ambiguous: true,
      source: "rules",
    };
  }

  const closeRace = top.score - second.score <= 1;

  if (top.venueType === "bar" && restaurantScore > 0 && barScore <= restaurantScore + 1) {
    return {
      venueType: "restaurant",
      confidence: "medium",
      reason: "Restaurant and bar overlap; defaulted to restaurant",
      ambiguous: true,
      source: "rules",
    };
  }

  const confidence: VenueTypeConfidence =
    top.score >= 6 && !closeRace ? "high" : top.score >= 4 ? "medium" : "low";

  return {
    venueType: top.venueType,
    confidence,
    reason: reasons[0] ?? `Top score for ${top.venueType}`,
    ambiguous: closeRace || confidence === "low",
    source: "rules",
  };
}
