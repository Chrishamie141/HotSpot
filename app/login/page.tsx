"use client";

import { useState } from "react";

export default function LoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function continueLocally() {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/social/session", { method: "GET" });
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const session = await response.json();
      const requiresOnboarding = !session.onboardingCompleted || !session.displayName || !session.handle;
      window.location.href = requiresOnboarding ? "/onboarding" : "/profile";
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to continue locally.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">NightPulse</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Welcome back to HotSpot</h1>
        <p className="mt-3 max-w-sm text-sm text-zinc-300">Sign in with your local profile and pick up right where your nightlife plans left off.</p>

        <button
          type="button"
          onClick={continueLocally}
          disabled={status === "loading"}
          className="mt-8 w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Continuing..." : "Continue locally"}
        </button>

        {status === "error" ? (
          <div className="mt-4 w-full rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">
            <p className="font-medium">Unable to sign in.</p>
            <p className="mt-1 text-rose-200/90">{errorMessage}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
