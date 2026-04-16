"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { SavedVenue, isVenueSaved, toggleFavoriteVenue } from "@/lib/favorites";

export function VenueSaveShareActions({ venue }: { venue: SavedVenue }) {
  const [saved, setSaved] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    setSaved(isVenueSaved(venue.id));
  }, [venue.id]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/venue/${venue.id}`;
  }, [venue.id]);

  function handleSave() {
    const next = toggleFavoriteVenue(venue);
    setSaved(next.some((item) => item.id === venue.id));
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${venue.name} on NightPulse`,
          text: `Check out ${venue.name}`,
          url: shareUrl,
        });
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
        className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
          saved
            ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
            : "border-white/15 bg-white/5 text-zinc-100"
        }`}
      >
        <Heart size={14} className={saved ? "fill-current" : ""} />
        {saved ? "Saved" : "Save"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100"
      >
        <Share2 size={14} /> Share
      </button>

      {shareMessage ? <p className="text-xs text-cyan-200">{shareMessage}</p> : null}
    </div>
  );
}
