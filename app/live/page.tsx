import { Activity, Radio, Timer } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function LivePage() {
  return (
    <AppShell title="Live" locationLabel="Newark, NJ">
      <section className="space-y-4">
        <Card className="space-y-2 p-5">
          <h2 className="text-xl font-semibold">Live city pulse</h2>
          <p className="text-sm text-zinc-300">
            Track crowd movement, queue times, and social buzz updates as the night unfolds.
          </p>
        </Card>

        <div className="grid gap-3 md:grid-cols-3">
          <Card className="space-y-2 p-4">
            <p className="inline-flex items-center gap-2 text-fuchsia-200">
              <Activity size={14} /> Buzz Index
            </p>
            <p className="text-2xl font-semibold">82</p>
          </Card>
          <Card className="space-y-2 p-4">
            <p className="inline-flex items-center gap-2 text-cyan-200">
              <Radio size={14} /> Active venues
            </p>
            <p className="text-2xl font-semibold">24</p>
          </Card>
          <Card className="space-y-2 p-4">
            <p className="inline-flex items-center gap-2 text-violet-200">
              <Timer size={14} /> Avg line
            </p>
            <p className="text-2xl font-semibold">14 min</p>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
