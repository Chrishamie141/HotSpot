import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ReactNode } from "react";
import { Card } from "@/components/ui";
import { LiveVenue } from "@/components/live/live-venue-data";

type LiveVenueListProps = {
  venues: LiveVenue[];
};

const statusStyles: Record<
  LiveVenue["status"],
  { label: string; color: string; emoji: string }
> = {
  packed: {
    label: "Packed",
    color: "text-rose-200 border-rose-400/30 bg-rose-500/10",
    emoji: "🔴",
  },
  moderate: {
    label: "Moderate",
    color: "text-amber-200 border-amber-400/30 bg-amber-500/10",
    emoji: "🟡",
  },
  chill: {
    label: "Chill",
    color: "text-emerald-200 border-emerald-400/30 bg-emerald-500/10",
    emoji: "🟢",
  },
};

const trendStyles: Record<
  LiveVenue["trend"],
  { label: string; icon: ReactNode; className: string }
> = {
  rising: {
    label: "Rising",
    icon: <ArrowUpRight size={14} />,
    className: "text-emerald-200",
  },
  falling: {
    label: "Dropping",
    icon: <ArrowDownRight size={14} />,
    className: "text-rose-200",
  },
  stable: {
    label: "Stable",
    icon: <Minus size={14} />,
    className: "text-zinc-300",
  },
};

export function LiveVenueList({ venues }: LiveVenueListProps) {
  return (
    <Card className="h-full space-y-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live venues</h3>
        <span className="text-xs text-zinc-400">Updated now</span>
      </div>

      <div className="space-y-3">
        {venues.map((venue) => {
          const status = statusStyles[venue.status];
          const trend = trendStyles[venue.trend];

          return (
            <article
              key={venue.id}
              className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:shadow-[0_0_30px_-18px_rgba(217,70,239,0.8)]"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-base font-semibold text-zinc-50">{venue.name}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.color}`}
                >
                  <span>{status.emoji}</span>
                  <span>{status.label}</span>
                </span>
              </div>

              <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-3">
                <p>
                  Wait: <span className="font-medium text-zinc-100">{venue.waitTime} min</span>
                </p>
                <p>
                  Distance: <span className="font-medium text-zinc-100">{venue.distance.toFixed(1)} mi</span>
                </p>
                <p className={`inline-flex items-center gap-1 font-medium ${trend.className}`}>
                  {trend.icon}
                  {venue.trend === "rising" && "📈"}
                  {venue.trend === "falling" && "📉"}
                  {venue.trend === "stable" && "➖"}
                  {trend.label}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
