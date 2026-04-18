"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

type CurrentUser = {
  displayName: string;
  username: string;
  email: string;
  createdAt: string;
};

export default function ProfileAccountPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) return;
      const json = await response.json();
      setUser(json.user);
      setEmail(json.user?.email ?? "");
    };
    load();
  }, []);

  async function onEmailSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();
    if (!response.ok) {
      setMessage(json.error ?? "Unable to update email.");
      return;
    }

    setUser(json.user);
    setMessage("Email updated.");
  }

  async function onPasswordSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const json = await response.json();
    if (!response.ok) {
      setMessage(json.error ?? "Unable to change password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setMessage("Password updated.");
  }

  return (
    <AppShell title="Account settings" locationLabel="Central Jersey">
      <section className="space-y-4">
        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Account info</h2>
          <p className="mt-2 text-sm text-zinc-300">Display name: {user?.displayName ?? "-"}</p>
          <p className="text-sm text-zinc-300">Username: @{user?.username ?? "-"}</p>
          <p className="text-sm text-zinc-300">Email: {user?.email ?? "-"}</p>
          <p className="text-sm text-zinc-300">Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p>
        </Card>

        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Change email</h2>
          <form onSubmit={onEmailSubmit} className="mt-3 space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" />
            <button type="submit" className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black">Update email</button>
          </form>
        </Card>

        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Change password</h2>
          <form onSubmit={onPasswordSubmit} className="mt-3 space-y-3">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm" />
            <button type="submit" className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black">Update password</button>
          </form>
          {message ? <p className="mt-2 text-sm text-cyan-200">{message}</p> : null}
        </Card>
      </section>
    </AppShell>
  );
}
