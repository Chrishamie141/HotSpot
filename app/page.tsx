import { AppShell } from "@/components/app-shell";
import {
  EventFeedSection,
  GreetingBanner,
  NeighborhoodSection,
  QuickActionRow,
  VenueFeedSection,
} from "@/components/discovery/explore-dashboard";
import { getExploreVenues } from "@/lib/venues";

export default async function HomePage() {
  const venues = await getExploreVenues();

  return (
    <AppShell title="Explore" locationLabel="Newark, NJ">
      <div className="space-y-6">
        <GreetingBanner />
        <QuickActionRow />
        <VenueFeedSection
          title="Trending near you"
          subtitle="Live momentum from nearby venues and social activity."
          venues={venues}
        />
        <VenueFeedSection
          title="Nearby venues"
          subtitle="Quick picks around your current location."
          venues={venues}
        />
        <NeighborhoodSection />
        <EventFeedSection venues={venues} />
      </div>
    </AppShell>
  );
}
