"use client";

import { ExploreVenue, RegionKey } from "@/lib/explore/types";
import { VenueCard } from "@/components/venue-card";
import { Card } from "@/components/ui";
import { EmptyResultsState } from "@/components/explore/empty-results-state";

type VenueListPanelProps = {
  venues: ExploreVenue[];
  loading: boolean;
  error: string | null;
  region: RegionKey;
  distanceMiles: number;
  openNowOnly: boolean;
  emptyReason?: string;
  selectedVenueId: string | null;
  onVenueHover: (venueId: string | null) => void;
  onSetDistance: (miles: 25 | 50) => void;
  onDisableOpenNow: () => void;
  onSetRegion: (region: RegionKey) => void;
};

export function VenueListPanel({ venues, loading, error, region, distanceMiles, openNowOnly, emptyReason, selectedVenueId, onVenueHover, onSetDistance, onDisableOpenNow, onSetRegion }: VenueListPanelProps) {
  return (
    <Card className="h-[72vh] space-y-3 overflow-y-auto p-3">
      {loading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/10" />)}
      {!loading && error && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {!loading && !error && !venues.length && (
        <EmptyResultsState
          region={region}
          distanceMiles={distanceMiles}
          openNowOnly={openNowOnly}
          reason={emptyReason}
          onSetDistance={onSetDistance}
          onDisableOpenNow={onDisableOpenNow}
          onSetRegion={onSetRegion}
        />
      )}
      {!loading && venues.map((venue) => (
        <div
          key={venue.id}
          onMouseEnter={() => onVenueHover(venue.id)}
          onMouseLeave={() => onVenueHover(null)}
          className={selectedVenueId === venue.id ? "rounded-3xl ring-1 ring-cyan-300/70" : ""}
        >
          <VenueCard venue={venue} />
        </div>
      ))}
    </Card>
  );
}
