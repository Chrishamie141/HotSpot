"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Flame, MapPin, Radio, Timer } from "lucide-react";
import { Card } from "@/components/ui";
import { RegionKey, ExploreVenue } from "@/lib/explore/types";
import { CENTRAL_JERSEY_REGIONS, getRegionConfig } from "@/lib/explore/regions";
import {
  getHotRightNow,
  getRecommendation,
  getRecommendationReasons,
  LiveVenue,
  transformLiveVenues,
} from "@/lib/live/transform-live-venues";
import { RecommendationCard } from "@/components/live/recommendation-card";
import { LiveMap } from "@/components/live/live-map";
import { LiveVenueList } from "@/components/live/live-venue-list";

type LiveDashboardProps = {
  initialRegion: RegionKey;
  initialVenues: ExploreVenue[];
};

type NearbyApiResponse = {
  data?: ExploreVenue[];
  meta?: {
    center?: { lat: number; lng: number };
  };
};

const DISTANCE_OPTIONS = [5, 10, 25] as const;

export function LiveDashboard({ initialRegion, initialVenues }: LiveDashboardProps) {
  const [region, setRegion] = useState<RegionKey>(initialRegion);
  const [distanceMiles, setDistanceMiles] = useState<number>(10);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(true);
  const [venues, setVenues] = useState<ExploreVenue[]>(initialVenues);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(initialVenues[0]?.id ?? null);
  const [center, setCenter] = useState(getRegionConfig(initialRegion).center);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVenues = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        region,
        distanceMiles: String(distanceMiles),
        openNowOnly: String(openNowOnly),
      });

      if (region === "near-me" && coords) {
        params.set("lat", String(coords.lat));
        params.set("lng", String(coords.lng));
      }

      const response = await fetch(`/api/venues/nearby?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load venues: ${response.status}`);
      }

      const json = (await response.json()) as NearbyApiResponse;
      const nextVenues = Array.isArray(json?.data) ? json.data : [];
      setVenues(nextVenues);
      setCenter(json.meta?.center ?? getRegionConfig(region).center);
      setSelectedVenueId((current) => current && nextVenues.some((venue) => venue.id === current) ? current : nextVenues[0]?.id ?? null);
    } catch (loadError) {
      console.error("[live] failed to load venues", loadError);
      setVenues([]);
      setError("We couldn’t load nearby venues right now.");
    } finally {
      setIsLoading(false);
    }
  }, [coords, distanceMiles, openNowOnly, region]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  useEffect(() => {
    if (region !== "near-me" || typeof navigator === "undefined") {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setCoords(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [region]);

  const liveVenues = useMemo(() => transformLiveVenues(venues), [venues]);
  const selectedVenue = useMemo(
    () => liveVenues.find((venue) => venue.id === selectedVenueId) ?? null,
    [liveVenues, selectedVenueId]
  );

  const hotRightNow = useMemo(() => getHotRightNow(liveVenues, 3), [liveVenues]);
  const recommendation = useMemo(() => getRecommendation(liveVenues), [liveVenues]);
  const recommendationReasons = useMemo(
    () => (recommendation ? getRecommendationReasons(recommendation) : []),
    [recommendation]
  );

  const buzzIndex = useMemo(() => {
    if (liveVenues.length === 0) return 0;
    return Math.round(liveVenues.reduce((sum, venue) => sum + venue.hotScore, 0) / liveVenues.length);
  }, [liveVenues]);

  const averageWait = useMemo(() => {
    if (liveVenues.length === 0) return 0;
    return Math.round(
      liveVenues.reduce((sum, venue) => sum + venue.estimatedWaitTime, 0) / liveVenues.length
    );
  }, [liveVenues]);

  return (
    <section className="space-y-4 sm:space-y-5">
      <Card className="space-y-2 rounded-2xl p-4 sm:p-5">
        <h2 className="text-lg font-semibold sm:text-xl">Live city pulse</h2>
        <p className="text-sm text-zinc-300">
          Real nearby nightlife signals powered by live places data from your selected region.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Card className="rounded-2xl p-3 sm:p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-fuchsia-200 sm:text-sm">
            <Activity size={14} /> Buzz Index
          </p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">{buzzIndex}</p>
        </Card>
        <Card className="rounded-2xl p-3 sm:p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-cyan-200 sm:text-sm">
            <Radio size={14} /> Active venues
          </p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">{liveVenues.length}</p>
        </Card>
        <Card className="rounded-2xl p-3 sm:p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-violet-200 sm:text-sm">
            <Timer size={14} /> Avg line
          </p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">{averageWait} min</p>
        </Card>
        <Card className="rounded-2xl p-3 sm:p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-emerald-200 sm:text-sm">
            <MapPin size={14} /> Region
          </p>
          <p className="mt-1 truncate text-base font-semibold sm:text-lg">{getRegionConfig(region).label}</p>
        </Card>
      </div>

      <Card className="rounded-2xl p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionKey)}
            className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 outline-none"
          >
            {CENTRAL_JERSEY_REGIONS.map((item) => (
              <option key={item.key} value={item.key} className="text-black">
                {item.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {DISTANCE_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDistanceMiles(value)}
                className={`min-h-9 rounded-lg px-3 text-xs font-semibold sm:text-sm ${
                  distanceMiles === value ? "bg-white text-black" : "text-zinc-200"
                }`}
              >
                {value} mi
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpenNowOnly((current) => !current)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
              openNowOnly
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                : "border-white/10 bg-white/5 text-zinc-200"
            }`}
          >
            Open now
          </button>
        </div>
      </Card>

      <RecommendationCard venue={recommendation} reasons={recommendationReasons} />

      <Card className="rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Flame size={16} className="text-amber-300" /> Hot right now
          </h3>
          <span className="text-xs text-zinc-400">Top 3 nearby</span>
        </div>

        <div className="space-y-2.5">
          {hotRightNow.map((venue, index) => (
            <button
              key={venue.id}
              type="button"
              onClick={() => setSelectedVenueId(venue.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${selectedVenueId === venue.id ? "border-fuchsia-300/35 bg-fuchsia-500/10" : "border-white/10 bg-white/5"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-zinc-50 sm:text-base">
                  #{index + 1} {venue.name}
                </p>
                <span className="text-xs text-zinc-300">{venue.estimatedWaitTime} min</span>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-zinc-400 sm:text-sm">{venue.address || "Address unavailable"}</p>
            </button>
          ))}

          {!isLoading && hotRightNow.length === 0 && (
            <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
              No hot venues available for this region yet.
            </p>
          )}
        </div>
      </Card>

      <LiveMap
        venues={liveVenues}
        selectedVenueId={selectedVenue?.id ?? null}
        onSelectVenue={setSelectedVenueId}
        fallbackCenter={center}
      />

      {isLoading && (
        <Card className="rounded-2xl p-4 text-sm text-zinc-300">Loading nearby venues...</Card>
      )}

      {error && !isLoading && (
        <Card className="rounded-2xl border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</Card>
      )}

      {!isLoading && !error && liveVenues.length === 0 && (
        <Card className="rounded-2xl p-4 text-sm text-zinc-300">
          No venues found. Try a larger distance or a different region.
        </Card>
      )}

      {!isLoading && liveVenues.length > 0 && (
        <LiveVenueList
          venues={liveVenues}
          selectedVenueId={selectedVenue?.id ?? null}
          onSelectVenue={setSelectedVenueId}
        />
      )}
    </section>
  );
}
