import Link from "next/link";

const nav = [
  ["Explore", "/explore"],
  ["Live", "/live"],
  ["Favorites", "/favorites"],
  ["Profile", "/profile"]
];

export function MobileNav() {
  return (
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
