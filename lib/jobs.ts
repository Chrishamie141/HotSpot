import { prisma } from "@/lib/prisma";
import { calculateBuzzScore } from "@/lib/buzz-score-engine";

async function runJobs() {
  const venues = await prisma.venue.findMany({ include: { liveUpdates: true } });

  for (const venue of venues) {
    const result = calculateBuzzScore({
      openNow: venue.openNow,
      venueType: (venue.type as "bar" | "club" | "lounge" | "rooftop") ?? "bar",
      localHour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      rating: venue.rating ?? 4,
      reviewCount: venue.reviewCount,
      reviewRecencyBoost: 5,
      eventBoost: 6,
      liveReportMomentum: Math.min(15, venue.liveUpdates.length * 2),
      ownerUpdateBoost: 4,
      historicalTrend: 10,
      neighborhoodIntensity: 9
    });

    await prisma.buzzScoreSnapshot.create({
      data: {
        venueId: venue.id,
        score: result.score,
        crowdLabel: result.crowdLabel,
        confidence: result.confidence,
        comparedToUsual: result.comparedToUsual,
        lineEstimate: result.lineEstimate,
        summaryReason: result.summaryReason,
        signalPayload: result
      }
    });
  }
}

runJobs()
  .then(() => {
    console.log("NightPulse jobs complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
