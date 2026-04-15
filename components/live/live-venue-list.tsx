import { ArrowDownRight, ArrowUpRight, Clock3, MapPin, Minus, Star } from "lucide-react";
import { Card } from "@/components/ui";
import { LiveVenue } from "@/lib/live/transform-live-venues";

type LiveVenueListProps = {
  venues: LiveVenue[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
};

const statusStyles = {
  packed: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  moderate: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  chill: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
} as const;

const trendStyles = {
  rising: { icon: ArrowUpRight, label: "Rising", color: "text-emerald-200", emoji: "📈" },
  falling: { icon: ArrowDownRight, label: "Dropping", color: "text-rose-200", emoji: "📉" },
  stable: { icon: Minus, label: "Stable", color: "text-zinc-300", emoji: "➖" },
} as const;

export function LiveVenueList({ venues, selectedVenueId, onSelectVenue }: LiveVenueListProps) {
  return (
    <Card className="rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Nearby venues</h3>
        <span className="text-xs text-zinc-400">{venues.length} live</span>
      </div>

      <div className="space-y-3">
        {venues.map((venue) => {
          const trend = trendStyles[venue.trend];
          const TrendIcon = trend.icon;
          const isSelected = selectedVenueId === venue.id;

          return (
            <button
              key={venue.id}
              type="button"
              onClick={() => onSelectVenue(venue.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-fuchsia-300/40 bg-fuchsia-500/10 shadow-[0_0_32px_-20px_rgba(217,70,239,0.95)]"
                  : "border-white/10 bg-zinc-950/60 hover:border-fuchsia-300/25 hover:bg-zinc-900/80"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-50 sm:text-base">{venue.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-400 sm:text-sm">{venue.address || "Address unavailable"}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[venue.status]}`}>
                  {venue.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-300 sm:grid-cols-4 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} /> {venue.estimatedWaitTime} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  {typeof venue.distanceMiles === "number" ? `${venue.distanceMiles.toFixed(1)} mi` : "Nearby"}
                </span>
                <span className={`inline-flex items-center gap-1.5 ${trend.color}`}>
                  <TrendIcon size={13} /> {trend.emoji} {trend.label}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {venue.rating ? venue.rating.toFixed(1) : "N/A"}
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-400">{venue.openNow === true ? "Open now" : venue.openNow === false ? "Closed now" : "Hours unknown"}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
