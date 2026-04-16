import {
  classifyVenueTypeWithRules,
  VenueTypeClassification,
} from "@/lib/live/classifyVenueTypeWithRules";
import { classifyVenueTypeFallback } from "@/lib/live/classifyVenueTypeFallback";

type ClassifyInput = {
  name?: string | null;
  types?: string[] | null;
  aiClassification?: string | null;
};

export function classifyVenueType(input: ClassifyInput): VenueTypeClassification {
  const ruleResult = classifyVenueTypeWithRules(input);
  return classifyVenueTypeFallback(input, ruleResult);
}
