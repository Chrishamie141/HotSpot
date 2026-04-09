"use client";

import Image from "next/image";
import { Grid3X3, Tag, Bookmark, Play, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { FeedPost } from "@/components/feed/types";
import { FeedVibeMeter } from "@/components/feed/feed-vibe-meter";

const tabConfig = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "tagged", label: "Tagged", icon: Tag },
  { id: "saved", label: "Saved", icon: Bookmark },
] as const;

type TabId = (typeof tabConfig)[number]["id"];

export function ProfilePostGrid({
  posts,
  taggedPosts,
  savedPosts,
  activeTab,
  onTabChange,
}: {
  posts: FeedPost[];
  taggedPosts: FeedPost[];
  savedPosts: FeedPost[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  const [selectedPost, setSelectedPost] = useState<FeedPost>();

  const visiblePosts = useMemo(() => {
    if (activeTab === "tagged") return taggedPosts;
    if (activeTab === "saved") return savedPosts;
    return posts;
  }, [activeTab, posts, savedPosts, taggedPosts]);

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {tabConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs transition ${
                isActive ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {visiblePosts.map((post) => (
          <button
            key={`${activeTab}-${post.id}`}
            type="button"
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square overflow-hidden rounded-lg border border-white/10"
          >
            <Image
              src={post.mediaType === "video" ? post.thumbnailUrl ?? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" : post.mediaUrl}
              alt={post.caption}
              width={480}
              height={480}
              className="h-full w-full object-cover"
            />
            {post.mediaType === "video" ? (
              <span className="absolute right-2 top-2 rounded-full bg-black/55 p-1 text-white">
                <Play size={12} className="fill-current" />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {selectedPost ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 md:items-center md:justify-center md:p-6">
          <article className="max-h-[92vh] w-full overflow-auto rounded-t-3xl border border-white/10 bg-[#0a0f1c] p-4 md:max-w-xl md:rounded-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-100">{selectedPost.venue}</p>
              <button type="button" onClick={() => setSelectedPost(undefined)} className="rounded-full border border-white/15 p-1.5 text-zinc-200">
                <X size={14} />
              </button>
            </div>

            {selectedPost.mediaType === "video" ? (
              <video src={selectedPost.mediaUrl} controls className="aspect-[4/5] w-full rounded-2xl object-cover" />
            ) : (
              <Image src={selectedPost.mediaUrl} alt={selectedPost.caption} width={1200} height={1500} className="aspect-[4/5] w-full rounded-2xl object-cover" />
            )}

            <p className="mt-3 text-sm text-zinc-200">{selectedPost.caption}</p>
            <div className="mt-3">
              <FeedVibeMeter score={selectedPost.vibeScore} averageScore={selectedPost.venueAverageVibe} />
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
