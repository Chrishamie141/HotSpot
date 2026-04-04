import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { getPlaceDetails } from "@/lib/services/googlePlaces";
import { enrichVenueDetail } from "@/lib/services/venueEnrichment";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const details = await getPlaceDetails(id);
    const venue = await enrichVenueDetail(id, details);

    const gallery = [venue.photoUrl, ...venue.photos.map((photo) => photo.imageUrl)].filter(Boolean) as string[];

    return (
      <section className="space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge>{venue.crowdLabel}</Badge>
            <Badge className="bg-cyan-500/20">Buzz {venue.buzzScore}</Badge>
            <Badge className="bg-zinc-700/60">{venue.isOpenNow ? "Open now" : "Closed"}</Badge>
            <Badge className="bg-rose-500/20">Line: {venue.lineEstimate}</Badge>
          </div>
          <p className="text-sm text-zinc-300">{venue.address}</p>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          {gallery.slice(0, 3).map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${image}-${index}`} src={image} alt={venue.name} className="h-52 w-full rounded-2xl object-cover" />
          ))}
        </div>

        <Card className="grid gap-4 md:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="text-sm text-zinc-300">Rating: {venue.rating?.toFixed(1) ?? "—"} ({venue.totalReviews} reviews)</p>
            <p className="text-sm text-zinc-300">Price: {venue.priceLevel ? "$".repeat(venue.priceLevel) : "—"}</p>
            <p className="text-sm text-zinc-300">Open status: {venue.isOpenNow ? "Open now" : "Closed"}</p>
            <div className="flex gap-2">
              {venue.mapsUrl && <Link href={venue.mapsUrl} className="rounded-lg bg-night-glow px-3 py-2 text-xs font-semibold">Directions</Link>}
              {venue.website && <Link href={venue.website} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs">Website</Link>}
            </div>
          </section>

          <iframe
            className="h-60 w-full rounded-2xl border border-zinc-800"
            loading="lazy"
            src={`https://www.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`}
            title="Venue map preview"
          />
        </Card>

        <Card className="space-y-2">
          <h2 className="text-xl font-semibold">Live Activity</h2>
          <p className="text-sm text-zinc-300">Compared to usual: {venue.comparedToUsual}</p>
          <p className="text-sm text-zinc-300">Confidence: {venue.confidence}</p>
          <p className="text-sm text-zinc-300">Live reports in window: {venue.liveReportsCount}</p>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-xl font-semibold">Dress Code</h2>
          <p className="text-sm text-zinc-300">{venue.dressCode ?? "No verified dress code yet."}</p>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-xl font-semibold">Cover Info</h2>
          <p className="text-sm text-zinc-300">{venue.coverTonight ? `$${venue.coverTonight} tonight` : "No verified cover info yet."}</p>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-xl font-semibold">Live Reports</h2>
          {!venue.liveReports.length && <p className="text-sm text-zinc-300">Not enough live data yet — be the first to report.</p>}
          {venue.liveReports.map((report) => (
            <p key={report.id} className="text-sm text-zinc-300">
              {report.crowdLabel} · {report.lineStatus} line · {report.vibeNotes ?? "No note"}
            </p>
          ))}
        </Card>
      </section>
    );
  } catch {
    return notFound();
  }
}
