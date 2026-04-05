"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { VenueCard } from "@/components/venue-card";
import { Card, Badge } from "@/components/ui";
import { MapPanel } from "@/components/explore/map-panel";

type Venue = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  totalReviews: number;
  priceLevel: number | null;
  isOpenNow: boolean | null;
  photoUrl: string | null;
  crowdLabel: string;
  buzzScore: number;
  distanceMeters?: number;
};

const defaultLocation = { lat: 40.7128, lng: -74.006 };

export function ExploreClient() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState(defaultLocation);
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(4);
  const [type, setType] = useState("");
  const [distance, setDistance] = useState(4000);
  const [priceLevels, setPriceLevels] = useState<number[]>([]);

  const query = useMemo(() => {
    const params = new URLSearchParams({ lat: String(position.lat), lng: String(position.lng), radius: String(distance), minRating: String(minRating) });
    if (openNow) params.set("openNow", "true");
    if (type) params.set("type", type);
    if (priceLevels.length) params.set("priceLevels", priceLevels.join(","));
    return params.toString();
  }, [distance, minRating, openNow, position.lat, position.lng, priceLevels, type]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (geo) => setPosition({ lat: geo.coords.latitude, lng: geo.coords.longitude }),
      () => setPosition(defaultLocation),
      { timeout: 4500 }
    );
  }, []);

  useEffect(() => {
    const id = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/venues?${query}`);
        if (!response.ok) throw new Error("Failed to load venues");
        const payload = await response.json();
        setVenues(payload.data ?? []);
      } catch (fetchError) {
        setError(String(fetchError));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(id);
  }, [query]);

  const filterButton = "rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15";

  return (
    <section className="space-y-4">
      <div className="glass rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tonight near you</h1>
            <p className="text-sm text-zinc-300">Swipe through the best live spots with real-time momentum.</p>
          </div>
          <Badge className="gap-1"><SlidersHorizontal size={12} />Filters</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={filterButton} onClick={() => setOpenNow((value) => !value)}>Open now</button>
          <button className={filterButton} onClick={() => setType(type === "night_club" ? "" : "night_club")}>Club</button>
          <button className={filterButton} onClick={() => setType(type === "bar" ? "" : "bar")}>Bar</button>
          <button className={filterButton} onClick={() => setPriceLevels(priceLevels.length ? [] : [2, 3, 4])}>$$+</button>
          <button className={filterButton} onClick={() => setDistance((prev) => (prev === 4000 ? 3000 : 5000))}>{distance / 1000}km</button>
          <button className={filterButton} onClick={() => setMinRating((prev) => (prev === 4 ? 3.5 : 4))}>Rating {minRating}+</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="h-[72vh] space-y-3 overflow-y-auto p-3">
          {loading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/10" />)}
          {!loading && error && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {!loading && !error && !venues.length && <p className="rounded-2xl bg-white/5 p-3 text-sm text-zinc-300">No spots match these filters right now. Try widening distance or rating.</p>}
          {!loading && venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </Card>

        <MapPanel center={position} venues={venues} />
      </div>
    </section>
  );
}
