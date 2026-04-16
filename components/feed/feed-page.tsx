"use client";

import { useEffect, useState } from "react";
import { CreatePostFlow } from "@/components/feed/create-post-flow";
import { mockFeedStories } from "@/components/feed/mock-feed-data";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { FeedStories } from "@/components/feed/feed-stories";
import type { FeedPost } from "@/components/feed/types";

type ApiPost = {
  id: string;
  userId: string;
  venueName: string;
  locationTag: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  vibeScore: number;
  createdAt: string;
  user: {
    username: string;
    displayName: string;
    avatarUrl: string;
  } | null;
};

function mapApiPostToFeed(post: ApiPost): FeedPost {
  return {
    id: post.id,
    userId: post.userId,
    username: post.user?.username ? `@${post.user.username}` : "@unknown",
    displayName: post.user?.displayName ?? "Unknown user",
    avatarUrl: post.user?.avatarUrl ?? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    venue: post.venueName,
    location: post.locationTag || "Central Jersey",
    postedAt: new Date(post.createdAt).toLocaleDateString(),
    mediaUrl: post.mediaUrl,
    mediaType: post.mediaType,
    caption: post.caption,
    vibeScore: post.vibeScore,
    venueAverageVibe: post.vibeScore,
    hearted: false,
    commentsCount: 0,
  };
}

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [error, setError] = useState("");

  async function loadPosts() {
    try {
      setError("");
      const response = await fetch("/api/feed", { cache: "no-store" });
      if (!response.ok) throw new Error("failed");
      const json = await response.json();
      setPosts(Array.isArray(json.posts) ? json.posts.map(mapApiPostToFeed) : []);
    } catch {
      setError("Could not load feed right now.");
      setPosts([]);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function onToggleHeart(postId: string) {
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

  async function onCreatePost(draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    locationTag?: string;
  }) {
    const response = await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueName: draft.venue,
        caption: draft.caption,
        vibeScore: draft.vibeScore,
        mediaUrl: draft.mediaUrl,
        mediaType: draft.mediaType,
        locationTag: draft.locationTag,
      }),
    });

    if (response.ok) {
      await loadPosts();
    }
  }

  return (
    <section className="-mt-2 space-y-4 pb-8">
      <FeedStories stories={mockFeedStories} />

      {error ? <p className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p> : null}

      <div className="space-y-4">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} onToggleHeart={onToggleHeart} />
        ))}

        {!posts.length && !error ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">No posts yet. Share your first night out.</p>
        ) : null}
      </div>

      <CreatePostFlow onCreatePost={onCreatePost} />
    </section>
  );
}
