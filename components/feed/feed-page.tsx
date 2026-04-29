"use client";

import { useEffect, useState } from "react";
import { CreatePostFlow } from "@/components/feed/create-post-flow";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { FeedStories } from "@/components/feed/feed-stories";
import type { FeedPost, FeedStory } from "@/components/feed/types";

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [stories, setStories] = useState<FeedStory[]>([]);

  useEffect(() => {
    fetch("/api/social/feed")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setStories(data.stories ?? []);
      });
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
  }) {
    await fetch("/api/social/feed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    const refreshed = await fetch("/api/social/feed").then((response) => response.json());
    setPosts(refreshed.posts ?? []);
    setStories(refreshed.stories ?? []);
  }

  return (
    <section className="-mt-2 space-y-4 pb-8">
      <FeedStories stories={stories} />

      <div className="space-y-4">
        {posts.length === 0 ? <p className="px-1 text-sm text-zinc-400">No posts yet. Be the first to share tonight&apos;s vibe.</p> : null}
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} onToggleHeart={onToggleHeart} />
        ))}
      </div>

      <CreatePostFlow onCreatePost={onCreatePost} />
    </section>
  );
}
