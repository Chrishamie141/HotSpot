"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

type CurrentUser = {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
};

export default function ProfileEditPage() {
  const [form, setForm] = useState<CurrentUser>({
    displayName: "",
    username: "",
    bio: "",
    avatarUrl: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        setError("Could not load your profile.");
        return;
      }

      const json = await response.json();
      setForm({
        displayName: json.user.displayName ?? "",
        username: json.user.username ?? "",
        bio: json.user.bio ?? "",
        avatarUrl: json.user.avatarUrl ?? "",
      });
    };

    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error ?? "Unable to save profile.");
      setIsSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setIsSaving(false);
  }

  return (
    <AppShell title="Edit profile" locationLabel="Central Jersey">
      <section className="space-y-4">
        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Edit profile</h2>
          <p className="mt-1 text-sm text-zinc-400">Update your display profile details for NightPulse.</p>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <input
              value={form.displayName}
              onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
              className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm"
              placeholder="Display name"
            />
            <input
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm"
              placeholder="Username"
            />
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
              className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm"
              placeholder="Avatar URL"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              className="min-h-24 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
              placeholder="Bio"
            />

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </form>

          {message ? <p className="mt-2 text-sm text-cyan-200">{message}</p> : null}
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </Card>
      </section>
    </AppShell>
  );
}
