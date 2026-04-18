"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";

type CurrentUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  privacyEnabled: boolean;
  notificationsEnabled: boolean;
  contentPreferencesEnabled: boolean;
  nightlifePreferences: string[];
  savedPostIds: string[];
  taggedPostIds: string[];
};

export function ProfilePageContent() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState("");

  async function loadProfileData() {
    const meResponse = await fetch("/api/auth/me", { cache: "no-store" });
    if (!meResponse.ok) {
      setError("Could not load your profile.");
      return;
    }

    const meJson = await meResponse.json();
    setUser(meJson.user as CurrentUser);
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  const joinedText = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  async function onToggle(field: "privacyEnabled" | "notificationsEnabled" | "contentPreferencesEnabled", value: boolean) {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Unable to update setting.");
      return;
    }

    setUser(json.user);
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
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
      </Card>

      <Card className="rounded-3xl p-5">
        <h3 className="mb-3 text-sm font-semibold">Settings</h3>

        <div className="space-y-2">
          <Link href="/profile/edit" className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
            Edit profile <ChevronRight size={14} />
          </Link>
          <Link href="/profile/account" className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
            Account settings <ChevronRight size={14} />
          </Link>
          <Link href="/profile/saved-posts" className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
            Saved posts ({user.savedPostIds.length}) <ChevronRight size={14} />
          </Link>
          <Link href="/profile/tagged-posts" className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
            Tagged posts ({user.taggedPostIds.length}) <ChevronRight size={14} />
          </Link>
          <Link href="/profile/help" className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
            Help & support <ChevronRight size={14} />
          </Link>
        </div>
      </Card>

      <Card className="rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-semibold">Quick settings</h3>
        <label className="flex items-center justify-between text-sm">
          Privacy
          <input type="checkbox" checked={user.privacyEnabled} onChange={(e) => onToggle("privacyEnabled", e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm">
          Notifications
          <input type="checkbox" checked={user.notificationsEnabled} onChange={(e) => onToggle("notificationsEnabled", e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm">
          Content preferences
          <input type="checkbox" checked={user.contentPreferencesEnabled} onChange={(e) => onToggle("contentPreferencesEnabled", e.target.checked)} />
        </label>
      </Card>

      <button onClick={onLogout} className="w-full rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
        Log out
      </button>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
