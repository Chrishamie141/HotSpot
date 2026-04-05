import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
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
      <AppShell title={venue.name} locationLabel="Newark, NJ">
        <section className="space-y-5">
          <header className="glass rounded-3xl p-5">
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <p className="mt-1 text-sm text-zinc-300">{venue.address}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{venue.crowdLabel}</Badge>
              <Badge className="bg-fuchsia-500/20">Buzz {venue.buzzScore}</Badge>
              <Badge className="gap-1"><Star size={12} className="fill-orange-400 text-orange-400" />{venue.rating?.toFixed(1) ?? "—"}</Badge>
              <Badge className="gap-1"><Clock3 size={12} />{venue.isOpenNow ? "Open now" : "Closed"}</Badge>
            </div>
          </header>

          <div className="grid gap-3 md:grid-cols-3">
            {gallery.slice(0, 3).map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${image}-${index}`} src={image} alt={venue.name} className="h-52 w-full rounded-3xl object-cover" />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3 p-4">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="text-sm text-zinc-300">{venue.totalReviews} reviews · {venue.priceLevel ? "$".repeat(venue.priceLevel) : "-"}</p>
              <p className="inline-flex items-center gap-1 text-sm text-zinc-300"><MapPin size={14} />{venue.address}</p>
              <div className="flex gap-2">
                {venue.mapsUrl && <Link href={venue.mapsUrl} className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black">Directions</Link>}
                {venue.website && <Link href={venue.website} className="rounded-xl border border-white/20 px-3 py-2 text-xs">Website</Link>}
              </div>
            </Card>

            <iframe className="glass h-64 w-full rounded-3xl" loading="lazy" src={`https://www.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`} title="Venue map preview" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">Live Activity</h2>
              <p className="text-sm text-zinc-300">Compared to usual: {venue.comparedToUsual}</p>
              <p className="text-sm text-zinc-300">Confidence: {venue.confidence}</p>
              <p className="text-sm text-zinc-300">Live reports in window: {venue.liveReportsCount}</p>
            </Card>

            <Card className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">Dress & Cover</h2>
              <p className="text-sm text-zinc-300">Dress code: {venue.dressCode ?? "No verified dress code yet."}</p>
              <p className="text-sm text-zinc-300">Cover: {venue.coverTonight ? `$${venue.coverTonight}` : "No verified cover info yet."}</p>
            </Card>
          </div>

          <Card className="space-y-2 p-4">
            <h2 className="text-lg font-semibold">Live Reports</h2>
            {!venue.liveReports.length && <p className="text-sm text-zinc-300">Not enough live data yet — be the first to report.</p>}
            {venue.liveReports.map((report) => (
              <p key={report.id} className="text-sm text-zinc-300">
                {report.crowdLabel} · {report.lineStatus} line · {report.vibeNotes ?? "No note"}
              </p>
            ))}
          </Card>
        </section>
      </AppShell>
    );
  } catch {
    return notFound();
  }
}
