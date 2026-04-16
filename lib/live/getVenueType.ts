export type VenueType = "restaurant" | "bar" | "club" | "other";

type VenueTypeInput = {
  types?: string[] | null;
  name?: string | null;
};

const RESTAURANT_TYPES = new Set(["restaurant", "food", "meal_takeaway"]);
const BAR_TYPES = new Set(["bar", "pub"]);
const CLUB_TYPES = new Set(["night_club"]);

export function getVenueType({ types = [], name = "" }: VenueTypeInput): VenueType {
  const resolvedTypes = types ?? [];
  const resolvedName = name ?? "";
  const normalizedTypes = resolvedTypes.map((value) => value.toLowerCase());

  if (normalizedTypes.some((value) => CLUB_TYPES.has(value))) {
    return "club";
  }

  if (normalizedTypes.some((value) => BAR_TYPES.has(value))) {
    return "bar";
  }

  if (normalizedTypes.some((value) => RESTAURANT_TYPES.has(value))) {
    return "restaurant";
  }

  const normalizedName = resolvedName.toLowerCase();

  if (/(club|nightclub|dj|dance)/.test(normalizedName)) {
    return "club";
  }

  if (/(bar|pub|taproom|tavern|lounge)/.test(normalizedName)) {
    return "bar";
  }

  if (/(restaurant|kitchen|eatery|grill|bistro|diner)/.test(normalizedName)) {
    return "restaurant";
  }

  return "other";
}
