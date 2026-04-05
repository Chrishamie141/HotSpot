import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" locationLabel="Newark, NJ">
      <section className="space-y-4">
        <Card className="space-y-4 p-5">
          <h2 className="text-xl font-semibold">Account & nightlife preferences</h2>
          <p className="text-sm text-zinc-300">Manage your profile, saved areas, and vibe preferences to personalize your explore feed.</p>
          <Link
            href="/onboarding?reset=1"
            className="inline-flex rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20"
          >
            Re-open onboarding
          </Link>
        </Card>
      </section>
    </AppShell>
  );
}
