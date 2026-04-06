"use client";

import { CENTRAL_JERSEY_REGIONS } from "@/lib/explore/regions";
import { RegionKey } from "@/lib/explore/types";

type RegionSelectorProps = {
  value: RegionKey;
  onChange: (value: RegionKey) => void;
};

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  return (
    <label className="block text-xs text-zinc-300">
      <span className="mb-2 block font-medium text-zinc-200">Region</span>
      <select
        className="w-full rounded-2xl border border-white/20 bg-black/50 px-3 py-2 text-sm text-white"
        value={value}
        onChange={(event) => onChange(event.target.value as RegionKey)}
      >
        {CENTRAL_JERSEY_REGIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
