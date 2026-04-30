"use client";

import { FormEvent, useEffect, useState } from "react";

const NIGHTLIFE_OPTIONS = ["bars", "lounges", "clubs", "restaurants", "live music"] as const;

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [preferredNightlifeTypes, setPreferredNightlifeTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await fetch("/api/auth/me").then((res) => res.json());
        if (session.user?.onboardingCompleted) {
          window.location.href = "/profile";
          return;
        }

        setDisplayName(session.user?.displayName ?? "");
        setHandle(session.user?.socialProfile?.handle ?? "");
        setStatus("ready");
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unable to load onboarding.");
      }
    }

    loadSession();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch("/api/social/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName,
          username: handle,
          cityLine: preferredCity,
          preferredCity,
          preferredNightlifeTypes,
          ageRange,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}`);
      }

      window.location.href = "/profile";
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to save onboarding.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute left-0 top-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-black/90 p-5 shadow-2xl backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">NightPulse</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Set up your profile</h1>
        <p className="mt-2 text-sm text-zinc-300">Tell us what you like so your HotSpot feed starts personalized.</p>

        {status === "loading" ? <p className="mt-6 text-sm text-zinc-400">Loading your account…</p> : null}

        {status !== "loading" ? (
          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="displayName" className="mb-1 block text-sm text-zinc-200">Display name</label>
              <input id="displayName" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="handle" className="mb-1 block text-sm text-zinc-200">Handle</label>
              <input id="handle" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-white outline-none transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300/40" value={handle} onChange={(e) => setHandle(e.target.value)} required />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="city" className="mb-1 block text-sm text-zinc-200">City</label>
              <input id="city" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40" value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)} required />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="ageRange" className="mb-1 block text-sm text-zinc-200">Age range (optional)</label>
              <input id="ageRange" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-white outline-none transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300/40" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-zinc-200">Nightlife preferences</p>
              <div className="flex flex-wrap gap-2">
                {NIGHTLIFE_OPTIONS.map((option) => {
                  const active = preferredNightlifeTypes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-sm capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${active ? "border-cyan-300/70 bg-gradient-to-r from-cyan-400/25 to-fuchsia-400/25 text-cyan-100" : "border-white/20 text-zinc-200 hover:border-fuchsia-300/60 hover:text-white"}`}
                      onClick={() =>
                        setPreferredNightlifeTypes((current) =>
                          current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
                        )
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2 mt-2">
              <button type="submit" disabled={status === "saving"} className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-70">
                {status === "saving" ? "Saving..." : "Finish onboarding"}
              </button>
            </div>
          </form>
        ) : null}

        {status === "error" ? (
          <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">
            {errorMessage || "Something went wrong."}
          </div>
        ) : null}
      </section>
    </main>
  );
}
