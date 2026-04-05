import { Card } from "@/components/ui";

export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">profile</h1>
      <Card>
        <p className="text-zinc-300">This section is connected for production extension (auth, saved venues, moderation, and analytics).</p>
        <p className="text-zinc-300">profile MVP screen with core controls and metrics for NightPulse.</p>
      </Card>
    </section>
  );
}
