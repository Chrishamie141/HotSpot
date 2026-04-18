"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [meRes, feedRes] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch("/api/feed", { cache: "no-store" }),
      ]);
      if (!meRes.ok || !feedRes.ok) return;

      const me = await meRes.json();
      const feed = await feedRes.json();
      const savedIds = Array.isArray(me.user?.savedPostIds) ? me.user.savedPostIds : [];
      const allPosts = Array.isArray(feed.posts) ? feed.posts : [];
      setPosts(allPosts.filter((post: any) => savedIds.includes(post.id)));
    };
    load();
  }, []);

  return (
    <AppShell title="Saved posts" locationLabel="Central Jersey">
      <section className="space-y-3">
        {posts.length ? posts.map((post) => (
          <Card key={post.id} className="rounded-2xl p-4">
            <p className="text-sm font-semibold">{post.venueName}</p>
            <p className="mt-1 text-sm text-zinc-300">{post.caption}</p>
          </Card>
        )) : <Card className="p-4 text-sm text-zinc-300">No saved posts yet.</Card>}
      </section>
    </AppShell>
  );
}
