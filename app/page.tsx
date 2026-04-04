import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#130625] via-[#0d1022] to-[#041523] px-6 py-20 md:px-12">
      <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">Find what&apos;s lit near you right now.</h1>
        <p className="text-base text-zinc-200 md:text-lg">
          NightPulse combines live nightlife signals, recent reports, and trend intelligence so you can pick the right spot before you leave.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/explore" className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-100">
            Explore now
          </Link>
        </div>
      </div>
    </section>
  );
}
