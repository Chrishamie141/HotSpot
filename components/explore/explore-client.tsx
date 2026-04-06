"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui";
import { ExploreFilterMenu } from "@/components/explore/explore-filter-menu";
import { NeighborhoodCardsSection } from "@/components/explore/neighborhood-cards-section";
import { ViewModeToggle } from "@/components/explore/view-mode-toggle";
import { ExploreMapPanel } from "@/components/explore/explore-map-panel";
import { VenueListPanel } from "@/components/explore/venue-list-panel";
import { DEFAULT_DISTANCE_MILES, DISTANCE_OPTIONS } from "@/lib/explore/distance";
import { CENTRAL_JERSEY_REGIONS, FALLBACK_REGION_KEY, getRegionConfig } from "@/lib/explore/regions";
import { ExploreSort, ExploreVenue, RegionKey, VenueTypeFilter } from "@/lib/explore/types";

const STORAGE_KEY = "nightpulse:explore-state";
const WELCOME_RESET_KEY = "nightpulse:welcome-reset.v1";

type ExploreState = {
  region: RegionKey;
  distanceMiles: number;
  openNowOnly: boolean;
  viewMode: "list" | "map";
  selectedTypes: VenueTypeFilter[];
  sort: ExploreSort;
};

type NearbyApiResponse = {
  data?: ExploreVenue[];
  error?: string;
  meta?: { emptyReason?: string; fallbackUsed?: boolean };
};

const defaultState: ExploreState = {
  region: FALLBACK_REGION_KEY,
  distanceMiles: DEFAULT_DISTANCE_MILES,
  openNowOnly: false,
  viewMode: "list",
  selectedTypes: [],
  sort: "best-match"
};

export function ExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const neighborhoodsRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ExploreState>(defaultState);
  const [venues, setVenues] = useState<ExploreVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emptyReason, setEmptyReason] = useState<string | undefined>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [geoPosition, setGeoPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const isWelcomeMoment = searchParams.get("welcome") === "1";
    if (!isWelcomeMoment) return;
    if (window.sessionStorage.getItem(WELCOME_RESET_KEY) === "1") return;

    setState(defaultState);
    setFilterOpen(true);
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.setItem(WELCOME_RESET_KEY, "1");
    router.replace("/explore");
  }, [router, searchParams]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<ExploreState>;
      setState((prev) => ({
        ...prev,
        ...parsed,
        region: CENTRAL_JERSEY_REGIONS.some((item) => item.key === parsed.region) ? parsed.region as RegionKey : prev.region,
        distanceMiles: DISTANCE_OPTIONS.some((item) => item.miles === parsed.distanceMiles) ? parsed.distanceMiles as number : prev.distanceMiles,
        selectedTypes: Array.isArray(parsed.selectedTypes) ? parsed.selectedTypes as VenueTypeFilter[] : prev.selectedTypes
      }));
    } catch (parseError) {
      console.warn("[Explore] Failed to parse local state", parseError);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.region !== "near-me") {
      setLocationDenied(false);
      setGeoPosition(null);
      return;
    }
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationDenied(false);
        setGeoPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setLocationDenied(true);
        setGeoPosition(null);
      },
      { timeout: 7000, maximumAge: 1000 * 60 * 10 }
    );
  }, [state.region]);

  const queryCenter = useMemo(() => {
    if (state.region === "near-me" && geoPosition) return geoPosition;
    if (state.region === "near-me" && !geoPosition) return getRegionConfig(FALLBACK_REGION_KEY).center;
    return getRegionConfig(state.region).center;
  }, [geoPosition, state.region]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      region: state.region,
      distanceMiles: String(state.distanceMiles),
      lat: String(queryCenter.lat),
      lng: String(queryCenter.lng),
      sort: state.sort
    });

    if (state.openNowOnly) params.set("openNowOnly", "true");
    if (state.selectedTypes.length) params.set("types", state.selectedTypes.join(","));

    return params.toString();
  }, [queryCenter.lat, queryCenter.lng, state.distanceMiles, state.openNowOnly, state.region, state.selectedTypes, state.sort]);

  useEffect(() => {
    const id = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setEmptyReason(undefined);
      try {
        const response = await fetch(`/api/venues/nearby?${query}`);
        const payload = await response.json() as NearbyApiResponse;
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load venues");
        }
        setVenues(payload.data ?? []);
        setEmptyReason(payload.meta?.emptyReason);
      } catch (fetchError) {
        console.error("[Explore] Venue fetch failed", fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load venues");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(id);
  }, [query]);

  return (
    <section className="space-y-4">
      <div className="glass rounded-3xl p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Tonight in Central Jersey</h1>
            <p className="text-sm text-zinc-300">Real nightlife discovery with region-aware search and live venue ranking.</p>
          </div>

          <ViewModeToggle
            value={state.viewMode}
            onChange={(viewMode) => setState((prev) => ({ ...prev, viewMode }))}
            neighborhoodsOpen={showNeighborhoods}
            onTrendingClick={() => {
              setShowNeighborhoods((prev) => !prev);
              neighborhoodsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>

        <ExploreFilterMenu
          isOpen={filterOpen}
          onToggle={() => setFilterOpen((open) => !open)}
          region={state.region}
          distanceMiles={state.distanceMiles}
          openNowOnly={state.openNowOnly}
          sort={state.sort}
          selectedTypes={state.selectedTypes}
          onRegionChange={(region) => setState((prev) => ({ ...prev, region }))}
          onDistanceChange={(distanceMiles) => setState((prev) => ({ ...prev, distanceMiles }))}
          onOpenNowChange={(openNowOnly) => setState((prev) => ({ ...prev, openNowOnly }))}
          onSortChange={(sort) => setState((prev) => ({ ...prev, sort }))}
          onTypeToggle={(type) => setState((prev) => ({
            ...prev,
            selectedTypes: prev.selectedTypes.includes(type)
              ? prev.selectedTypes.filter((item) => item !== type)
              : [...prev.selectedTypes, type]
          }))}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-100">Region: {getRegionConfig(state.region).label}</Badge>
          <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-100">Distance: {state.distanceMiles} miles</Badge>
          <Badge className="border-white/20 bg-white/10 text-zinc-100">Sort: {state.sort.replace("-", " ")}</Badge>
        </div>

        {locationDenied && state.region === "near-me" && (
          <p className="mt-2 text-xs text-amber-300">Location permission was denied. Using New Brunswick as fallback center.</p>
        )}
      </div>

      {showNeighborhoods && (
        <div ref={neighborhoodsRef}>
          <NeighborhoodCardsSection
            selectedRegion={state.region}
            onSelectRegion={(region) => setState((prev) => ({ ...prev, region }))}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <VenueListPanel
          venues={venues}
          loading={loading}
          error={error}
          region={state.region}
          distanceMiles={state.distanceMiles}
          openNowOnly={state.openNowOnly}
          emptyReason={emptyReason}
          selectedVenueId={selectedVenueId}
          onVenueHover={setSelectedVenueId}
          onSetDistance={(miles) => setState((prev) => ({ ...prev, distanceMiles: miles }))}
          onDisableOpenNow={() => setState((prev) => ({ ...prev, openNowOnly: false }))}
          onSetRegion={(region) => setState((prev) => ({ ...prev, region }))}
        />

        <div className={state.viewMode === "map" ? "block" : "hidden lg:block"}>
          <ExploreMapPanel
            center={queryCenter}
            venues={venues}
            selectedVenueId={selectedVenueId}
            onSelectVenue={setSelectedVenueId}
          />
        </div>
      </div>
    </section>
  );
}
