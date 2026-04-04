import { Card } from "@/components/ui";

export default function LivePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">live</h1>
      <Card>
        <p className="text-zinc-300">This section is connected for production extension (auth, saved venues, moderation, and analytics).</p>
      </Card>
    </section>
  );
}
