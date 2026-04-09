import Image from "next/image";
import { Music4 } from "lucide-react";
import type { ComposerMedia } from "@/components/feed/types";

const mockTracks = ["Midnight Echoes", "Neon Drive", "Afterhours Pulse"];
const mockFilters = ["Original", "Noir", "Glow", "Film", "Lush"];
const frameModes = ["9:16", "4:5", "1:1"];

export function CreatePostEditor({ media }: { media: ComposerMedia }) {
  return (
    <div className="space-y-4 p-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        {media.mediaType === "video" ? (
          <video src={media.mediaUrl} className="aspect-[9/12] w-full object-cover" muted autoPlay loop playsInline />
        ) : (
          <Image src={media.mediaUrl} alt="Selected media" width={1200} height={1600} className="aspect-[9/12] w-full object-cover" />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Frame</p>
        <div className="flex gap-2">
          {frameModes.map((mode) => (
            <button key={mode} type="button" className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200">
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Filters</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mockFilters.map((filter) => (
            <button key={filter} type="button" className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Music</p>
        <div className="space-y-2">
          {mockTracks.map((track) => (
            <button key={track} type="button" className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-sm text-zinc-200">
              <span className="inline-flex items-center gap-2"><Music4 size={14} /> {track}</span>
              <span className="text-xs text-cyan-300">Add</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
