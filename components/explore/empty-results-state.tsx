"use client";

import { RegionKey } from "@/lib/explore/types";
import { getRegionConfig } from "@/lib/explore/regions";

type EmptyResultsStateProps = {
  region: RegionKey;
  distanceMiles: number;
  openNowOnly: boolean;
  reason?: string;
  onSetDistance: (miles: 25 | 50) => void;
  onDisableOpenNow: () => void;
  onSetRegion: (region: RegionKey) => void;
};

export function EmptyResultsState({ region, distanceMiles, openNowOnly, reason, onSetDistance, onDisableOpenNow, onSetRegion }: EmptyResultsStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
      <p className="text-base font-semibold text-white">No venues found yet</p>
      <p className="mt-1 text-zinc-300">
        We searched {getRegionConfig(region).label} within {distanceMiles} miles.
      </p>
      {reason && <p className="mt-1 text-xs text-amber-300">{reason}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => onSetDistance(25)} className="rounded-full border border-fuchsia-300/50 bg-fuchsia-500/20 px-3 py-1.5 text-xs font-medium text-fuchsia-100">
          Expand to 25 miles
        </button>
        <button type="button" onClick={() => onSetDistance(50)} className="rounded-full border border-fuchsia-300/50 bg-fuchsia-500/20 px-3 py-1.5 text-xs font-medium text-fuchsia-100">
          Expand to 50 miles
        </button>
        {openNowOnly && (
          <button type="button" onClick={onDisableOpenNow} className="rounded-full border border-cyan-300/50 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-100">
            Turn off open now only
          </button>
        )}
        <button type="button" onClick={() => onSetRegion("new-brunswick")} className="rounded-full border border-violet-300/50 bg-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-100">
          Switch to New Brunswick
        </button>
      </div>
    </div>
  );
}
