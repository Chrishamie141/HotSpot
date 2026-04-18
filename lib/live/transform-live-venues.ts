import { ExploreVenue } from "@/lib/explore/types";

export type LiveStatus = "high" | "moderate" | "low";
export type LiveTrend = "rising" | "falling" | "stable";

export type LiveVenue = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  totalReviews: number;
  openNow: boolean | null;
  distanceMiles: number | null;
  status: LiveStatus;
  trend: LiveTrend;
  estimatedWaitTime: number;
  hotScore: number;
  recommendationScore: number;
  sourceVenue: ExploreVenue;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function getNightWeight(now: Date) {
  const hour = now.getHours();

  if (hour >= 22 || hour <= 1) return 1.15;
  if (hour >= 19 && hour < 22) return 1.05;
  if (hour >= 2 && hour <= 4) return 0.9;

  return 0.8;
}

function getWeekendWeight(now: Date) {
  const day = now.getDay();
  return day === 5 || day === 6 ? 1.08 : 1;
}

function resolveTrend(momentum: number): LiveTrend {
  if (momentum >= 64) return "rising";
  if (momentum <= 45) return "falling";
  return "stable";
}

function resolveStatus(activity: number): LiveStatus {
  if (activity >= 72) return "high";
  if (activity >= 50) return "moderate";
  return "low";
}

function estimateWaitMinutes(activity: number, openNow: boolean | null, distanceMiles: number | null) {
  const openPenalty = openNow === false ? -6 : openNow === true ? 4 : 0;
  const distancePenalty = typeof distanceMiles === "number" ? distanceMiles * 1.5 : 1.5;

  return Math.round(clamp(5 + activity * 0.32 + openPenalty - distancePenalty, 3, 55));
}

export function transformLiveVenues(sourceVenues: ExploreVenue[], now = new Date()): LiveVenue[] {
  const nightWeight = getNightWeight(now);
  const weekendWeight = getWeekendWeight(now);

  return sourceVenues
    .filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng))
    .map((venue) => {
      const rating = venue.rating ?? 3.8;
      const ratingScore = (rating / 5) * 30;
      const reviewScore = clamp(Math.log10((venue.totalReviews ?? 0) + 1) * 12, 0, 24);
      const buzzScore = clamp(venue.buzzScore, 0, 100);
      const openBoost = venue.isOpenNow === true ? 12 : venue.isOpenNow === false ? -12 : 2;
      const distancePenalty =
        typeof venue.distanceMiles === "number"
          ? clamp(venue.distanceMiles * 5, 0, 28)
          : 8;

      const activityRaw =
        (buzzScore * 0.45 + ratingScore + reviewScore + openBoost - distancePenalty) *
        nightWeight *
        weekendWeight;
      const activity = clamp(activityRaw, 0, 100);

      const momentum = clamp(
        buzzScore * 0.5 +
          ratingScore * 0.6 +
          reviewScore * 0.8 +
          (venue.openState === "closing_soon" ? 5 : 0) +
          (venue.openState === "closed" ? -12 : 0) -
          distancePenalty * 0.7,
        0,
        100
      );

      const trend = resolveTrend(momentum);
      const status = resolveStatus(activity);
      const estimatedWaitTime = estimateWaitMinutes(
        activity,
        venue.isOpenNow,
        venue.distanceMiles ?? null
      );

      const trendBoost = trend === "rising" ? 9 : trend === "stable" ? 3 : -6;
      const waitPenalty = estimatedWaitTime * 0.9;
      const distanceBoost = typeof venue.distanceMiles === "number" ? clamp(14 - venue.distanceMiles * 2.2, 0, 14) : 5;

      const hotScore = clamp(activity + trendBoost - waitPenalty * 0.25, 0, 100);
      const recommendationScore = clamp(hotScore + distanceBoost + (venue.isOpenNow ? 8 : 0), 0, 120);

      return {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        lat: venue.lat,
        lng: venue.lng,
        rating: venue.rating,
        totalReviews: venue.totalReviews,
        openNow: venue.isOpenNow,
        distanceMiles: venue.distanceMiles ?? null,
        status,
        trend,
        estimatedWaitTime,
        hotScore,
        recommendationScore,
        sourceVenue: venue,
      } satisfies LiveVenue;
    })
    .sort((a, b) => b.hotScore - a.hotScore);
}

export function getHotRightNow(venues: LiveVenue[], count = 3) {
  return [...venues].sort((a, b) => b.hotScore - a.hotScore).slice(0, count);
}

export function getRecommendation(venues: LiveVenue[]) {
  return [...venues].sort((a, b) => b.recommendationScore - a.recommendationScore)[0] ?? null;
}

export function getRecommendationReasons(venue: LiveVenue) {
  const reasons: string[] = [];

  if (venue.estimatedWaitTime <= 12) reasons.push("low wait");
  if (venue.trend === "rising") reasons.push("trending up");
  if ((venue.distanceMiles ?? 99) <= 1.5) reasons.push("nearby");
  if (venue.openNow === true) reasons.push("open now");
  if ((venue.rating ?? 0) >= 4.3) reasons.push("strong ratings");

  return reasons.slice(0, 3);
}
