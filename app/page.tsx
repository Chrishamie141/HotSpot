import Link from "next/link";
import { Badge } from "@/components/ui";

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1f1147] via-[#101a39] to-[#0d2238] px-6 py-20 md:px-12">
      <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -right-16 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-center">
        <Badge className="bg-white/20 text-white">Live nightlife intelligence</Badge>
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">Find what&apos;s lit near you right now.</h1>
        <p className="text-base text-zinc-200 md:text-lg">
          A clean, fast nightlife feed with live momentum, open status, and real-world context before you head out.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/explore" className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-100">
            Open NightPulse
          </Link>
        </div>
      </div>
import { Card, Badge } from "@/components/ui";

export default function LandingPage() {
  return (
    <section className="space-y-8 py-8">
      <Badge className="bg-night-accent/20">NightPulse MVP</Badge>
      <h1 className="text-4xl font-bold leading-tight">Know before you go: which spots are lit right now.</h1>
      <p className="max-w-2xl text-zinc-300">
        NightPulse estimates nightlife activity with multi-signal buzz scoring, live user reports, owner updates,
        and trend history.
      </p>
      <Card className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Core value proposition</h2>
          <p className="text-zinc-300">Dead, Slow, Active, Hot, or Packed with line and cover context in one tap.</p>
        </div>
        <Link href="/explore" className="rounded-xl bg-night-glow px-4 py-3 text-center font-semibold">
          Explore hot near me
        </Link>
      </Card>
    </section>
  );
}
