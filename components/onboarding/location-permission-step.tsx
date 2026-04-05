"use client";

import { useState } from "react";
import { DEFAULT_CITY, LocationPermissionStatus } from "@/lib/onboarding";

type LocationPermissionStepProps = {
  city: string;
  onCityChange: (city: string) => void;
  onResolved: (payload: {
    permission: LocationPermissionStatus;
    coordinates: { lat: number; lng: number } | null;
  }) => void;
  onBack: () => void;
};

export function LocationPermissionStep({
  city,
  onCityChange,
  onResolved,
  onBack,
}: LocationPermissionStepProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      onResolved({ permission: "manual", coordinates: null });
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("idle");
        onResolved({
          permission: "granted",
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      () => {
        setStatus("error");
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/85">
          We use your location to find bars, clubs, and nightlife spots near
          you.
        </p>
      </div>

      {status === "error" ? (
        <div className="space-y-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
          <p className="text-sm text-amber-100">
            We could not access your location. Enter your city manually and
            continue.
          </p>
          <input
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder="Manhattan"
            className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none"
          />
          <button
            onClick={() => onResolved({ permission: "manual", coordinates: null })}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-medium"
          >
            Save manual location
          </button>
          <button
            onClick={() => onResolved({ permission: "denied", coordinates: null })}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80"
          >
            Continue without location access
          </button>
        </div>
      ) : null}

      <div className="space-y-2">
        <button
          onClick={requestLocation}
          disabled={status === "loading"}
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {status === "loading" ? "Requesting location..." : "Allow Location"}
        </button>

        <button
          onClick={() => onResolved({ permission: "manual", coordinates: null })}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm font-medium"
        >
          Enter Location Manually
        </button>

        <button
          onClick={() => {
            if (!city.trim()) onCityChange(DEFAULT_CITY);
            onResolved({ permission: "skipped", coordinates: null });
          }}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white/70"
        >
          Skip
        </button>

        <button
          onClick={onBack}
          className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/60"
        >
          Back
        </button>
      </div>
    </div>
  );
}
