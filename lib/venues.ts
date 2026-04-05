import { prisma } from "@/lib/prisma";
import { fallbackVenues } from "@/lib/mock-data";

export async function getExploreVenues() {
  try {
    const venues = await prisma.venue.findMany({
      take: 30,
      include: { dressCode: true },
      orderBy: { updatedAt: "desc" }
    });

    if (!venues.length) {
      return fallbackVenues.map((venue) => ({
        ...venue,
        lineStatus: venue.buzz.lineEstimate,
        liveCrowdLabel: venue.buzz.crowdLabel,
        liveConfidence: venue.buzz.confidence,
        comparedToUsual: venue.buzz.comparedToUsual,
        dressCode: { strictness: venue.dressCode }
      }));
    }

    return venues;
  } catch {
    return fallbackVenues.map((venue) => ({
      ...venue,
      lineStatus: venue.buzz.lineEstimate,
      liveCrowdLabel: venue.buzz.crowdLabel,
      liveConfidence: venue.buzz.confidence,
      comparedToUsual: venue.buzz.comparedToUsual,
      dressCode: { strictness: venue.dressCode }
    }));
  }
}
