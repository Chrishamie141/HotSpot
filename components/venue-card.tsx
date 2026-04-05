"use client";

import Link from "next/link";
import { Star, MapPin, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui";

export type VenueCardVenue = {
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

type VenueCardProps = {
  venue: VenueCardVenue;
};

const priceText = (level: number | null) => {
  if (!level || level < 1) return "-";
  return "$".repeat(level);
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venue/${venue.id}`} className="block">
      <article className="soft-card group grid grid-cols-[120px_1fr] gap-4 rounded-3xl p-3 transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:shadow-[0_12px_26px_rgba(168,85,247,0.26)]">
        <div className="relative h-[120px] overflow-hidden rounded-2xl bg-zinc-900">
          {venue.photoUrl ? (
            <img
              src={venue.photoUrl}
              alt={venue.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold text-white">
              {venue.name}
            </h3>

            {venue.buzzScore >= 70 ? (
              <Badge className="border-0 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white">
                Hot right now
              </Badge>
            ) : (
              <Badge>{venue.crowdLabel}</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="fill-orange-400 text-orange-400" />
              {venue.rating?.toFixed(1) ?? "—"}
            </span>
            <span>({venue.totalReviews} reviews)</span>
            <span>{priceText(venue.priceLevel)}</span>
          </div>

          <p className="line-clamp-1 text-sm text-zinc-300">{venue.address}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {venue.distanceMeters
                ? `${(venue.distanceMeters / 1000).toFixed(1)} km`
                : "—"}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 size={12} />
              {venue.isOpenNow === null
                ? "Hours unavailable"
                : venue.isOpenNow
                  ? "Open now"
                  : "Closed"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}