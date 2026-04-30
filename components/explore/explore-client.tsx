"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPinned,
  List,
  SlidersHorizontal,
  Flame,
  MapPin,
  Clock3,
  Star,
  X,
  ChevronDown,
} from "lucide-react";

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
};

type Props = {
  initialVenues: ExploreVenue[];
};

const REGIONS = [
  { label: "New Brunswick", value: "new-brunswick" },
  { label: "Old Bridge", value: "old-bridge" },
  { label: "East Brunswick", value: "east-brunswick" },
];

const DISTANCES = [5, 10, 25, 50];

export default function ExploreClient({ initialVenues }: Props) {
  const [venues, setVenues] = useState<ExploreVenue[]>(initialVenues ?? []);
  const [region, setRegion] = useState("new-brunswick");
  const [distanceMiles, setDistanceMiles] = useState(10);
  const [openNowOnly, setOpenNowOnly] = useState(true);
  const [view, setView] = useState<"map" | "list">("list");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadVenues() {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        region,
        distanceMiles: String(distanceMiles),
        openNowOnly: String(openNowOnly),
      });

      const response = await fetch(`/api/venues/nearby?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await response.json();
      setVenues(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error("[explore] failed to load venues", error);
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, [region, distanceMiles, openNowOnly]);

  const regionLabel = useMemo(
    () => REGIONS.find((r) => r.value === region)?.label ?? "New Brunswick",
    [region]
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden pb-28">
      <section className="mb-4">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300/90">
              Explore
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Tonight in Central Jersey
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Bars, lounges, clubs, comedy spots, and nightlife around you.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 rounded-[24px] border border-white/10 bg-[#081226]/90 p-3 backdrop-blur-xl">
        <div className="hidden flex-wrap items-center gap-3 md:flex">
          <div className="relative">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10"
            >
              {REGIONS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  className="text-black"
                >
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
          </div>

          <div className="flex items-center gap-2">
            {DISTANCES.map((value) => (
              <button
                key={value}
                onClick={() => setDistanceMiles(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  distanceMiles === value
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {value} mi
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpenNowOnly((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              openNowOnly
                ? "bg-emerald-500 text-black"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Open now
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setView("map")}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                view === "map"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <MapPinned size={16} />
              Map
            </button>

            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                view === "list"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <List size={16} />
              List
            </button>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-400">Showing results for</p>
              <p className="truncate text-sm font-semibold text-white">
                {regionLabel} · {distanceMiles} mi
              </p>
            </div>

            <button
              onClick={() => setView("map")}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                view === "map"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white"
              }`}
            >
              <MapPinned size={18} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                view === "list"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white"
              }`}
            >
              <List size={18} />
            </button>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-zinc-400">
          {isLoading
            ? "Loading nightlife spots..."
            : `${venues.length} places found${openNowOnly ? " · open now only" : ""}`}
        </p>

        <button className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10">
          <Flame size={14} />
          <span className="hidden sm:inline">Trending neighborhoods</span>
          <span className="sm:hidden">Trending</span>
        </button>
      </div>

      {view === "list" ? (
        <div className="mt-4 grid gap-4">
          {venues.map((venue) => (
            <Link
  key={venue.googlePlaceId ?? venue.id}
  href={`/venue/${venue.googlePlaceId ?? venue.id}`}
  className="group block min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#091327_0%,#08101f_100%)] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.32)] transition duration-200 hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:shadow-[0_18px_45px_rgba(120,80,255,0.18)]"
>
  <div className="flex min-w-0 flex-col gap-4">
    <div className="h-40 w-full overflow-hidden rounded-[22px] bg-white/5 sm:h-36">
      {venue.photoUrl ? (
        <img
          src={venue.photoUrl}
          alt={venue.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
          No image
        </div>
      )}
    </div>

    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-start gap-2">
        <h2 className="min-w-0 flex-1 break-words text-lg font-bold leading-tight text-white sm:text-xl">
          {venue.name}
        </h2>

        <div className="shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 px-3 py-1.5 text-center text-xs font-bold text-white shadow-lg">
          Hot
        </div>
      </div>

      <p className="mt-3 break-words text-sm text-zinc-300">
        {venue.address}
      </p>

      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
        <span className="inline-flex items-center gap-1">
          <Star size={15} className="fill-orange-400 text-orange-400" />
          {venue.rating ?? "—"}
        </span>

        <span>{venue.totalReviews ?? 0} reviews</span>

        <span className="inline-flex items-center gap-1">
          <MapPin size={15} />
          {typeof venue.distanceMiles === "number"
            ? `${venue.distanceMiles.toFixed(1)} mi`
            : "Nearby"}
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

          {!isLoading && venues.length === 0 && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
              No venues found for this filter set.
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#091327_0%,#08101f_100%)] p-5 text-sm text-zinc-300">
          Map view placeholder
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] border-t border-white/10 bg-[#081226] p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/20" />

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-white">Region</p>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  {REGIONS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="text-black"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-white">
                  Distance
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {DISTANCES.map((value) => (
                    <button
                      key={value}
                      onClick={() => setDistanceMiles(value)}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        distanceMiles === value
                          ? "bg-white text-black"
                          : "border border-white/10 bg-white/5 text-white"
                      }`}
                    >
                      {value} mi
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOpenNowOnly((prev) => !prev)}
                className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  openNowOnly
                    ? "bg-emerald-500 text-black"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                Open now only: {openNowOnly ? "On" : "Off"}
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-3 text-sm font-bold text-white"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}