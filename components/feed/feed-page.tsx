"use client";

import { useEffect, useState } from "react";
import { CreatePostFlow } from "@/components/feed/create-post-flow";
import { mockFeedPosts, mockFeedStories } from "@/components/feed/mock-feed-data";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { FeedStories } from "@/components/feed/feed-stories";
import type { FeedPost } from "@/components/feed/types";

const FEED_STORAGE_KEY = "nightpulse:feed-posts:v1";

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FEED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPosts(parsed);
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

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

  function onCreatePost(draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    locationTag?: string;
  }) {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      username: "@you",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      venue: draft.venue,
      location: draft.locationTag || "Newark, NJ",
      postedAt: "now",
      mediaUrl: draft.mediaUrl ?? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      mediaType: draft.mediaType ?? "image",
      caption: draft.caption,
      vibeScore: draft.vibeScore,
      venueAverageVibe: draft.vibeScore,
      hearted: false,
      commentsCount: 0,
    };

    setPosts((current) => [newPost, ...current]);
  }

  return (
    <section className="-mt-2 space-y-4 pb-8">
      <FeedStories stories={mockFeedStories} />

      <div className="space-y-4">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} onToggleHeart={onToggleHeart} />
        ))}
      </div>

      <CreatePostFlow onCreatePost={onCreatePost} />
    </section>
  );
}
