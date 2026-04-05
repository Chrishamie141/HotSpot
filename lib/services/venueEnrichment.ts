import { calculateBuzzScore } from "@/lib/buzz-score-engine";
import { prisma } from "@/lib/prisma";
import { GoogleVenue } from "@/lib/services/googlePlaces";

type EnrichedVenue = GoogleVenue & {
  buzzScore: number;
  crowdLabel: string;
  confidence: string;
  lineEstimate: string;
  comparedToUsual: string;
  dressCode: string | null;
  coverTonight: number | null;
  liveReportsCount: number;
  lastUpdated: string | null;
  distanceMeters?: number;
};

export async function enrichVenues(venues: GoogleVenue[]): Promise<EnrichedVenue[]> {
  if (!venues.length) return [];

  const localVenues = await prisma.venue.findMany({
    where: { googlePlaceId: { in: venues.map((venue) => venue.id) } },
    include: {
      dressCode: true,
      events: true,
      liveUpdates: {
        where: { expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 12
      },
      buzzScoreSnapshots: { orderBy: { capturedAt: "desc" }, take: 1 }
    }
  });

  const localMap = new Map(localVenues.map((venue) => [venue.googlePlaceId, venue]));

  return venues.map((googleVenue) => {
    const local = localMap.get(googleVenue.id);
    const momentum = Math.min((local?.liveUpdates.length ?? 0) * 2, 15);

    const computed = calculateBuzzScore({
      openNow: googleVenue.isOpenNow ?? false,
      venueType: googleVenue.types.includes("night_club") ? "club" : "bar",
      localHour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      rating: googleVenue.rating ?? 4,
      reviewCount: googleVenue.totalReviews,
      reviewRecencyBoost: 5,
      eventBoost: local?.events.length ? 7 : 0,
      liveReportMomentum: momentum,
      ownerUpdateBoost: 4,
      historicalTrend: local?.buzzScoreSnapshots[0]?.score ?? 10,
      neighborhoodIntensity: 8
    });

    return {
      ...googleVenue,
      buzzScore: local?.buzzScoreSnapshots[0]?.score ?? computed.score,
      crowdLabel: local?.liveCrowdLabel ?? computed.crowdLabel,
      confidence: local?.liveConfidence ?? computed.confidence,
      lineEstimate: local?.lineStatus ?? computed.lineEstimate,
      comparedToUsual: local?.comparedToUsual ?? computed.comparedToUsual,
      dressCode: local?.dressCode?.policySummary ?? null,
      coverTonight: local?.coverTonight ?? null,
      liveReportsCount: local?.liveUpdates.length ?? 0,
      lastUpdated: local?.lastUpdatedAt?.toISOString() ?? null
    };
  });
}

export async function enrichVenueDetail(placeId: string, googleVenue: GoogleVenue) {
  const local = await prisma.venue.findUnique({
    where: { googlePlaceId: placeId },
    include: {
      photos: true,
      events: true,
      dressCode: true,
      liveUpdates: { where: { expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" }, take: 20 },
      buzzScoreSnapshots: { orderBy: { capturedAt: "desc" }, take: 20 }
    }
  });

  const [single] = await enrichVenues([googleVenue]);

  return {
    ...single,
    localId: local?.id ?? null,
    events: local?.events ?? [],
    liveReports: local?.liveUpdates ?? [],
    trend: local?.buzzScoreSnapshots ?? [],
    photos: local?.photos ?? []
  };
}
