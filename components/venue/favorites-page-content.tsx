"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";

type FavoriteVenue = {
  id: string;
  venueId: string;
  name: string;
  address: string;
  type: string;
};

export function FavoritesPageContent() {
  const [savedVenues, setSavedVenues] = useState<FavoriteVenue[]>([]);
  const [error, setError] = useState("");

  async function loadFavorites() {
    const response = await fetch("/api/favorites", { cache: "no-store" });

    if (!response.ok) {
      setSavedVenues([]);
      setError("Unable to load saved venues.");
      return;
    }

    setError("");
    const json = await response.json();
    setSavedVenues(Array.isArray(json.favorites) ? json.favorites : []);
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleRemove(venueId: string) {
    await fetch("/api/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueId, name: "remove" }),
    });

    loadFavorites();
  }

  if (error) {
    return <Card className="p-5 text-sm text-rose-200">{error}</Card>;
  }

  if (!savedVenues.length) {
    return <Card className="p-5 text-sm text-zinc-300">No saved places yet. Save venues from Explore, Live, or a venue page.</Card>;
  }

  return (
    <div className="grid gap-3">
      {savedVenues.map((venue) => (
        <Card key={venue.id} className="rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-zinc-100">{venue.name}</p>
              <p className="text-sm text-zinc-400">{venue.address}</p>
              <p className="mt-1 text-xs capitalize text-cyan-200">{venue.type}</p>
            </div>

            <button type="button" onClick={() => handleRemove(venue.venueId)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs">
              Remove
            </button>
          </div>

          <div className="mt-3">
            <Link href={`/venue/${venue.venueId}`} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">
              Open venue
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
