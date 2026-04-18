import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { FavoritesPageContent } from "@/components/venue/favorites-page-content";

export default function FavoritesPage() {
  return (
    <AppShell title="Favorites" locationLabel="Central Jersey">
      <section className="space-y-4">
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Your saved spots</h2>
          <p className="mt-2 text-sm text-zinc-300">Save and remove venues instantly, then revisit your shortlist before going out.</p>
        </Card>

        <FavoritesPageContent />
      </section>
    </AppShell>
  );
}
