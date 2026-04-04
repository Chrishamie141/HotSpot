import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackVenues } from "@/lib/mock-data";

export async function GET() {
  const venues = await prisma.venue.findMany({ include: { dressCode: true }, take: 50 }).catch(() => []);
  return NextResponse.json({ data: venues.length ? venues : fallbackVenues, source: venues.length ? "db" : "fallback" });
}
