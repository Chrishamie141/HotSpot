import type { FeedVibeLabel } from "@/components/feed/types";

const vibeScale: { min: number; max: number; label: FeedVibeLabel; emoji: string; color: string }[] = [
  { min: 1, max: 2, label: "Chill", emoji: "😌", color: "from-cyan-500/50 to-cyan-300/60" },
  { min: 3, max: 4, label: "Calm", emoji: "🙂", color: "from-blue-500/50 to-sky-300/60" },
  { min: 5, max: 6, label: "Active", emoji: "😎", color: "from-violet-500/50 to-fuchsia-300/60" },
  { min: 7, max: 8, label: "Lit", emoji: "🔥", color: "from-fuchsia-500/60 to-orange-300/70" },
  { min: 9, max: 10, label: "Crazy", emoji: "🚀", color: "from-orange-500/70 to-yellow-300/80" },
];

function getVibeMeta(score: number) {
  return vibeScale.find((item) => score >= item.min && score <= item.max) ?? vibeScale[0];
}

export function FeedVibeMeter({ score, averageScore }: { score: number; averageScore: number }) {
  const normalized = Math.min(10, Math.max(1, score));
  const meta = getVibeMeta(normalized);

  return (
    <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex items-center justify-between text-[11px] text-zinc-300">
        <p className="text-zinc-100">{meta.label} {meta.emoji}</p>
        <p>{normalized}/10</p>
      </div>
      <div className="h-2 rounded-full bg-zinc-900/80">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${meta.color} shadow-[0_0_12px_rgba(217,70,239,0.32)]`}
          style={{ width: `${(normalized / 10) * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-fuchsia-200">Venue avg {averageScore.toFixed(1)}</p>
    </div>
  );
}
