import Image from "next/image";

export function ProfileHighlights({
  highlights,
  selectedId,
  onSelect,
}: {
  highlights: { id: string; title: string; coverUrl: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Night highlights</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {highlights.map((highlight) => (
          <button key={highlight.id} type="button" onClick={() => onSelect(highlight.id)} className="min-w-[72px] max-w-[80px] space-y-1">
            <Image
              src={highlight.coverUrl}
              alt={highlight.title}
              width={64}
              height={64}
              className={`mx-auto h-16 w-16 rounded-full border object-cover ${selectedId === highlight.id ? "border-fuchsia-300" : "border-white/20"}`}
            />
            <p className="truncate text-xs text-zinc-300">{highlight.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
