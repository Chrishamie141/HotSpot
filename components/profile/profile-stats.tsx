function prettyCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

export function ProfileStats({
  postCount,
  followers,
  following,
}: {
  postCount: number;
  followers: number;
  following: number;
}) {
  const items = [
    { label: "Posts", value: postCount.toString() },
    { label: "Followers", value: prettyCount(followers) },
    { label: "Following", value: prettyCount(following) },
  ];

  return (
    <section className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <p className="text-base font-semibold text-zinc-100">{item.value}</p>
          <p className="mt-1 text-xs text-zinc-400">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
