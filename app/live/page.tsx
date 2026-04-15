import { Activity, Flame, Radio, Timer } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import {
  bestMoveVenue,
  hotRightNowVenues,
  liveVenues,
} from "@/components/live/live-venue-data";
import { LiveVenueList } from "@/components/live/live-venue-list";
import { RecommendationCard } from "@/components/live/recommendation-card";
import { LiveMap } from "@/components/live/live-map";

export default function LivePage() {
  return (
    <AppShell title="Live" locationLabel="Newark, NJ">
      <section className="space-y-4">
        <Card className="space-y-2 p-5">
          <h2 className="text-xl font-semibold">Live city pulse</h2>
          <p className="text-sm text-zinc-300">
            Track crowd movement, queue times, and social buzz updates as the night unfolds.
          </p>
        </Card>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="space-y-2 rounded-2xl p-4">
            <p className="inline-flex items-center gap-2 text-fuchsia-200">
              <Activity size={14} /> Buzz Index
            </p>
            <p className="text-2xl font-semibold">82</p>
          </Card>
          <Card className="space-y-2 rounded-2xl p-4">
            <p className="inline-flex items-center gap-2 text-cyan-200">
              <Radio size={14} /> Active venues
            </p>
            <p className="text-2xl font-semibold">{liveVenues.length}</p>
          </Card>
          <Card className="space-y-2 rounded-2xl p-4">
            <p className="inline-flex items-center gap-2 text-violet-200">
              <Timer size={14} /> Avg line
            </p>
            <p className="text-2xl font-semibold">14 min</p>
          </Card>
        </div>

        <Card className="rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold">
              <Flame size={16} className="text-amber-300" />
              Hot right now
            </h3>
            <p className="text-xs text-zinc-400">Top 3 trending venues</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {hotRightNowVenues.map((venue, index) => (
              <article
                key={venue.id}
                className="rounded-2xl border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-cyan-500/10 p-4 shadow-[0_0_35px_-18px_rgba(217,70,239,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-14px_rgba(168,85,247,0.95)]"
              >
                <p className="mb-1 text-xs text-zinc-400">#{index + 1} trending</p>
                <p className="text-base font-semibold text-zinc-50">{venue.name}</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {venue.waitTime} min wait · {venue.distance.toFixed(1)} mi away
                </p>
              </article>
            ))}
          </div>
        </Card>

        <RecommendationCard venue={bestMoveVenue} />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <LiveVenueList venues={liveVenues} />
          <LiveMap />
        </div>
      </section>
    </AppShell>
  );
}
