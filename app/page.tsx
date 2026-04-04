import Link from "next/link";
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
