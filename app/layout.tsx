import type { Metadata } from "next";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import "./globals.css";

export const metadata: Metadata = {
  title: "NightPulse",
  description: "Find out what's actually busy right now near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <OnboardingGuard />
        {children}
      </body>
    </html>
  );
}
