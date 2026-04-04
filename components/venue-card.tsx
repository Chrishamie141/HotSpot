import Link from "next/link";
import { Card, Badge } from "@/components/ui";

type VenueCardProps = {
  venue: {
    id: string;
    name: string;
    neighborhood: string;
    lineStatus: string;
    coverTonight: number | null;
    liveCrowdLabel: string;
    liveConfidence: string;
    comparedToUsual: string;
    dressCode?: { strictness: string } | null;
  };
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`}>
      <Card className="space-y-2 transition hover:shadow-glow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{venue.name}</h3>
          <Badge>{venue.liveCrowdLabel}</Badge>
        </div>
        <p className="text-sm text-zinc-300">{venue.neighborhood}</p>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-200">
          <Badge className="bg-cyan-500/20">{venue.comparedToUsual}</Badge>
          <Badge className="bg-fuchsia-500/20">Line: {venue.lineStatus}</Badge>
          <Badge className="bg-emerald-500/20">Cover: {venue.coverTonight ? `$${venue.coverTonight}` : "None"}</Badge>
          <Badge className="bg-amber-500/20">Dress: {venue.dressCode?.strictness ?? "Unknown"}</Badge>
          <Badge className="bg-zinc-600/30">Confidence: {venue.liveConfidence}</Badge>
        </div>
      </Card>
    </Link>
  );
}
