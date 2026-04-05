import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_30%)]" />
      <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -right-16 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-16">
        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-fuchsia-500/30 bg-white/5 px-4 py-2 text-sm font-medium text-fuchsia-200 backdrop-blur">
          NightPulse
        </div>

        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Find what&apos;s lit near you
            <span className="block bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              before you leave the house.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Discover real nightlife spots, see what&apos;s busy right now, and check
            the vibe before you go. NightPulse helps you find bars, lounges,
            rooftops, and clubs worth stepping out for.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.45)]"
          >
            Explore hot spots
          </Link>

          <Link
            href="/live"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            View live activity
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-fuchsia-300/80">
              Real places
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Real bars, clubs, and lounges
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              No fake venues. Pull in actual nightlife locations so users can
              browse places that really exist.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/80">
              Live vibe
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              See what&apos;s active right now
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Surface busy spots, crowd energy, and venue momentum so people
              know whether it&apos;s worth going.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300/80">
              Decision ready
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Check the details fast
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Dress code, cover, ratings, and map access in one clean interface
              built for people about to go out.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}