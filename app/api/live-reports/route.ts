import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  placeId: z.string(),
  venueName: z.string(),
  address: z.string().default(""),
  lat: z.number().default(0),
  lng: z.number().default(0),
  userId: z.string(),
  crowdLabel: z.enum(["DEAD", "SLOW", "ACTIVE", "HOT", "PACKED"]),
  lineStatus: z.enum(["no line", "short", "medium", "long"]),
  coverAmount: z.number().nullable().optional(),
  dressStrictness: z.string().optional(),
  vibeNotes: z.string().max(180).optional(),
  proximityMeters: z.number().max(1000).optional()
});

export async function POST(req: Request) {
  const payload = schema.safeParse(await req.json());
  if (!payload.success) return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });

  const localVenue = await prisma.venue.upsert({
    where: { googlePlaceId: payload.data.placeId },
    update: {
      name: payload.data.venueName,
      address: payload.data.address,
      latitude: payload.data.lat,
      longitude: payload.data.lng,
      lastUpdatedAt: new Date()
    },
    create: {
      googlePlaceId: payload.data.placeId,
      name: payload.data.venueName,
      type: "bar",
      neighborhood: "Unknown",
      address: payload.data.address,
      latitude: payload.data.lat,
      longitude: payload.data.lng
    }
  });

  const report = await prisma.liveUpdate.create({
    data: {
      venueId: localVenue.id,
      userId: payload.data.userId,
      crowdLabel: payload.data.crowdLabel,
      lineStatus: payload.data.lineStatus,
      coverAmount: payload.data.coverAmount,
      dressStrictness: payload.data.dressStrictness,
      vibeNotes: payload.data.vibeNotes,
      proximityMeters: payload.data.proximityMeters,
      trustWeight: 1,
      expiresAt: new Date(Date.now() + 1000 * 60 * 90)
    }
  });

  return NextResponse.json({ data: report });
}
