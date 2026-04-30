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
        const session = await fetch("/api/social/session").then((res) => res.json());
        if (session.onboardingCompleted) {
          window.location.href = "/profile";
          return;
        }
        setDisplayName(session.displayName ?? "");
        setHandle(session.handle ?? "");
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
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950/80 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">NightPulse</p>
        <h1 className="mt-3 text-3xl font-semibold">Set up your profile</h1>
        <p className="mt-2 text-sm text-zinc-300">Tell us what you like so your HotSpot feed starts personalized.</p>

        {status === "loading" ? <p className="mt-6 text-sm text-zinc-400">Loading your account…</p> : null}

        {status !== "loading" ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input className="w-full rounded-xl border border-white/15 bg-black px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" required />
            <input className="w-full rounded-xl border border-white/15 bg-black px-3 py-2" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Handle" required />
            <input className="w-full rounded-xl border border-white/15 bg-black px-3 py-2" value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)} placeholder="City" required />
            <input className="w-full rounded-xl border border-white/15 bg-black px-3 py-2" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} placeholder="Age range (optional)" />

            <div>
              <p className="mb-2 text-sm text-zinc-300">Nightlife preferences</p>
              <div className="flex flex-wrap gap-2">
                {NIGHTLIFE_OPTIONS.map((option) => {
                  const active = preferredNightlifeTypes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`rounded-full border px-3 py-1 text-sm ${active ? "border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-white/20 text-zinc-200"}`}
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

            <button type="submit" disabled={status === "saving"} className="w-full rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black disabled:opacity-70">
              {status === "saving" ? "Saving..." : "Finish onboarding"}
            </button>
          </form>
        ) : null}

        {status === "error" ? <p className="mt-4 text-sm text-rose-300">{errorMessage || "Something went wrong."}</p> : null}
      </div>
    </main>
  );
}
