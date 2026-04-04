import { VenueCard } from "@/components/venue-card";
import { Card, Badge } from "@/components/ui";
import { getExploreVenues } from "@/lib/venues";

export default async function ExplorePage() {
  const venues = await getExploreVenues();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Hot near me</h1>
        <div className="flex gap-2 text-xs">
          <Badge>Map View</Badge>
          <Badge>List View</Badge>
          <Badge>Trending neighborhoods</Badge>
        </div>
      </div>
      <Card>
        <p className="text-sm text-zinc-300">Filters: club/bar/lounge/rooftop, vibe, open now, no cover, upscale, distance, hottest now.</p>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
}
