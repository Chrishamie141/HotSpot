"use client";

import { useMemo, useState } from "react";
import { Flame, MapPin } from "lucide-react";
import { liveFeedPosts } from "@/components/live/mock-live-posts";
import type { LiveFeedPost } from "@/components/live/types";
import { LiveFeedCard } from "@/components/live/live-feed-card";
import { MediaPostComposer } from "@/components/live/media-post-composer";

export function LiveFeedSection() {
  const [posts, setPosts] = useState<LiveFeedPost[]>(liveFeedPosts);

  const hotVenueStats = useMemo(() => {
    const venueMap = new Map<string, { count: number; avg: number }>();

    posts.forEach((post) => {
      const existing = venueMap.get(post.venue);
      if (existing) {
        venueMap.set(post.venue, {
          count: existing.count + 1,
          avg: (existing.avg * existing.count + post.vibeScore) / (existing.count + 1),
        });
      } else {
        venueMap.set(post.venue, { count: 1, avg: post.vibeScore });
      }
    });

    return [...venueMap.entries()]
      .map(([venue, stats]) => ({ venue, ...stats }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 4);
  }, [posts]);

  function toggleHeart(postId: string) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              hearted: !post.hearted,
            }
          : post,
      ),
    );
  }

  function createPost(draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
  }) {
    const newPost: LiveFeedPost = {
      id: `post-${Date.now()}`,
      username: "@you",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      venue: draft.venue,
      location: "Newark, NJ",
      postedAt: "Just now",
      mediaUrl:
        draft.mediaUrl ??
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      mediaType: draft.mediaType ?? "image",
      caption: draft.caption,
      vibeScore: draft.vibeScore,
      hearted: false,
      commentsCount: 0,
      venueAverageVibe: draft.vibeScore,
    };

    setPosts((current) => [newPost, ...current]);
  }

  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Live social feed</h2>
            <p className="text-sm text-zinc-300">Instagram-style nightlife posts with venue tags and real-time vibes.</p>
          </div>
        </div>

        <MediaPostComposer onCreatePost={createPost} />

        <div className="space-y-4">
          {posts.map((post) => (
            <LiveFeedCard key={post.id} post={post} onToggleHeart={toggleHeart} />
          ))}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-100">
            <Flame size={16} /> Hot venues now
          </p>
          <div className="mt-3 space-y-3">
            {hotVenueStats.map((venue) => (
              <div key={venue.venue} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium text-zinc-100">{venue.venue}</p>
                <p className="mt-1 text-xs text-zinc-400">{venue.count} posts in feed</p>
                <p className="mt-1 text-xs text-cyan-200">Average vibe {venue.avg.toFixed(1)} / 10</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-300">
          <p className="font-medium text-zinc-100">Venue-first discovery</p>
          <p className="mt-2">Every post is pinned to a place so users can instantly check what a specific venue feels like right now.</p>
          <p className="mt-3 inline-flex items-center gap-1 text-cyan-200">
            <MapPin size={14} /> Works with future API-based live check-ins.
          </p>
        </div>
      </aside>
    </section>
  );
}
