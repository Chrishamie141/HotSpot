"use client";

import { useState } from "react";
import { FeedComposer } from "@/components/feed/feed-composer";
import { mockFeedPosts, mockFeedStories } from "@/components/feed/mock-feed-data";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { FeedStories } from "@/components/feed/feed-stories";
import type { FeedPost } from "@/components/feed/types";

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);

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
  }) {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      username: "@you",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      venue: draft.venue,
      location: "Newark, NJ",
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
    <section className="space-y-4 pb-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Feed</h2>
        <FeedComposer onCreatePost={onCreatePost} />
      </div>

      <FeedStories stories={mockFeedStories} />

      <div className="space-y-4">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} onToggleHeart={onToggleHeart} />
        ))}
      </div>
    </section>
  );
}
