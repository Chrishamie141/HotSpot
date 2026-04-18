"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";

type SaveVenuePayload = {
  id: string;
  name: string;
  address: string;
  type: "restaurant" | "bar" | "club" | "lounge" | "other";
  rating: number | null;
  photoUrl?: string | null;
  lat?: number;
  lng?: number;
};

export function VenueSaveShareActions({ venue }: { venue: SaveVenuePayload }) {
  const [saved, setSaved] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/favorites/check?venueId=${encodeURIComponent(venue.id)}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const json = await response.json();
      setSaved(Boolean(json.saved));
    };

    load();
  }, [venue.id]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/venue/${venue.id}`;
  }, [venue.id]);

  async function handleSave() {
    const response = await fetch("/api/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId: venue.id,
        name: venue.name,
        address: venue.address,
        type: venue.type,
        rating: venue.rating,
        photoUrl: venue.photoUrl,
        lat: venue.lat,
        lng: venue.lng,
      }),
    });

    if (!response.ok) return;

    const json = await response.json();
    setSaved(Boolean(json.saved));
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${venue.name} on NightPulse`, text: `Check out ${venue.name}`, url: shareUrl });
      } else if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Link copied");
        window.setTimeout(() => setShareMessage(""), 1800);
      }
    } catch {
      setShareMessage("Unable to share right now");
      window.setTimeout(() => setShareMessage(""), 1800);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${saved ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100" : "border-white/15 bg-white/5 text-zinc-100"}`}
      >
        <Heart size={14} className={saved ? "fill-current" : ""} />
        {saved ? "Saved" : "Save"}
      </button>

      <button type="button" onClick={handleShare} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100">
        <Share2 size={14} /> Share
      </button>

      {shareMessage ? <p className="text-xs text-cyan-200">{shareMessage}</p> : null}
    </div>
  );
}
