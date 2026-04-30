"use client";

import Link from "next/link";
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
      window.location.href = session.onboardingCompleted ? "/profile" : "/onboarding";
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to continue locally.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-10">
        <section className="hidden flex-col justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950/70 via-zinc-900/50 to-fuchsia-950/30 p-10 shadow-[0_0_80px_rgba(167,139,250,0.12)] lg:flex">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">NightPulse</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight">Welcome to HotSpot</h1>
          <p className="mt-4 max-w-md text-base text-zinc-300">
            Discover the city nightlife, share your vibe, and connect locally.
          </p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-300">
            Real-time venue energy, social stories, and your local profile all in one place.
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-black/90 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 text-lg font-semibold text-cyan-200">
              H
            </div>

            <h2 className="text-center text-3xl font-semibold tracking-tight">Welcome to HotSpot</h2>
            <p className="mt-2 text-center text-sm text-zinc-300">
              Discover the city nightlife, share your vibe, and connect locally.
            </p>

            <button
              type="button"
              onClick={continueLocally}
              disabled={status === "loading"}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-5 py-3 text-sm font-semibold text-black transition duration-200 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Continuing..." : "Continue locally"}
            </button>

            <p className="mt-3 text-center text-xs text-zinc-400">Local demo mode is enabled for this build.</p>

            {status === "error" ? (
              <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">
                <p className="font-medium">Unable to sign in.</p>
                <p className="mt-1 text-rose-200/90">{errorMessage}</p>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                href="/explore"
                className="text-cyan-200 transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Explore first
              </Link>
              <Link
                href="/profile"
                className="text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Need help?
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
