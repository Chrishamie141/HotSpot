"use client";

import { DEFAULT_DISTANCE_MILES, DISTANCE_OPTIONS } from "@/lib/explore/distance";

type DistanceSelectorProps = {
  value: number;
  onChange: (miles: number) => void;
};

export function DistanceSelector({ value, onChange }: DistanceSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-zinc-200">Distance</p>
      <div className="flex flex-wrap gap-2">
        {DISTANCE_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.miles}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${value === option.miles ? "border-fuchsia-300/60 bg-fuchsia-500/20 text-fuchsia-100" : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/15"}`}
            onClick={() => onChange(option.miles)}
          >
            {option.miles} miles
          </button>
        ))}
      </div>
      {!DISTANCE_OPTIONS.some((item) => item.miles === value) && (
        <p className="mt-2 text-xs text-amber-300">Invalid distance detected. Resetting to {DEFAULT_DISTANCE_MILES} miles.</p>
      )}
    </div>
  );
}
