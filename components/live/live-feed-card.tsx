"use client";

import Image from "next/image";
import { Heart, MapPin, MessageCircle, Play, Send } from "lucide-react";
import type { LiveFeedPost } from "@/components/live/types";
import { VibeMeter } from "@/components/live/vibe-meter";

type LiveFeedCardProps = {
  post: LiveFeedPost;
  onToggleHeart: (postId: string) => void;
};

export function LiveFeedCard({ post, onToggleHeart }: LiveFeedCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] shadow-[0_18px_60px_rgba(2,6,23,0.55)]">
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <Image
          src={post.avatarUrl}
          alt={`${post.username} avatar`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border border-white/15 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-50">{post.username}</p>
          <p className="inline-flex items-center gap-1 truncate text-xs text-cyan-200">
            <MapPin size={12} /> {post.venue} · {post.location}
          </p>
        </div>
        <span className="text-xs text-zinc-400">{post.postedAt}</span>
      </header>

      <div className="relative bg-black/30">
        {post.mediaType === "image" ? (
          <Image
            src={post.mediaUrl}
            alt={`Live post from ${post.venue}`}
            width={1200}
            height={900}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="relative">
            <video
              className="aspect-[4/5] w-full object-cover"
              src={post.mediaUrl}
              muted
              loop
              autoPlay
              playsInline
              controls={false}
            />
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2 py-1 text-[10px] text-white">
              <Play size={11} className="fill-current" /> video
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <p className="text-sm text-zinc-100">{post.caption}</p>

        <VibeMeter score={post.vibeScore} averageScore={post.venueAverageVibe} />

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <button
            onClick={() => onToggleHeart(post.id)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition ${
              post.hearted
                ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100"
                : "border-white/15 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
            type="button"
          >
            <Heart size={15} className={post.hearted ? "fill-current" : ""} />
            {post.hearted ? "Vibed" : "Heart"}
          </button>

          <button
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 hover:bg-white/[0.06]"
            type="button"
          >
            <MessageCircle size={15} /> Comment
          </button>

          <button
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 hover:bg-white/[0.06]"
            type="button"
          >
            <Send size={15} /> Share
          </button>
        </div>

        <p className="text-xs text-zinc-500">{post.commentsCount} comments · See more from {post.venue}</p>
      </div>
    </article>
  );
}
