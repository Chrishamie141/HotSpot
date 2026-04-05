import { PrismaClient, CrowdLabel, ConfidenceLevel, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@nightpulse.app" },
    update: { role: UserRole.ADMIN },
    create: { email: "admin@nightpulse.app", displayName: "NightPulse Admin", role: UserRole.ADMIN }
  });
  const admin = await prisma.user.upsert({
    where: { email: "admin@nightpulse.app" },
    update: {},
    create: { email: "admin@nightpulse.app", displayName: "NightPulse Admin", role: UserRole.ADMIN }
  });

  const venues = [
    {
      googlePlaceId: "seed-place-george-street-social",
      name: "George Street Social",
      type: "club",
      neighborhood: "Downtown",
      address: "110 George St, New Brunswick, NJ",
      latitude: 40.4961,
      longitude: -74.4446,
      rating: 4.6,
      reviewCount: 2142,
      openNow: true,
      lineStatus: "medium",
      coverTonight: 30,
      liveCrowdLabel: CrowdLabel.HOT,
      liveConfidence: ConfidenceLevel.HIGH,
      comparedToUsual: "busier than normal",
      vibeSummary: "EDM, laser-heavy dance floor"
    },
    {
      googlePlaceId: "seed-place-shoreline-loft",
      name: "Shoreline Loft",
      type: "rooftop",
      neighborhood: "Asbury Park",
      address: "601 Cookman Ave, Asbury Park, NJ",
      latitude: 40.2194,
      longitude: -74.0056,
      rating: 4.4,
      reviewCount: 1080,
      openNow: true,
      lineStatus: "short",
      coverTonight: 20,
      liveCrowdLabel: CrowdLabel.ACTIVE,
      liveConfidence: ConfidenceLevel.MEDIUM,
      comparedToUsual: "normal",
      vibeSummary: "House, cocktails, city views"
    }
  ];

  for (const venue of venues) {
    const created = await prisma.venue.upsert({
      where: { googlePlaceId: venue.googlePlaceId },
      update: venue,
      create: venue
    });

    await prisma.venueDressCode.upsert({
      where: { venueId: created.id },
      update: { strictness: "smart-upscale", policySummary: "No athletic wear, clean shoes required." },
      create: { venueId: created.id, strictness: "smart-upscale", policySummary: "No athletic wear, clean shoes required." }
    });

    await prisma.venueCoverRule.create({
      data: { venueId: created.id, dayOfWeek: 5, coverAmount: venue.coverTonight ?? 0, notes: "Weekend standard" }
    });

    await prisma.venueEvent.create({
      data: {
        venueId: created.id,
        title: "Saturday Pulse",
        description: "Resident DJ + guest set",
        startsAt: new Date(),
        flyerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
      }
    });

    await prisma.buzzScoreSnapshot.create({
      data: {
        venueId: created.id,
        score: venue.liveCrowdLabel === CrowdLabel.HOT ? 82 : 63,
        crowdLabel: venue.liveCrowdLabel,
        confidence: venue.liveConfidence,
        comparedToUsual: venue.comparedToUsual ?? "normal",
        lineEstimate: venue.lineStatus ?? "short",
        summaryReason: "Strong review momentum with multiple fresh reports tonight.",
        signalPayload: { source: "seed", reviewCount: venue.reviewCount }
      }
    });

    await prisma.liveUpdate.create({
      data: {
        venueId: created.id,
        userId: admin.id,
        crowdLabel: venue.liveCrowdLabel,
        lineStatus: venue.lineStatus ?? "short",
        coverAmount: venue.coverTonight,
        dressStrictness: "smart-upscale",
        vibeNotes: "Dance floor moving, line building at 11:45 PM.",
        expiresAt: new Date(Date.now() + 1000 * 60 * 80)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
