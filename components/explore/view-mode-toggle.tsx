"use client";

type ViewMode = "list" | "map";

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  onTrendingClick: () => void;
  neighborhoodsOpen: boolean;
};

export function ViewModeToggle({ value, onChange, onTrendingClick, neighborhoodsOpen }: ViewModeToggleProps) {
  const base = "rounded-full border px-3 py-1.5 text-xs font-medium transition";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={value === "map"}
        className={`${base} ${value === "map" ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-100" : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/15"}`}
        onClick={() => onChange("map")}
      >
        Map View
      </button>
      <button
        type="button"
        aria-pressed={value === "list"}
        className={`${base} ${value === "list" ? "border-fuchsia-300/70 bg-fuchsia-500/20 text-fuchsia-100" : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/15"}`}
        onClick={() => onChange("list")}
      >
        List View
      </button>
      <button
        type="button"
        aria-pressed={neighborhoodsOpen}
        className={`${base} ${neighborhoodsOpen ? "border-violet-300/70 bg-violet-500/20 text-violet-100" : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/15"}`}
        onClick={onTrendingClick}
      >
        Trending neighborhoods
      </button>
    </div>
  );
}
