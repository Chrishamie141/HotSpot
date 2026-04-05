import { Card, Badge } from "@/components/ui";
import { VenueCard } from "@/components/venue-card";
import { getExploreVenues } from "@/lib/venues";

export default async function ExplorePage() {
  const venues = await getExploreVenues();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300/80">
              NightPulse
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Hot near you
            </h1>
            <p className="mt-3 max-w-2xl text-white/65">
              Discover real nightlife spots, see what is active, and decide
              where to go before you head out.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge>Map View</Badge>
            <Badge>List View</Badge>
            <Badge>Trending neighborhoods</Badge>
          </div>
        </div>

        <Card className="mb-8 p-4">
          <p className="text-sm text-white/70">
            Filters: club/bar/lounge/rooftop, vibe, open now, no cover, upscale,
            distance, hottest now.
          </p>
        </Card>

        {venues.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold">Nothing nearby yet</h2>
            <p className="mt-2 text-white/60">Try another area.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}