export type LocationPermissionStatus =
  | "granted"
  | "denied"
  | "skipped"
  | "manual"
  | null;

export type OnboardingData = {
  firstName: string;
  age: number | null;
  city: string;
  interests: string[];
  photoUrl?: string | null;
  locationPermission: LocationPermissionStatus;
  onboardingComplete: boolean;
  currentStep: number;
  coordinates: { lat: number; lng: number } | null;
};

export const ONBOARDING_STORAGE_KEY = "nightpulse.onboarding.v1";
export const DEFAULT_CITY = "New York City";

export const NIGHTLIFE_INTERESTS = [
  "Clubs",
  "Bars",
  "Lounges",
  "Rooftops",
  "Hookah",
  "Hip-hop",
  "Afrobeat",
  "Latin",
  "EDM",
  "Chill spots",
  "Sports bars",
  "Upscale nightlife",
  "No-cover spots",
] as const;

export const TOTAL_ONBOARDING_STEPS = 8;

export const defaultOnboardingData: OnboardingData = {
  firstName: "",
  age: null,
  city: "",
  interests: [],
  photoUrl: null,
  locationPermission: null,
  onboardingComplete: false,
  currentStep: 0,
  coordinates: null,
};

export function loadOnboardingState(): OnboardingData {
  if (typeof window === "undefined") return defaultOnboardingData;

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return defaultOnboardingData;

    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    return {
      ...defaultOnboardingData,
      ...parsed,
      interests: Array.isArray(parsed.interests)
        ? parsed.interests.filter((value): value is string => typeof value === "string")
        : [],
      age: typeof parsed.age === "number" ? parsed.age : null,
      currentStep:
        typeof parsed.currentStep === "number" && parsed.currentStep >= 0
          ? Math.min(parsed.currentStep, TOTAL_ONBOARDING_STEPS - 1)
          : 0,
      coordinates:
        parsed.coordinates &&
        typeof parsed.coordinates.lat === "number" &&
        typeof parsed.coordinates.lng === "number"
          ? parsed.coordinates
          : null,
    };
  } catch {
    return defaultOnboardingData;
  }
}

export function persistOnboardingState(data: OnboardingData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
}

export function clearOnboardingState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

export function shouldShowOnboarding() {
  return !loadOnboardingState().onboardingComplete;
}

export function getDisplayCity(data: Pick<OnboardingData, "city">) {
  return data.city.trim() || DEFAULT_CITY;
}
