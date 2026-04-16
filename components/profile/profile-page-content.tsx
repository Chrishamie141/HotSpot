"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

const NIGHTLIFE_OPTIONS = ["bars", "clubs", "lounges", "restaurants"];

export function ProfilePageContent() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", username: "", bio: "", avatarUrl: "" });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  const joinedText = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  async function patchProfile(payload: Record<string, unknown>) {
    setIsSaving(true);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Unable to save profile.");
      setIsSaving(false);
      return null;
    }

    setUser(json.user);
    setError("");
    setIsSaving(false);
    return json.user as CurrentUser;
  }

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();
    const updated = await patchProfile(form);
    if (updated) {
      setIsEditing(false);
    }
  }

  async function onToggle(field: "privacyEnabled" | "notificationsEnabled" | "contentPreferencesEnabled", value: boolean) {
    await patchProfile({ [field]: value });
  }

  async function onToggleNightlifePreference(option: string) {
    if (!user) return;
    const has = user.nightlifePreferences.includes(option);
    const next = has
      ? user.nightlifePreferences.filter((item) => item !== option)
      : [...user.nightlifePreferences, option];

    await patchProfile({ nightlifePreferences: next });
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Edit profile</h3>
          <button className="rounded-lg border border-white/15 px-3 py-1 text-xs" onClick={() => setIsEditing((v) => !v)}>
            {isEditing ? "Cancel" : "Edit profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={onSaveProfile} className="space-y-3">
            <input value={form.displayName} onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Display name" />
            <input value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Username" />
            <input value={form.avatarUrl} onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))} className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" placeholder="Avatar URL" />
            <textarea value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} className="min-h-24 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm" placeholder="Bio" />
            <button type="submit" disabled={isSaving} className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black disabled:opacity-60">Save changes</button>
          </form>
        ) : (
          <p className="text-sm text-zinc-400">Update display name, username, bio, and avatar from here.</p>
        )}
      </Card>

      <Card className="rounded-3xl p-5">
        <h3 className="mb-3 text-sm font-semibold">Settings</h3>

        <div className="space-y-2">
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
        <h3 className="text-sm font-semibold">Privacy & notifications</h3>
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

      <Card className="rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-semibold">Nightlife preferences</h3>
        <div className="flex flex-wrap gap-2">
          {NIGHTLIFE_OPTIONS.map((option) => {
            const active = user.nightlifePreferences.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggleNightlifePreference(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${active ? "bg-white text-black" : "border border-white/15 bg-white/5 text-zinc-200"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      <button onClick={onLogout} className="w-full rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
        Log out
      </button>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
