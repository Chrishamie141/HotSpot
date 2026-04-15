import { AppShell } from "@/components/app-shell";
import { LiveDashboard } from "@/components/live/live-dashboard";
import { FALLBACK_REGION_KEY } from "@/lib/explore/regions";
import { getExploreVenues } from "@/lib/venues";

export default async function LivePage() {
  const initialVenues = await getExploreVenues({
    region: FALLBACK_REGION_KEY,
    distanceMiles: 10,
    openNowOnly: true,
  });

  return (
    <AppShell title="Live" locationLabel="Central Jersey">
      <LiveDashboard initialRegion={FALLBACK_REGION_KEY} initialVenues={initialVenues} />
    </AppShell>
  );
}
