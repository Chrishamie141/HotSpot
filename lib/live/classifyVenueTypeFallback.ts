import {
  classifyVenueTypeWithRules,
  VenueTypeClassification,
} from "@/lib/live/classifyVenueTypeWithRules";

type FallbackInput = {
  name?: string | null;
  types?: string[] | null;
  aiClassification?: string | null;
};

const cache = new Map<string, VenueTypeClassification>();

export function classifyVenueTypeFallback(
  input: FallbackInput,
  rulesResult: VenueTypeClassification
): VenueTypeClassification {
  if (!rulesResult.ambiguous) {
    return rulesResult;
  }

  const key = JSON.stringify({
    name: input.name ?? "",
    types: input.types ?? [],
    aiClassification: input.aiClassification ?? "",
  });

  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const normalizedName = (input.name ?? "").toLowerCase();

  let resolved: VenueTypeClassification;

  if (/(rooftop|speakeasy|tap|brew|cocktail|wine)/.test(normalizedName)) {
    resolved = {
      venueType: "bar",
      confidence: "medium",
      reason: "Fallback keyword matched bar/lounge intent",
      ambiguous: false,
      source: "fallback",
    };
  } else if (/(sushi|pizza|steak|ramen|kitchen|diner|eatery)/.test(normalizedName)) {
    resolved = {
      venueType: "restaurant",
      confidence: "medium",
      reason: "Fallback keyword matched dining intent",
      ambiguous: false,
      source: "fallback",
    };
  } else if (/(night|club|dance|dj|after)/.test(normalizedName)) {
    resolved = {
      venueType: "club",
      confidence: "medium",
      reason: "Fallback keyword matched nightlife/club intent",
      ambiguous: false,
      source: "fallback",
    };
  } else {
    resolved = {
      ...classifyVenueTypeWithRules(input),
      venueType: "other",
      confidence: "low",
      reason: "Fallback could not confidently classify venue",
      ambiguous: false,
      source: "fallback",
    };
  }

  cache.set(key, resolved);
  return resolved;
}
