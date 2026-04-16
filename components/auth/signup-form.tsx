"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    avatarUrl: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Signup failed.");
        return;
      }

      router.push("/explore");
      router.refresh();
    } catch {
      setError("Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {[
        ["username", "Username"],
        ["displayName", "Display name"],
        ["email", "Email"],
      ].map(([key, label]) => (
        <input
          key={key}
          value={(form as any)[key]}
          onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          placeholder={label}
          className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none"
        />
      ))}

      <input
        type="password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        placeholder="Password"
        className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none"
      />

      <input
        value={form.avatarUrl}
        onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
        placeholder="Avatar URL (optional)"
        className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none"
      />

      <textarea
        value={form.bio}
        onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
        placeholder="Bio (optional)"
        className="min-h-24 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
