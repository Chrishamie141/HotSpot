import { AppShell } from "@/components/app-shell";
import { getExploreVenues } from "@/lib/venues";
import ExploreClient from "@/components/explore/explore-client";

export default async function ExplorePage() {
  const venues = await getExploreVenues({
    region: "new-brunswick",
    distanceMiles: 10,
    openNowOnly: true,
  });

  return (
    <AppShell title="Explore" locationLabel="Central Jersey">
      <ExploreClient initialVenues={venues} />
    </AppShell>
  );
}