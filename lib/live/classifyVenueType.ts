import type { VenueType } from "@/lib/live/getVenueType";

export type VenueTypeConfidence = "high" | "medium" | "low";

export type VenueTypeClassification = {
  venueType: VenueType;
  confidence: VenueTypeConfidence;
  reason: string;
};

type ClassifyInput = {
  name?: string | null;
  types?: string[] | null;
  aiClassification?: string | null;
};

const GOOGLE_TYPE_TO_VENUE: Array<{ type: string; venueType: VenueType; score: number }> = [
  { type: "night_club", venueType: "club", score: 6 },
  { type: "bar", venueType: "bar", score: 6 },
  { type: "pub", venueType: "bar", score: 5 },
  { type: "brewery", venueType: "bar", score: 5 },
  { type: "restaurant", venueType: "restaurant", score: 6 },
  { type: "cafe", venueType: "restaurant", score: 5 },
  { type: "meal_takeaway", venueType: "restaurant", score: 4 },
];

const KEYWORDS: Record<Exclude<VenueType, "other">, string[]> = {
  bar: ["bar", "pub", "taproom", "tavern", "cocktail", "speakeasy", "wine bar"],
  club: ["club", "nightclub", "night club", "dance", "dj", "after hours"],
  lounge: ["lounge", "hookah", "shisha", "cigar lounge", "rooftop lounge"],
  restaurant: ["restaurant", "eatery", "kitchen", "grill", "diner", "bistro", "cafe"],
};

export function classifyVenueType(input: ClassifyInput): VenueTypeClassification {
  const normalizedTypes = (input.types ?? []).map((value) => value.toLowerCase());
  const normalizedName = (input.name ?? "").toLowerCase();

  const scores: Record<VenueType, number> = {
    restaurant: 0,
    bar: 0,
    club: 0,
    lounge: 0,
    other: 0,
  };

  for (const mapping of GOOGLE_TYPE_TO_VENUE) {
    if (normalizedTypes.includes(mapping.type)) {
      scores[mapping.venueType] += mapping.score;
    }
  }

  for (const [venueType, keywords] of Object.entries(KEYWORDS) as Array<
    [Exclude<VenueType, "other">, string[]]
  >) {
    if (keywords.some((keyword) => normalizedName.includes(keyword))) {
      scores[venueType] += 2;
    }
  }

  const ranked = (Object.keys(scores) as VenueType[])
    .filter((item) => item !== "other")
    .map((venueType) => ({ venueType, score: scores[venueType] }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];

  if (!top || top.score <= 0) {
    return {
      venueType: "other",
      confidence: "low",
      reason: "No reliable Google type or keyword match",
    };
  }

  const gap = top.score - (second?.score ?? 0);
  const confidence: VenueTypeConfidence = top.score >= 6 && gap >= 2 ? "high" : gap >= 1 ? "medium" : "low";

  if (confidence === "low") {
    return {
      venueType: "other",
      confidence,
      reason: "Low-confidence classification defaulted to other",
    };
  }

  return {
    venueType: top.venueType,
    confidence,
    reason: confidence === "high" ? "Google place types strongly matched" : "Keyword and type signals matched",
  };
}
