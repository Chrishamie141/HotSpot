"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Login failed.");
        return;
      }

      router.push("/explore");
      router.refresh();
    } catch {
      setError("Unable to login right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        value={login}
        onChange={(event) => setLogin(event.target.value)}
        placeholder="Email or username"
        className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
