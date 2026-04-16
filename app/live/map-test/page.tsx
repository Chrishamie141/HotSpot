import { getExploreVenues } from "@/lib/venues";
import { FALLBACK_REGION_KEY } from "@/lib/explore/regions";
import { LiveMap } from "@/components/live/live-map";
import { transformLiveVenues } from "@/lib/live/transform-live-venues";

export default async function LiveMapTestPage() {
  const venues = await getExploreVenues({
    region: FALLBACK_REGION_KEY,
    distanceMiles: 10,
    openNowOnly: true,
  });

  const liveVenues = transformLiveVenues(venues);

  return (
    <main className="min-h-screen bg-black p-4 text-white sm:p-6">
      <div className="mx-auto max-w-5xl space-y-3">
        <h1 className="text-xl font-semibold">Live Map Isolated Render Test</h1>
        <p className="text-sm text-zinc-400">
          This route isolates the map from the AppShell to help verify whether blur comes from layout wrappers.
        </p>
        <LiveMap
          venues={liveVenues}
          selectedVenueId={liveVenues[0]?.id ?? null}
          onSelectVenue={() => {}}
          fallbackCenter={{ lat: 40.4862, lng: -74.4518 }}
        />
      </div>
    </main>
  );
}
