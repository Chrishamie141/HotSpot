"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui";
import { DistanceSelector } from "@/components/explore/distance-selector";
import { RegionSelector } from "@/components/explore/region-selector";
import { ExploreSort, RegionKey, VenueTypeFilter } from "@/lib/explore/types";

const VENUE_TYPE_LABELS: Record<VenueTypeFilter, string> = {
  bars: "Bars",
  clubs: "Clubs",
  lounges: "Lounges",
  rooftops: "Rooftops",
  "sports-bars": "Sports bars",
  "hookah-lounges": "Hookah lounges"
};

const SORT_OPTIONS: Array<{ value: ExploreSort; label: string }> = [
  { value: "best-match", label: "Best match" },
  { value: "closest", label: "Closest" },
  { value: "highest-rated", label: "Highest rated" },
  { value: "hottest-now", label: "Hottest now" }
];

type ExploreFilterMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  region: RegionKey;
  distanceMiles: number;
  openNowOnly: boolean;
  sort: ExploreSort;
  selectedTypes: VenueTypeFilter[];
  onRegionChange: (value: RegionKey) => void;
  onDistanceChange: (value: number) => void;
  onOpenNowChange: (value: boolean) => void;
  onSortChange: (value: ExploreSort) => void;
  onTypeToggle: (type: VenueTypeFilter) => void;
};

export function ExploreFilterMenu(props: ExploreFilterMenuProps) {
  const selectedChips = [
    `${props.distanceMiles} miles`,
    props.openNowOnly ? "Open now only" : "Open + closed",
    ...props.selectedTypes.map((type) => VENUE_TYPE_LABELS[type]),
    SORT_OPTIONS.find((option) => option.value === props.sort)?.label ?? "Best match"
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={props.onToggle}
          aria-expanded={props.isOpen}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-black/60"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <div className="flex flex-wrap gap-2">
          {selectedChips.slice(0, 4).map((chip) => (
            <Badge key={chip} className="border-white/15 bg-white/10 text-xs text-zinc-100">
              {chip}
            </Badge>
          ))}
        </div>
      </div>

      {props.isOpen && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/45 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Explore filters</p>
            <button type="button" onClick={props.onToggle} className="rounded-full border border-white/20 p-1 text-zinc-300 hover:bg-white/10">
              <X size={14} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RegionSelector value={props.region} onChange={props.onRegionChange} />
            <label className="block text-xs text-zinc-300">
              <span className="mb-2 block font-medium text-zinc-200">Sort</span>
              <select
                className="w-full rounded-2xl border border-white/20 bg-black/50 px-3 py-2 text-sm text-white"
                value={props.sort}
                onChange={(event) => props.onSortChange(event.target.value as ExploreSort)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <DistanceSelector value={props.distanceMiles} onChange={props.onDistanceChange} />
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-zinc-200">Venue types</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(VENUE_TYPE_LABELS) as VenueTypeFilter[]).map((type) => {
                const active = props.selectedTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => props.onTypeToggle(type)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-100" : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/15"}`}
                  >
                    {VENUE_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={props.openNowOnly}
              onChange={(event) => props.onOpenNowChange(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black"
            />
            Open now only
          </label>
        </div>
      )}
    </div>
  );
}
