import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  venueId: z.string(),
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

  const report = await prisma.liveUpdate.create({
    data: {
      ...payload.data,
      trustWeight: 1,
      expiresAt: new Date(Date.now() + 1000 * 60 * 90)
    }
  });

  return NextResponse.json({ data: report });
}
