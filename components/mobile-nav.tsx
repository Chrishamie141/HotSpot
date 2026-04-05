import Link from "next/link";

const nav = [
  ["Explore", "/explore"],
  ["Live", "/live"],
  ["Saved", "/favorites"],
  ["Favorites", "/favorites"],
  ["Profile", "/profile"]
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-20px)] max-w-md -translate-x-1/2 rounded-2xl border border-white/15 bg-[#111827]/85 p-2 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-xl px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/10">
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-night-bg/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm text-zinc-300">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
