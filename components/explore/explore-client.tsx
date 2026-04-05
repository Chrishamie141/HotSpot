"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { VenueCard } from "@/components/venue-card";
import { Card, Badge } from "@/components/ui";
import { MapPanel } from "@/components/explore/map-panel";
import { DEFAULT_DISTANCE_MILES, DISTANCE_OPTIONS } from "@/lib/explore/distance";
import { CENTRAL_JERSEY_REGIONS, FALLBACK_REGION_KEY, getRegionConfig } from "@/lib/explore/regions";
import { ExploreVenue, RegionKey } from "@/lib/explore/types";

const REGION_STORAGE_KEY = "nightpulse:region";
const DISTANCE_STORAGE_KEY = "nightpulse:distanceMiles";

export function ExploreClient() {
  const [venues, setVenues] = useState<ExploreVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<RegionKey>(FALLBACK_REGION_KEY);
  const [distanceMiles, setDistanceMiles] = useState<number>(DEFAULT_DISTANCE_MILES);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [position, setPosition] = useState(getRegionConfig(FALLBACK_REGION_KEY).center);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    const storedRegion = window.localStorage.getItem(REGION_STORAGE_KEY) as RegionKey | null;
    const storedDistance = Number(window.localStorage.getItem(DISTANCE_STORAGE_KEY) ?? DEFAULT_DISTANCE_MILES);

    if (storedRegion && CENTRAL_JERSEY_REGIONS.some((option) => option.key === storedRegion)) {
      setRegion(storedRegion);
      setPosition(getRegionConfig(storedRegion === "near-me" ? FALLBACK_REGION_KEY : storedRegion).center);
    }

    if (DISTANCE_OPTIONS.some((option) => option.miles === storedDistance)) {
      setDistanceMiles(storedDistance);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(REGION_STORAGE_KEY, region);
    window.localStorage.setItem(DISTANCE_STORAGE_KEY, String(distanceMiles));
  }, [region, distanceMiles]);

  useEffect(() => {
    if (region !== "near-me") {
      setLocationDenied(false);
      setPosition(getRegionConfig(region).center);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (geo) => {
        setLocationDenied(false);
        setPosition({ lat: geo.coords.latitude, lng: geo.coords.longitude });
      },
      () => {
        setLocationDenied(true);
        setRegion(FALLBACK_REGION_KEY);
        setPosition(getRegionConfig(FALLBACK_REGION_KEY).center);
      },
      { timeout: 6000 }
    );
  }, [region]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      region,
      distanceMiles: String(distanceMiles),
      lat: String(position.lat),
      lng: String(position.lng)
    });

    if (openNowOnly) params.set("openNowOnly", "true");
    return params.toString();
  }, [distanceMiles, openNowOnly, position.lat, position.lng, region]);

  useEffect(() => {
    const id = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/venues/nearby?${query}`);
        if (!response.ok) throw new Error("Failed to load venues");
        const payload = await response.json() as { data?: ExploreVenue[]; error?: string };
        setVenues(payload.data ?? []);
      } catch (fetchError) {
        setError(String(fetchError));
        setVenues([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [query]);

  const filterButton = "rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15";

  return (
    <section className="space-y-4">
      <div className="glass rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tonight in Central Jersey</h1>
            <p className="text-sm text-zinc-300">Real nightlife discovery with regional targeting and distance-aware ranking.</p>
          </div>
          <Badge className="gap-1"><SlidersHorizontal size={12} />Filters</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white"
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionKey)}
          >
            {CENTRAL_JERSEY_REGIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {DISTANCE_OPTIONS.map((option) => (
              <button
                key={option.miles}
                className={`${filterButton} ${distanceMiles === option.miles ? "border-fuchsia-300/60 bg-fuchsia-500/20" : ""}`}
                onClick={() => setDistanceMiles(option.miles)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button className={filterButton} onClick={() => setOpenNowOnly((value) => !value)}>
            {openNowOnly ? "Open now only: on" : "Open now only"}
          </button>
        </div>

        {locationDenied && (
          <p className="mt-2 text-xs text-amber-300">
            Location permission was denied. Showing New Brunswick as a fallback.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="h-[72vh] space-y-3 overflow-y-auto p-3">
          {loading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/10" />)}
          {!loading && error && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {!loading && !error && !venues.length && <p className="rounded-2xl bg-white/5 p-3 text-sm text-zinc-300">No venues found for these filters yet. Try a larger distance.</p>}
          {!loading && venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </Card>

        <MapPanel center={position} venues={venues} />
      </div>
    </section>
  );
}
