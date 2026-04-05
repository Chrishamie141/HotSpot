import Link from "next/link";
import { Card } from "@/components/ui";

export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">profile</h1>
      <Card className="space-y-4 p-5">
        <p className="text-zinc-300">
          This section is connected for production extension (auth, saved venues,
          moderation, and analytics).
        </p>
        <p className="text-zinc-300">
          Profile MVP with account controls and nightlife preferences.
        </p>
        <Link
          href="/onboarding?reset=1"
          className="inline-flex rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20"
        >
          Re-open onboarding
        </Link>
      </Card>
    </section>
  );
}
