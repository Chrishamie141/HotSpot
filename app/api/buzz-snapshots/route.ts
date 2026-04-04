import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const snapshots = await prisma.buzzScoreSnapshot.findMany({
    take: 100,
    orderBy: { capturedAt: "desc" },
    include: { venue: { select: { name: true, neighborhood: true } } }
  }).catch(() => []);

  return NextResponse.json({ data: snapshots });
}
