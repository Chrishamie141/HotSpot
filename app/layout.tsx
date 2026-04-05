import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "NightPulse",
  description: "Find what is lit near you right now."
  description: "Find out what's actually busy right now."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">NightPulse</Link>
            <Link href="/explore" className="rounded-full bg-white/10 px-3 py-1.5 text-xs">Explore</Link>
          </div>
        </header>
        <main className="mx-auto min-h-screen max-w-6xl p-4 pb-24">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
