import Link from "next/link";
import { Flame, Radio, Sparkles, ArrowUpRight, MapPin, CalendarDays } from "lucide-react";
import type { ExploreVenue } from "@/lib/venues";

function priceText(level: number | null) {
  if (!level) return "—";
  return "$".repeat(level);
}

export function SectionHeader({ title, subtitle, href, ctaLabel = "View all" }: { title: string; subtitle?: string; href?: string; ctaLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm text-fuchsia-200 transition hover:text-fuchsia-100">
          {ctaLabel}
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}

export function GreetingBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-fuchsia-400/25 bg-gradient-to-r from-[#271138] via-[#171a34] to-[#082332] p-5 shadow-[0_0_35px_rgba(168,85,247,0.22)] md:p-7">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
      <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/80">Tonight in your city</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">Good evening, Chris</h2>
      <p className="mt-2 max-w-2xl text-sm text-zinc-200/90 md:text-base">Find what&apos;s lit near you tonight, track live energy, and pick the spot that matches your vibe.</p>
    </section>
  );
}

export function QuickActionRow() {
  const actions = [
    { label: "Explore nearby", icon: MapPin, href: "/explore" },
    { label: "Live activity", icon: Radio, href: "/live" },
    { label: "Trending now", icon: Flame, href: "/explore#trending" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="group inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 transition hover:border-fuchsia-300/35 hover:bg-fuchsia-500/10"
          >
            <span className="inline-flex items-center gap-2">
              <span className="rounded-lg bg-white/10 p-1.5 text-fuchsia-200 group-hover:bg-fuchsia-500/30">
                <Icon size={14} />
              </span>
              {action.label}
            </span>
            <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-fuchsia-100" />
          </Link>
        );
      })}
    </section>
  );
}

export function VenueFeedSection({ title, subtitle, venues }: { title: string; subtitle?: string; venues: ExploreVenue[] }) {
  return (
    <section id={title.toLowerCase().replaceAll(" ", "-")}>
      <SectionHeader title={title} subtitle={subtitle} href="/explore" />
      <div className="grid gap-4 lg:grid-cols-2">
        {venues.map((venue) => (
          <Link
            key={`${title}-${venue.id}`}
            href={`/venue/${venue.id}`}
            className="group rounded-3xl border border-white/10 bg-[#0b1220]/80 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/40 hover:shadow-[0_14px_30px_rgba(34,211,238,0.12)]"
          >
            <div className="grid grid-cols-[110px_1fr] gap-4 md:grid-cols-[130px_1fr]">
              <div className="h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500/25 via-violet-500/20 to-cyan-400/25">
                {venue.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={venue.photoUrl} alt={venue.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-lg font-semibold">{venue.name}</h3>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">Buzz {venue.buzzScore}</span>
                </div>
                <p className="line-clamp-1 text-xs text-zinc-400">{venue.address}</p>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                  <span className="rounded-full bg-white/5 px-2 py-1">⭐ {venue.rating?.toFixed(1) ?? "—"}</span>
                  <span className="rounded-full bg-white/5 px-2 py-1">{venue.isOpenNow ? "Open now" : "Check hours"}</span>
                  <span className="rounded-full bg-white/5 px-2 py-1">{venue.distanceMeters ? `${(venue.distanceMeters / 1000).toFixed(1)} km` : "Nearby"}</span>
                  <span className="rounded-full bg-white/5 px-2 py-1">{priceText(venue.priceLevel)}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-fuchsia-100/90">
                  <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5">{venue.crowdLabel}</span>
                  <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5">Late-night</span>
                  <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5">Social</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EventFeedSection({ venues }: { venues: ExploreVenue[] }) {
  return (
    <section id="events">
      <SectionHeader title="Upcoming events" subtitle="Bookmarked events and curated highlights for this week." href="/explore#events" ctaLabel="See calendar" />
      <div className="grid gap-3 md:grid-cols-3">
        {venues.map((venue, index) => (
          <article key={`${venue.id}-event`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/30 hover:bg-cyan-500/5">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">{index % 2 === 0 ? "Friday" : "Saturday"}</p>
            <h3 className="mt-2 text-base font-semibold">{index % 2 === 0 ? "After Hours Session" : "Rooftop Pulse"}</h3>
            <p className="mt-1 text-sm text-zinc-400">at {venue.name}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-300">
              <CalendarDays size={13} /> 10:00 PM · RSVP open
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NeighborhoodSection() {
  const neighborhoods = ["Downtown", "Riverfront", "Arts District", "Ironbound"];

  return (
    <section>
      <SectionHeader title="Popular neighborhoods" subtitle="Browse where nightlife is peaking right now." href="/explore" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {neighborhoods.map((name, index) => (
          <article key={name} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 transition hover:border-fuchsia-400/30 hover:shadow-[0_12px_30px_rgba(217,70,239,0.15)]">
            <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-zinc-400">
              <Sparkles size={12} /> Zone {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{name}</h3>
            <p className="mt-2 text-sm text-zinc-400">High-energy lounges, standout bars, and late-night crowd momentum.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
