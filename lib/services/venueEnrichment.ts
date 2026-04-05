import { computeVenueBuzz } from "@/lib/explore/ranking";
import { ExploreVenue } from "@/lib/explore/types";
import { prisma } from "@/lib/prisma";
import { GoogleVenue } from "@/lib/services/googlePlaces";

type EnrichedVenue = ExploreVenue & {
  lineEstimate: string;
  comparedToUsual: string;
  dressCode: string | null;
  coverTonight: number | null;
  liveReportsCount: number;
  lastUpdated: string | null;
};

export async function enrichVenues(venues: ExploreVenue[]): Promise<EnrichedVenue[]> {
  if (!venues.length) return [];

  const localVenues = await prisma.venue.findMany({
    where: { googlePlaceId: { in: venues.map((venue) => venue.googlePlaceId) } },
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
  }).catch(() => []);

  const localMap = new Map(localVenues.map((venue) => [venue.googlePlaceId, venue]));

  return venues.map((venue) => {
    const local = localMap.get(venue.googlePlaceId);
    const computed = computeVenueBuzz({
      name: venue.name,
      types: venue.types,
      rating: venue.rating,
      totalReviews: venue.totalReviews,
      isOpenNow: venue.isOpenNow,
      distanceMeters: venue.distanceMeters,
      aiClassification: venue.aiClassification ?? null,
      nightlifeRelevanceScore: venue.nightlifeRelevanceScore ?? null
    });

    return {
      ...venue,
      buzzScore: local?.buzzScoreSnapshots[0]?.score ?? computed.buzzScore,
      crowdLabel: local?.liveCrowdLabel ? mapCrowdLabel(local.liveCrowdLabel) : computed.crowdLabel,
      lineEstimate: local?.lineStatus ?? "unknown",
      comparedToUsual: local?.comparedToUsual ?? "normal",
      dressCode: local?.dressCode?.policySummary ?? null,
      coverTonight: local?.coverTonight ?? null,
      liveReportsCount: local?.liveUpdates.length ?? 0,
      lastUpdated: local?.lastUpdatedAt?.toISOString() ?? null
    };
  });
}

function mapCrowdLabel(label: string): ExploreVenue["crowdLabel"] {
  const normalized = label.toUpperCase();
  if (normalized === "PACKED") return "Packed";
  if (normalized === "HOT") return "Hot";
  if (normalized === "ACTIVE") return "Active";
  return "Quiet";
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

  const ranked = computeVenueBuzz({
    name: googleVenue.name,
    types: googleVenue.types,
    rating: googleVenue.rating,
    totalReviews: googleVenue.totalReviews,
    isOpenNow: googleVenue.isOpenNow
  });

  const [single] = await enrichVenues([
    {
      ...googleVenue,
      crowdLabel: ranked.crowdLabel,
      buzzScore: ranked.buzzScore,
      openState: ranked.openState
    }
  ]);

  return {
    ...single,
    localId: local?.id ?? null,
    events: local?.events ?? [],
    liveReports: local?.liveUpdates ?? [],
    trend: local?.buzzScoreSnapshots ?? [],
    photos: local?.photos ?? [],
    phone: (googleVenue as GoogleVenue & { phone?: string | null }).phone ?? null,
    website: (googleVenue as GoogleVenue & { website?: string | null }).website ?? null,
    mapsUrl: (googleVenue as GoogleVenue & { mapsUrl?: string | null }).mapsUrl ?? null,
    openingHoursText: (googleVenue as GoogleVenue & { openingHoursText?: string[] }).openingHoursText ?? []
  };
}
