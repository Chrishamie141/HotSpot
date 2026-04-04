import { notFound } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { fallbackVenues } from "@/lib/mock-data";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: { photos: true, events: true, dressCode: true, liveUpdates: { take: 8, orderBy: { createdAt: "desc" } } }
  }).catch(() => null);

  const mock = fallbackVenues.find((v) => v.id === id);

  if (!venue && !mock) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">{venue?.name ?? mock?.name}</h1>
      <div className="flex flex-wrap gap-2">
        <Badge>{venue?.liveCrowdLabel ?? mock?.buzz.crowdLabel}</Badge>
        <Badge className="bg-cyan-500/20">{venue?.comparedToUsual ?? mock?.buzz.comparedToUsual}</Badge>
        <Badge className="bg-rose-500/20">Line: {venue?.lineStatus ?? mock?.buzz.lineEstimate}</Badge>
      </div>
      <Card>
        <p>Dress code: {venue?.dressCode?.policySummary ?? mock?.dressCode}</p>
        <p>Cover tonight: {venue?.coverTonight ? `$${venue.coverTonight}` : `$${mock?.coverTonight ?? 0}`}</p>
        <p>Last updated: {(venue?.lastUpdatedAt ?? new Date()).toLocaleString()}</p>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Recent live reports</h2>
        <div className="space-y-2 text-sm text-zinc-300">
          {(venue?.liveUpdates ?? []).map((report) => (
            <p key={report.id}>{report.crowdLabel} · line {report.lineStatus} · {report.vibeNotes ?? "No notes"}</p>
          ))}
          {!venue?.liveUpdates?.length && <p>No reports yet tonight.</p>}
        </div>
      </Card>
    </section>
  );
}
