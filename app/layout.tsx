import "./globals.css";
import type { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "NightPulse",
  description: "Find out what's actually busy right now."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-4 pb-24">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
