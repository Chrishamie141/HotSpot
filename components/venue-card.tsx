"use client";

import Link from "next/link";
import { Star, MapPin, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui";
import { ExploreVenue } from "@/lib/explore/types";

type VenueCardProps = {
  venue: ExploreVenue;
};

const priceText = (level: number | null) => {
  if (!level || level < 1) return "-";
  return "$".repeat(level);
};

function openStateLabel(state: ExploreVenue["openState"]) {
  if (state === "open_now") return "Open now";
  if (state === "closing_soon") return "Closing soon";
  if (state === "closed") return "Closed";
  return "Hours unavailable";
}

export function VenueCard({ venue }: VenueCardProps) {
  const isHot = venue.buzzScore >= 70;

  return (
    <Link href={`/venue/${venue.id}`} className="block min-w-0">
      <article className="soft-card group min-w-0 overflow-hidden rounded-3xl p-3 transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:shadow-[0_12px_26px_rgba(168,85,247,0.26)]">
        <div className="flex min-w-0 flex-col gap-4 sm:grid sm:grid-cols-[120px_1fr] sm:gap-4">
          <div className="relative h-[180px] w-full overflow-hidden rounded-2xl bg-zinc-900 sm:h-[120px]">
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

          <div className="min-w-0 space-y-3">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="min-w-0 break-words text-lg font-semibold leading-tight text-white sm:pr-2">
                {venue.name}
              </h3>

              <div className="self-start sm:shrink-0">
                {isHot ? (
                  <Badge className="max-w-full border-0 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white">
                    Hot
                  </Badge>
                ) : (
                  <Badge className="max-w-full">{venue.crowdLabel}</Badge>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="fill-orange-400 text-orange-400" />
                {venue.rating?.toFixed(1) ?? "—"}
              </span>
              <span>({venue.totalReviews} reviews)</span>
              <span>{priceText(venue.priceLevel)}</span>
            </div>

            <p className="break-words text-sm text-zinc-300">{venue.address}</p>

            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} />
                {typeof venue.distanceMiles === "number"
                  ? `${venue.distanceMiles.toFixed(1)} mi`
                  : "—"}
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} />
                {openStateLabel(venue.openState)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}