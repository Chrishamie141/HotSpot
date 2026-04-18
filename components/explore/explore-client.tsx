"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPinned, List, Flame, MapPin, Clock3, Star, Search } from "lucide-react";
import { MapPanel } from "@/components/explore/map-panel";
import { classifyVenueType } from "@/lib/live/classifyVenueType";

type ExploreVenue = {
  id: string;
  googlePlaceId?: string;
  name: string;
  address: string;
  photoUrl?: string | null;
  rating?: number | null;
  totalReviews?: number;
  distanceMiles?: number;
  isOpenNow?: boolean | null;
  crowdLabel?: string | null;
  buzzScore?: number;
  lat: number;
  lng: number;
  types: string[];
};

type Props = {
  initialVenues: ExploreVenue[];
};

const REGIONS = [
  { label: "New Brunswick", value: "new-brunswick" },
  { label: "Princeton", value: "princeton" },
  { label: "Edison + Metuchen", value: "edison-metuchen" },
];

const DISTANCES = [5, 10, 25, 50];
const TYPE_FILTERS = ["all", "bar", "club", "restaurant", "lounge"] as const;
type VenueTypeFilter = (typeof TYPE_FILTERS)[number];

export default function ExploreClient({ initialVenues }: Props) {
  const [venues, setVenues] = useState<ExploreVenue[]>(initialVenues ?? []);
  const [region, setRegion] = useState("new-brunswick");
  const [distanceMiles, setDistanceMiles] = useState(10);
  const [openNowOnly, setOpenNowOnly] = useState(true);
  const [view, setView] = useState<"map" | "list">("list");
  const [venueFilter, setVenueFilter] = useState<VenueTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  async function loadVenues() {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        region,
        distanceMiles: String(distanceMiles),
        openNowOnly: String(openNowOnly),
      });

      const response = await fetch(`/api/venues/nearby?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setVenues(Array.isArray(json?.data) ? json.data : []);
    } catch (loadError) {
      console.error("[explore] failed to load venues", loadError);
      setVenues([]);
      setError("Could not load venues right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, [region, distanceMiles, openNowOnly]);

  const filteredVenues = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return venues.filter((venue) => {
      const venueType = classifyVenueType({ name: venue.name, types: venue.types }).venueType;
      const matchesType = venueFilter === "all" ? true : venueType === venueFilter;
      if (!matchesType) return false;

      if (!q) return true;
      return [venue.name, venue.address].some((field) => field.toLowerCase().includes(q));
    });
  }, [searchQuery, venueFilter, venues]);

  useEffect(() => {
    if (!filteredVenues.length) {
      setSelectedVenueId(null);
      return;
    }

    if (!selectedVenueId || !filteredVenues.some((venue) => venue.id === selectedVenueId)) {
      setSelectedVenueId(filteredVenues[0].id);
    }
  }, [filteredVenues, selectedVenueId]);

  useEffect(() => {
    if (!selectedVenueId) return;
    const node = listRefs.current[selectedVenueId];
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedVenueId]);

  const center = useMemo(() => {
    const selected = filteredVenues.find((venue) => venue.id === selectedVenueId);
    return selected ? { lat: selected.lat, lng: selected.lng } : { lat: 40.4862, lng: -74.4518 };
  }, [filteredVenues, selectedVenueId]);

  return (
    <div className="w-full min-w-0 overflow-x-hidden pb-28">
      <section className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300/90">Explore</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Tonight in Central Jersey</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">Find bars, clubs, restaurants, and lounges with live-friendly filters.</p>
      </section>

      <section className="sticky top-0 z-20 rounded-[24px] border border-white/10 bg-[#081226]/90 p-3 backdrop-blur-xl">
        <div className="grid gap-2 md:grid-cols-[auto_auto_auto_1fr_auto]">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none"
          >
            {REGIONS.map((item) => (
              <option key={item.value} value={item.value} className="text-black">
                {item.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1">
            {DISTANCES.map((value) => (
              <button
                key={value}
                onClick={() => setDistanceMiles(value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  distanceMiles === value ? "bg-white text-black" : "text-white"
                }`}
              >
                {value} mi
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpenNowOnly((prev) => !prev)}
            className={`h-11 rounded-2xl px-4 text-sm font-semibold transition ${
              openNowOnly
                ? "bg-emerald-500 text-black"
                : "border border-white/10 bg-white/5 text-white"
            }`}
          >
            Open now
          </button>

          <label className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search venue, city, neighborhood"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white outline-none"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("map")}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${view === "map" ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white"}`}
            >
              <MapPinned size={17} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${view === "list" ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white"}`}
            >
              <List size={17} />
            </button>
          </div>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVenueFilter(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                venueFilter === type ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-200"
              }`}
            >
              {type === "all" ? "All" : `${type}s`}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-zinc-400">
          {isLoading
            ? "Loading nightlife spots..."
            : `${filteredVenues.length} places found${openNowOnly ? " · open now" : ""}`}
        </p>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200">
          <Flame size={14} /> Real-time shortlist
        </span>
      </div>

      {error ? <p className="mt-3 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p> : null}

      {!isLoading && !error && filteredVenues.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">No venues found in this area.</p>
      ) : null}

      {view === "map" ? (
        <div className="mt-4 space-y-3">
          <MapPanel
            center={center}
            venues={filteredVenues.map((venue) => ({ id: venue.id, name: venue.name, lat: venue.lat, lng: venue.lng }))}
            selectedVenueId={selectedVenueId}
            onMarkerSelect={setSelectedVenueId}
          />

          <div className="grid gap-2">
            {filteredVenues.slice(0, 6).map((venue) => (
              <button
                key={`mini-${venue.id}`}
                onClick={() => setSelectedVenueId(venue.id)}
                className={`rounded-xl border p-3 text-left text-sm ${selectedVenueId === venue.id ? "border-cyan-300/40 bg-cyan-500/10" : "border-white/10 bg-white/5"}`}
              >
                <p className="font-semibold">{venue.name}</p>
                <p className="truncate text-xs text-zinc-400">{venue.address}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {filteredVenues.map((venue) => (
            <Link
              ref={(node) => {
                listRefs.current[venue.id] = node;
              }}
              onMouseEnter={() => setSelectedVenueId(venue.id)}
              key={venue.googlePlaceId ?? venue.id}
              href={`/venue/${venue.googlePlaceId ?? venue.id}`}
              className={`group block min-w-0 overflow-hidden rounded-[24px] border p-4 shadow-[0_14px_40px_rgba(0,0,0,0.32)] transition ${selectedVenueId === venue.id ? "border-cyan-300/35 bg-cyan-500/[0.08]" : "border-white/10 bg-[linear-gradient(180deg,#091327_0%,#08101f_100%)] hover:border-fuchsia-400/30"}`}
            >
              <div className="flex min-w-0 flex-col gap-4">
                <div className="h-36 w-full overflow-hidden rounded-[18px] bg-white/5">
                  {venue.photoUrl ? (
                    <img src={venue.photoUrl} alt={venue.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">No image</div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-start gap-2">
                    <h2 className="min-w-0 flex-1 break-words text-lg font-bold leading-tight text-white sm:text-xl">{venue.name}</h2>
                  </div>

                  <p className="mt-2 break-words text-sm text-zinc-300">{venue.address}</p>

                  <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
                    <span className="inline-flex items-center gap-1">
                      <Star size={15} className="fill-orange-400 text-orange-400" />
                      {venue.rating ?? "—"}
                    </span>

                    <span>{venue.totalReviews ?? 0} reviews</span>

                    <span className="inline-flex items-center gap-1">
                      <MapPin size={15} />
                      {typeof venue.distanceMiles === "number" ? `${venue.distanceMiles.toFixed(1)} mi` : "Nearby"}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={15} />
                      {venue.isOpenNow ? "Open now" : "Hours unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
