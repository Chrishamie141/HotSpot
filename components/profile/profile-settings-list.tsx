import { ChevronRight } from "lucide-react";

export function ProfileSettingsList({ items }: { items: string[] }) {
  return (
    <section className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-3">
      <p className="px-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Settings</p>
      {items.map((item) => (
        <button
          type="button"
          key={item}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:bg-black/35"
        >
          {item}
          <ChevronRight size={14} className="text-zinc-500" />
        </button>
      ))}
    </section>
  );
}
