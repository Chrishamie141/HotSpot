"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_CITY, loadOnboardingState } from "@/lib/onboarding";

export function ExploreWelcome() {
  const [name, setName] = useState("");
  const [city, setCity] = useState(DEFAULT_CITY);
  const [interests, setInterests] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const isWelcomeMoment = searchParams.get("welcome") === "1";

  useEffect(() => {
    const profile = loadOnboardingState();
    setName(profile.firstName);
    setCity(profile.city || DEFAULT_CITY);
    setInterests(profile.interests.slice(0, 3));
  }, []);

  return (
    <div className="rounded-2xl border border-fuchsia-300/20 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/10 to-cyan-400/10 p-4 text-sm text-white/80">
      <p className="font-medium text-white">
        {isWelcomeMoment ? "Welcome to NightPulse" : "NightPulse tailored for you"}
        {name ? `, ${name}` : ""}.
      </p>
      <p className="mt-1">
        Showing hot spots around <span className="text-white">{city}</span>
        {interests.length ? ` · Vibe: ${interests.join(", ")}` : ""}
      </p>
    </div>
  );
}
