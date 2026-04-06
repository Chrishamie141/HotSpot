import { Suspense } from "react";
import { Badge } from "@/components/ui";
import { ExploreWelcome } from "@/components/explore/explore-welcome";
import { ExploreClient } from "@/components/explore/explore-client";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300/80">NightPulse</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Hot near you</h1>
            <p className="mt-3 max-w-2xl text-white/65">
              Discover real nightlife spots across Central Jersey with live map, active filters, and regional targeting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge>Functional Map/List</Badge>
            <Badge>Region-aware Discovery</Badge>
            <Badge>Live Central Jersey Filters</Badge>
          </div>
        </div>

        <div className="mb-5">
          <Suspense fallback={null}>
            <ExploreWelcome />
          </Suspense>
        </div>

        <ExploreClient />
      </div>
    </main>
  );
}
