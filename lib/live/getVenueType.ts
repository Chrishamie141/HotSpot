import { classifyVenueType } from "@/lib/live/classifyVenueType";

export type VenueType = "restaurant" | "bar" | "club" | "lounge" | "other";

type VenueTypeInput = {
  types?: string[] | null;
  name?: string | null;
  aiClassification?: string | null;
};

export function getVenueType({ types = [], name = "", aiClassification = "" }: VenueTypeInput): VenueType {
  return classifyVenueType({ types, name, aiClassification }).venueType;
}
