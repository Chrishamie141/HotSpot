"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  Compass,
  Heart,
  Newspaper,
  Radio,
  CalendarDays,
  User,
  Settings,
  Building2,
  Search,
  MapPin,
} from "lucide-react";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  locationLabel?: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof Compass;
};

const mainNav: NavItem[] = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Live", href: "/live", icon: Radio },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Events", href: "/explore#events", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
];

const utilityNav: NavItem[] = [
  { label: "Settings", href: "/profile", icon: Settings },
  { label: "Owner dashboard", href: "/owner", icon: Building2 },
];

function matchRoute(pathname: string, href: string) {
  if (href.includes("#")) return pathname === href.split("#")[0];
  if (href === "/explore") return pathname === "/" || pathname.startsWith("/explore");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition duration-300 ${
        active
          ? "border-fuchsia-300/40 bg-gradient-to-r from-fuchsia-500/20 via-violet-500/10 to-cyan-500/15 text-white shadow-[0_0_22px_rgba(217,70,239,0.24)]"
          : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`rounded-xl p-1.5 ${
          active ? "bg-white/15" : "bg-white/5 group-hover:bg-white/10"
        }`}
      >
        <Icon size={15} />
      </span>
      {item.label}
    </Link>
  );
}

function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#090d18]/90 px-5 py-6 backdrop-blur md:sticky md:top-0 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-[0_0_24px_rgba(34,211,238,0.35)]">
          NP
        </div>
        <div>
          <p className="text-base font-semibold">NightPulse</p>
          <p className="text-xs text-zinc-400">City nightlife radar</p>
        </div>
      </div>

      <nav className="space-y-2">
        {mainNav.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            active={matchRoute(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
        {utilityNav.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={matchRoute(pathname, item.href)}
          />
        ))}
      </div>
    </aside>
  );
}

function TopBar({
  title = "Explore",
  locationLabel = "Newark, NJ",
}: {
  title?: string;
  locationLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b16]/85 px-3 py-3 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold md:text-2xl">{title}</h1>
        </div>

        <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 lg:flex">
          <Search size={15} />
          <input
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            placeholder="Search venues, neighborhoods, events"
            aria-label="Search"
          />
        </div>

        <span className="hidden items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100 md:inline-flex">
          <MapPin size={12} /> {locationLabel}
        </span>

        <button
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 transition hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-zinc-100 transition hover:bg-white/10"
          aria-label="Profile menu"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold">
            C
          </span>
          <span className="hidden pr-1 text-xs md:inline">Chris</span>
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-[#0a0f1c]/95 backdrop-blur md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-2 py-2">
        {mainNav
          .filter((item) => item.label !== "Events")
          .map((item) => {
            const Icon = item.icon;
            const active = matchRoute(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex min-w-0 flex-col items-center rounded-xl px-2 py-1 text-[11px] ${
                  active ? "text-fuchsia-200" : "text-zinc-400"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  title = "Explore",
  locationLabel,
}: AppShellProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#05070f] text-white">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0">
        <SidebarNav />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
          <TopBar title={title} locationLabel={locationLabel} />
          <main className="flex-1 min-w-0 overflow-x-hidden px-3 pb-24 pt-5 md:px-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}