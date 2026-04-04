import { Card } from "@/components/ui";

export default function FavoritesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">favorites</h1>
      <Card>
        <p className="text-zinc-300">This section is connected for production extension (auth, saved venues, moderation, and analytics).</p>
      </Card>
    </section>
  );
}
