import { calculateBuzzScore } from "@/lib/buzz-score-engine";

export const fallbackVenues = [
  {
    id: "mock-1",
    name: "Velvet Circuit",
    neighborhood: "Downtown",
    type: "club" as const,
    dressCode: "Upscale nightlife",
    coverTonight: 30
  },
  {
    id: "mock-2",
    name: "Neon Harbor Rooftop",
    neighborhood: "Waterfront",
    type: "rooftop" as const,
    dressCode: "Smart casual",
    coverTonight: 20
  }
].map((venue) => {
  const buzz = calculateBuzzScore({
    openNow: true,
    venueType: venue.type,
    localHour: 23,
    dayOfWeek: 6,
    rating: 4.5,
    reviewCount: 1400,
    reviewRecencyBoost: 8,
    eventBoost: 8,
    liveReportMomentum: 13,
    ownerUpdateBoost: 7,
    historicalTrend: 10,
    neighborhoodIntensity: 10
  });

  return { ...venue, buzz };
});
