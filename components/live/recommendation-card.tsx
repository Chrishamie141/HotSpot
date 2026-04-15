import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { LiveVenue } from "@/components/live/live-venue-data";

type RecommendationCardProps = {
  venue: LiveVenue;
};

export function RecommendationCard({ venue }: RecommendationCardProps) {
  return (
    <Card className="rounded-2xl border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 p-5 shadow-[0_0_35px_-20px_rgba(168,85,247,0.9)]">
      <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-fuchsia-100">
        <Sparkles size={14} /> Best move right now
      </p>
      <p className="text-xl font-semibold text-zinc-50">{venue.name}</p>
      <ul className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-3">
        <li className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">✅ low wait</li>
        <li className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">📈 trending up</li>
        <li className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">📍 nearby</li>
      </ul>
    </Card>
  );
}
