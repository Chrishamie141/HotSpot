export type VenueStatus = "packed" | "moderate" | "chill";
export type VenueTrend = "rising" | "falling" | "stable";

export type LiveVenue = {
  id: string;
  name: string;
  status: VenueStatus;
  waitTime: number;
  distance: number;
  trend: VenueTrend;
};

export const liveVenues: LiveVenue[] = [
  {
    id: "pulse-lounge",
    name: "Pulse Lounge",
    status: "packed",
    waitTime: 28,
    distance: 0.9,
    trend: "rising",
  },
  {
    id: "moonlight-room",
    name: "Moonlight Room",
    status: "moderate",
    waitTime: 14,
    distance: 0.7,
    trend: "rising",
  },
  {
    id: "neon-vault",
    name: "Neon Vault",
    status: "packed",
    waitTime: 31,
    distance: 1.4,
    trend: "stable",
  },
  {
    id: "echo-rooftop",
    name: "Echo Rooftop",
    status: "chill",
    waitTime: 6,
    distance: 0.5,
    trend: "rising",
  },
  {
    id: "velvet-social",
    name: "Velvet Social",
    status: "moderate",
    waitTime: 12,
    distance: 1.1,
    trend: "falling",
  },
  {
    id: "afterglow-club",
    name: "Afterglow Club",
    status: "chill",
    waitTime: 4,
    distance: 0.8,
    trend: "stable",
  },
];

const statusPriority: Record<VenueStatus, number> = {
  chill: 3,
  moderate: 2,
  packed: 1,
};

const trendPriority: Record<VenueTrend, number> = {
  rising: 3,
  stable: 2,
  falling: 1,
};

export const hotRightNowVenues = [...liveVenues]
  .sort((a, b) => {
    const trendDiff = trendPriority[b.trend] - trendPriority[a.trend];

    if (trendDiff !== 0) {
      return trendDiff;
    }

    const statusDiff = statusPriority[b.status] - statusPriority[a.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return a.waitTime - b.waitTime;
  })
  .slice(0, 3);

export const bestMoveVenue = [...liveVenues].sort((a, b) => {
  const aScore =
    trendPriority[a.trend] * 4 +
    statusPriority[a.status] * 3 +
    Math.max(0, 30 - a.waitTime) * 0.2 +
    Math.max(0, 2 - a.distance) * 2;

  const bScore =
    trendPriority[b.trend] * 4 +
    statusPriority[b.status] * 3 +
    Math.max(0, 30 - b.waitTime) * 0.2 +
    Math.max(0, 2 - b.distance) * 2;

  return bScore - aScore;
})[0];
