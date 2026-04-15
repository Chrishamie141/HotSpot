import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { LiveVenue } from "@/lib/live/transform-live-venues";

type RecommendationCardProps = {
  venue: LiveVenue | null;
  reasons: string[];
};

export function RecommendationCard({ venue, reasons }: RecommendationCardProps) {
  if (!venue) {
    return (
      <Card className="rounded-2xl p-4 sm:p-5">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Sparkles size={14} /> Best move right now
        </p>
        <p className="mt-2 text-sm text-zinc-400">No nearby venues available yet. Try expanding your distance range.</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 p-4 shadow-[0_0_28px_-18px_rgba(168,85,247,0.9)] sm:p-5">
      <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-fuchsia-100">
        <Sparkles size={14} /> Best move right now
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-semibold text-zinc-50">{venue.name}</p>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
          {venue.estimatedWaitTime} min wait
        </span>
      </div>
      <p className="mt-1 line-clamp-1 text-sm text-zinc-300">{venue.address || "Address unavailable"}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-100">
        {reasons.map((reason) => (
          <li key={reason} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
            {reason}
          </li>
        ))}
      </ul>
    </Card>
  );
}
