import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function FavoritesPage() {
  return (
    <AppShell title="Favorites" locationLabel="Newark, NJ">
      <section className="space-y-4">
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Your saved spots</h2>
          <p className="mt-2 text-sm text-zinc-300">Pin your must-visit venues, monitor their buzz, and jump back to them quickly before heading out.</p>
        </Card>
      </section>
    </AppShell>
  );
}
