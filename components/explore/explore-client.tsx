"use client";

import { useEffect, useMemo, useState } from "react";
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

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-fuchsia-500/20">NightPulse</Badge>
        <button className="rounded-full border border-zinc-700 px-3 py-1 text-xs" onClick={() => setOpenNow((value) => !value)}>Open now</button>
        <button className="rounded-full border border-zinc-700 px-3 py-1 text-xs" onClick={() => setType(type === "night_club" ? "" : "night_club")}>Clubs</button>
        <button className="rounded-full border border-zinc-700 px-3 py-1 text-xs" onClick={() => setType(type === "bar" ? "" : "bar")}>Bars</button>
        <button className="rounded-full border border-zinc-700 px-3 py-1 text-xs" onClick={() => setPriceLevels(priceLevels.length ? [] : [2, 3, 4])}>$$+</button>
        <button className="rounded-full border border-zinc-700 px-3 py-1 text-xs" onClick={() => setDistance((prev) => (prev === 4000 ? 3000 : 4000))}>{distance / 1000}km</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="h-[70vh] space-y-3 overflow-y-auto">
          {loading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-800/70" />)}
          {!loading && error && <p className="text-sm text-red-300">{error}</p>}
          {!loading && !error && !venues.length && <p className="text-sm text-zinc-300">No nightlife spots match these filters right now.</p>}
          {!loading && venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </Card>
        <MapPanel center={position} venues={venues} />
      </div>
    </section>
  );
}
