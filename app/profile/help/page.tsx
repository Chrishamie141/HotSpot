import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function ProfileHelpPage() {
  return (
    <AppShell title="Help & support" locationLabel="Central Jersey">
      <section className="space-y-4">
        <Card className="rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Need help with NightPulse?</h2>
          <p className="mt-2 text-sm text-zinc-300">For login/account issues, verify your email or username and password, then try again.</p>
          <p className="mt-2 text-sm text-zinc-300">Support contact (placeholder): support@nightpulse.app</p>
          <p className="mt-2 text-sm text-zinc-300">Response time: within 24 hours.</p>
        </Card>
      </section>
    </AppShell>
  );
}
