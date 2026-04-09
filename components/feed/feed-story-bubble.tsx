import Image from "next/image";
import type { FeedStory } from "@/components/feed/types";

type FeedStoryBubbleProps = {
  story: FeedStory;
};

export function FeedStoryBubble({ story }: FeedStoryBubbleProps) {
  return (
    <button
      type="button"
      className="group min-w-[74px] max-w-[84px] space-y-1 text-left"
      aria-label={`Open story from ${story.title}`}
    >
      <div className="relative mx-auto h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-400 to-cyan-400 p-[2px]">
          <div className="h-full w-full rounded-full bg-[#0c1220] p-[2px]">
            <Image
              src={story.avatarUrl}
              alt={story.title}
              width={60}
              height={60}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        {story.liveNow ? (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-fuchsia-300/50 bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-medium text-fuchsia-100">
            Live
          </span>
        ) : null}
      </div>
      <p className="truncate text-center text-xs font-medium text-zinc-100 group-hover:text-white">{story.title}</p>
      <p className="truncate text-center text-[11px] text-zinc-400">{story.subtitle}</p>
    </button>
  );
}
