import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function ProfileHelpPage() {
  return (
    <AppShell title="Help & support" locationLabel="Central Jersey">
      <section className="space-y-4">
        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Need help with NightPulse?</h2>
          <p className="mt-2 text-sm text-zinc-300">If you have account or app issues, we can help you get back to discovering nightlife quickly.</p>
        </Card>

        <Card className="rounded-3xl p-5">
          <h3 className="text-base font-semibold">Quick FAQ</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-300">
            <li>• Login issue? Double-check your username/email and password.</li>
            <li>• Can&apos;t see updates? Refresh the page after saving profile/account settings.</li>
            <li>• Saved venue missing? Confirm you&apos;re logged into the same account.</li>
          </ul>
        </Card>

        <Card className="rounded-3xl p-5">
          <h3 className="text-base font-semibold">Contact support</h3>
          <p className="mt-2 text-sm text-zinc-300">Support email (placeholder): support@nightpulse.app</p>
          <p className="mt-1 text-sm text-zinc-300">When reporting an issue, include what page you were on and what action you tried.</p>
        </Card>
      </section>
    </AppShell>
  );
}
