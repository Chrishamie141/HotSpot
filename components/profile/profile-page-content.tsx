"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui";

type CurrentUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
};

type ProfilePost = {
  id: string;
  userId: string;
  venueName: string;
  caption: string;
  mediaUrl: string;
  createdAt: string;
};

type FavoriteVenue = {
  id: string;
  userId: string;
  venueId: string;
  name: string;
};

export function ProfilePageContent() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [favorites, setFavorites] = useState<FavoriteVenue[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", username: "", bio: "", avatarUrl: "" });
  const [error, setError] = useState("");

  async function loadProfileData() {
    const meResponse = await fetch("/api/auth/me", { cache: "no-store" });
    if (!meResponse.ok) {
      setError("Could not load your profile.");
      return;
    }

    const meJson = await meResponse.json();
    const nextUser = meJson.user as CurrentUser;
    setUser(nextUser);
    setForm({
      displayName: nextUser.displayName,
      username: nextUser.username,
      bio: nextUser.bio,
      avatarUrl: nextUser.avatarUrl,
    });

    const [feedResponse, favoritesResponse] = await Promise.all([
      fetch("/api/feed", { cache: "no-store" }),
      fetch("/api/favorites", { cache: "no-store" }),
    ]);

    if (feedResponse.ok) {
      const feedJson = await feedResponse.json();
      const all = Array.isArray(feedJson.posts) ? feedJson.posts : [];
      setPosts(all.filter((item: any) => item.userId === nextUser.id));
    }

    if (favoritesResponse.ok) {
      const favJson = await favoritesResponse.json();
      setFavorites(Array.isArray(favJson.favorites) ? favJson.favorites : []);
    }
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  const joinedText = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Unable to save profile.");
      return;
    }

    setUser(json.user);
    setIsEditing(false);
    setError("");
  }

  if (!user) {
    return <Card className="p-4 text-sm text-zinc-300">Loading profile...</Card>;
  }

  return (
    <section className="space-y-4">
      <Card className="rounded-3xl p-5">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.displayName} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-lg font-semibold">{user.displayName}</p>
            <p className="text-sm text-zinc-400">@{user.username}</p>
            <p className="text-xs text-zinc-500">Joined {joinedText}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-zinc-300">{user.bio || "No bio yet."}</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="rounded-full border border-white/15 px-2 py-1">{posts.length} posts</span>
          <span className="rounded-full border border-white/15 px-2 py-1">{favorites.length} saved</span>
        </div>
      </Card>

      <Card className="rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Edit profile</h3>
          <button className="rounded-lg border border-white/15 px-3 py-1 text-xs" onClick={() => setIsEditing((v) => !v)}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={onSaveProfile} className="space-y-3">
            <input value={form.displayName} onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Display name" />
            <input value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Username" />
            <input value={form.avatarUrl} onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Avatar URL" />
            <textarea value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} className="min-h-24 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm" placeholder="Bio" />
            <button type="submit" className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black">Save changes</button>
          </form>
        ) : (
          <p className="text-sm text-zinc-400">Use edit to update your name, username, bio, and avatar.</p>
        )}

        {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
      </Card>

      <Card className="rounded-3xl p-5">
        <h3 className="text-sm font-semibold">Your posts</h3>
        <div className="mt-3 space-y-2">
          {posts.length ? posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-white/10 p-3">
              <p className="text-sm font-medium">{post.venueName}</p>
              <p className="text-xs text-zinc-400">{new Date(post.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-sm text-zinc-300">{post.caption}</p>
            </div>
          )) : <p className="text-sm text-zinc-400">No posts yet.</p>}
        </div>
      </Card>

      <Card className="rounded-3xl p-5">
        <h3 className="text-sm font-semibold">Saved venues</h3>
        <ul className="mt-3 space-y-1 text-sm text-zinc-300">
          {favorites.length ? favorites.map((item) => <li key={item.id}>• {item.name}</li>) : <li className="text-zinc-400">No saved venues yet.</li>}
        </ul>
      </Card>
    </section>
  );
}
