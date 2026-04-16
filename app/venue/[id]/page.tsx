import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, Badge } from "@/components/ui";
import { getPlaceDetails } from "@/lib/services/googlePlaces";
import { enrichVenueDetail } from "@/lib/services/venueEnrichment";
import { classifyVenueType } from "@/lib/live/classifyVenueType";
import { VenueSaveShareActions } from "@/components/venue/venue-save-share-actions";

function toEstimatedActivity(score: number | null | undefined) {
  const safe = Number(score ?? 0);
  if (safe >= 75) return "High activity";
  if (safe >= 45) return "Moderate activity";
  return "Low activity";
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const details = await getPlaceDetails(id);

    let venue: any;

    try {
      venue = await enrichVenueDetail(id, details);
    } catch (error) {
      console.warn("[venue page] enrichment failed, using google fallback:", error);

      venue = {
        ...details,
        crowdLabel: "Moderate activity",
        buzzScore: 55,
        comparedToUsual: "Unknown",
        confidence: "Low",
        liveReportsCount: 0,
        liveReports: [],
        dressCode: null,
        coverTonight: null,
        photos: [],
      };
    }

    const gallery = [
      venue.photoUrl,
      ...(venue.photos?.map((photo: any) => photo.imageUrl) ?? []),
    ].filter(Boolean) as string[];

    const venueType = classifyVenueType({ name: venue.name, types: venue.types }).venueType;
    const estimatedActivity = toEstimatedActivity(venue.buzzScore);

    return (
      <AppShell title={venue.name} locationLabel="New Brunswick, NJ">
        <section className="space-y-5">
          <header className="glass rounded-3xl p-5">
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <p className="mt-1 text-sm text-zinc-300">{venue.address}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{venueType}</Badge>
              <Badge>{estimatedActivity}</Badge>
              <Badge className="bg-fuchsia-500/20">Buzz {venue.buzzScore ?? 0}</Badge>
              <Badge className="gap-1">
                <Star size={12} className="fill-orange-400 text-orange-400" />
                {venue.rating?.toFixed(1) ?? "—"}
              </Badge>
              <Badge className="gap-1">
                <Clock3 size={12} />
                {venue.isOpenNow === null || venue.isOpenNow === undefined
                  ? "Hours unavailable"
                  : venue.isOpenNow
                    ? "Open now"
                    : "Closed"}
              </Badge>
            </div>

            <div className="mt-4">
              <VenueSaveShareActions
                venue={{
                  id,
                  name: venue.name,
                  address: venue.address,
                  rating: venue.rating ?? null,
                  type: venueType,
                  photoUrl: venue.photoUrl,
                  lat: venue.lat,
                  lng: venue.lng,
                }}
              />
            </div>
          </header>

          {gallery.length > 0 && (
            <div className="grid gap-3 md:grid-cols-3">
              {gallery.slice(0, 3).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${venue.name} ${index + 1}`}
                  className="h-52 w-full rounded-3xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3 p-4">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="text-sm text-zinc-300">{venue.totalReviews ?? 0} reviews · {venue.priceLevel ? "$".repeat(venue.priceLevel) : "-"}</p>
              <p className="text-sm text-zinc-300">Estimated wait: {Math.max(8, Math.round((venue.buzzScore ?? 50) / 3))} min</p>
              <p className="inline-flex items-center gap-1 text-sm text-zinc-300">
                <MapPin size={14} />
                {venue.address}
              </p>

              <div className="flex gap-2">
                {venue.mapsUrl && (
                  <Link href={venue.mapsUrl} className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black">
                    Directions
                  </Link>
                )}

                {venue.website && (
                  <Link href={venue.website} className="rounded-xl border border-white/20 px-3 py-2 text-xs">
                    Website
                  </Link>
                )}
              </div>
            </Card>

            {typeof venue.lat === "number" && typeof venue.lng === "number" ? (
              <iframe
                className="glass h-64 w-full rounded-3xl"
                loading="lazy"
                src={`https://www.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`}
                title="Venue map preview"
              />
            ) : (
              <Card className="p-4 text-sm text-zinc-300">Map preview unavailable</Card>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">Live Activity</h2>
              <p className="text-sm text-zinc-300">Estimated activity: {estimatedActivity}</p>
              <p className="text-sm text-zinc-300">Compared to usual: {venue.comparedToUsual ?? "Unknown"}</p>
              <p className="text-sm text-zinc-300">Signal confidence: {venue.confidence ?? "Unknown"}</p>
              <p className="text-sm text-zinc-300">Live reports in window: {venue.liveReportsCount ?? 0}</p>
            </Card>

            <Card className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">About this venue</h2>
              <p className="text-sm text-zinc-300">{venue.shortDescription ?? "No description yet. Visit and share what the place feels like tonight."}</p>
              <p className="text-sm text-zinc-300">Dress code: {venue.dressCode ?? "No verified dress code yet."}</p>
              <p className="text-sm text-zinc-300">Cover: {venue.coverTonight ? `$${venue.coverTonight}` : "No verified cover info yet."}</p>
            </Card>
          </div>
        </section>
      </AppShell>
    );
  } catch (error) {
    console.error("[venue page] failed for id:", id, error);
    return notFound();
  }
}
