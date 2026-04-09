import type { VibeLevelLabel } from "@/components/live/types";

const vibeScale: { min: number; max: number; label: VibeLevelLabel; emoji: string; color: string }[] = [
  { min: 1, max: 2, label: "Chill", emoji: "😌", color: "from-cyan-500/50 to-cyan-300/60" },
  { min: 3, max: 4, label: "Calm", emoji: "🙂", color: "from-blue-500/50 to-sky-300/60" },
  { min: 5, max: 6, label: "Active", emoji: "😎", color: "from-violet-500/50 to-fuchsia-300/60" },
  { min: 7, max: 8, label: "Lit", emoji: "🔥", color: "from-fuchsia-500/60 to-orange-300/70" },
  { min: 9, max: 10, label: "Crazy", emoji: "🚀", color: "from-orange-500/70 to-yellow-300/80" },
];

function getVibeScoreMeta(score: number) {
  return vibeScale.find((entry) => score >= entry.min && score <= entry.max) ?? vibeScale[0];
}

type VibeMeterProps = {
  score: number;
  averageScore?: number;
};

export function VibeMeter({ score, averageScore }: VibeMeterProps) {
  const clamped = Math.min(10, Math.max(1, score));
  const ratio = (clamped / 10) * 100;
  const meta = getVibeScoreMeta(clamped);

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <p className="font-medium text-zinc-100">Vibe Meter</p>
        <p>
          {meta.label} {meta.emoji}
        </p>
      </div>

      <div className="h-2.5 rounded-full bg-zinc-900/80">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${meta.color} shadow-[0_0_14px_rgba(217,70,239,0.35)]`}
          style={{ width: `${ratio}%` }}
          aria-label={`Vibe score ${clamped} out of 10`}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{clamped}/10 now</span>
        {typeof averageScore === "number" ? (
          <span className="text-fuchsia-200">Venue avg {averageScore.toFixed(1)}</span>
        ) : null}
      </div>
    </div>
  );
}
