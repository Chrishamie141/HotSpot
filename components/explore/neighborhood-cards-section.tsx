"use client";

import { CENTRAL_JERSEY_REGIONS } from "@/lib/explore/regions";
import { RegionKey } from "@/lib/explore/types";

const DISCOVERY_KEYS: RegionKey[] = [
  "new-brunswick",
  "princeton",
  "edison-metuchen",
  "red-bank",
  "asbury-park-shore",
  "freehold"
];

type NeighborhoodCardsSectionProps = {
  selectedRegion: RegionKey;
  onSelectRegion: (region: RegionKey) => void;
};

export function NeighborhoodCardsSection({ selectedRegion, onSelectRegion }: NeighborhoodCardsSectionProps) {
  const cards = CENTRAL_JERSEY_REGIONS.filter((region) => DISCOVERY_KEYS.includes(region.key));

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-white">Trending Central Jersey neighborhoods</h2>
        <p className="text-sm text-zinc-300">Pick a nightlife region to instantly refresh discovery.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const active = selectedRegion === card.key;
          return (
            <button
              type="button"
              key={card.key}
              onClick={() => onSelectRegion(card.key)}
              className={`rounded-2xl border p-4 text-left transition ${active ? "border-fuchsia-400/70 bg-fuchsia-500/15 shadow-[0_0_24px_rgba(217,70,239,0.15)]" : "border-white/10 bg-white/5 hover:border-violet-300/40 hover:bg-white/10"}`}
            >
              <p className="text-base font-semibold text-white">{card.label}</p>
              <p className="mt-1 text-sm text-zinc-300">{card.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
