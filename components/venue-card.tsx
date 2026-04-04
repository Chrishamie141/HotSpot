"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
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

const priceText = (level: number | null) => (level ? "$".repeat(level) : "—");

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`}>
      <Card className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-0.5 hover:shadow-glow">
        <div className="relative h-40 w-full bg-zinc-900">
          {venue.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={venue.photoUrl} alt={venue.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-violet-600/40 to-cyan-600/30" />
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="bg-black/60">{venue.isOpenNow ? "Open now" : "Closed"}</Badge>
            {venue.buzzScore >= 70 && <Badge className="bg-orange-500/80">Hot right now</Badge>}
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-semibold">{venue.name}</h3>
            <Badge>{venue.crowdLabel}</Badge>
          </div>
          <p className="line-clamp-1 text-xs text-zinc-400">{venue.address}</p>
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" />{venue.rating?.toFixed(1) ?? "—"}</span>
            <span>{venue.totalReviews} reviews</span>
            <span>{priceText(venue.priceLevel)}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} />{venue.distanceMeters ? `${(venue.distanceMeters / 1000).toFixed(1)} km` : "—"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
