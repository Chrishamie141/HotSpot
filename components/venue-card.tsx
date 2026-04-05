"use client";

import Link from "next/link";
import { Star, MapPin, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";

type VenueCardProps = {
  venue: {
    id: string;
    name: string;
    address: string;
    photoUrl: string | null;
    rating: number | null;
    totalReviews: number;
    priceLevel: number | null;
    isOpenNow: boolean | null;
    distanceMeters?: number;
    crowdLabel: string;
    buzzScore: number;
  };
};

const priceText = (level: number | null) => (level ? "$".repeat(level) : "-");

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`} className="block">
      <article className="soft-card group grid grid-cols-[120px_1fr] gap-4 rounded-3xl p-3 transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:shadow-[0_12px_26px_rgba(168,85,247,0.26)]">
        <div className="relative h-[120px] overflow-hidden rounded-2xl bg-zinc-900">
          {venue.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={venue.photoUrl} alt={venue.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold text-white">{venue.name}</h3>
            {venue.buzzScore >= 70 ? (
              <Badge className="border-0 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white">Hot right now</Badge>
            ) : (
              <Badge>{venue.crowdLabel}</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1"><Star size={12} className="fill-orange-400 text-orange-400" />{venue.rating?.toFixed(1) ?? "—"}</span>
            <span>({venue.totalReviews} reviews)</span>
            <span>{priceText(venue.priceLevel)}</span>
          </div>

          <p className="line-clamp-1 text-sm text-zinc-300">{venue.address}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1"><MapPin size={12} />{venue.distanceMeters ? `${(venue.distanceMeters / 1000).toFixed(1)} km` : "—"}</span>
            <span className="inline-flex items-center gap-1"><Clock3 size={12} />{venue.isOpenNow ? "Open now" : "Closed"}</span>
          </div>
        </div>
      </article>
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
