import { MapPinned } from "lucide-react";
import { Card } from "@/components/ui";

export function LiveMap() {
  return (
    <Card className="h-full rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live map</h3>
        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
          <MapPinned size={14} /> Heat zones
        </span>
      </div>

      {/* Google Maps integration here later */}
      <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(236,72,153,0.2),transparent_35%),radial-gradient(circle_at_75%_30%,rgba(6,182,212,0.2),transparent_40%),radial-gradient(circle_at_45%_75%,rgba(139,92,246,0.25),transparent_45%),linear-gradient(160deg,rgba(24,24,27,0.95),rgba(9,9,11,0.95))] p-4">
        <div className="absolute inset-0 opacity-20 [background-size:32px_32px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)]" />
        <div className="relative flex h-full items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm text-zinc-300">
          Interactive crowd map coming soon
        </div>
      </div>
    </Card>
  );
}
