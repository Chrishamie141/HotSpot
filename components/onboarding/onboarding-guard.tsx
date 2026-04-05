"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { shouldShowOnboarding } from "@/lib/onboarding";

const EXEMPT_ROUTES = ["/onboarding", "/api", "/_next", "/favicon.ico"];

export function OnboardingGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const exempt = EXEMPT_ROUTES.some((prefix) => pathname.startsWith(prefix));
    if (exempt) return;

    if (shouldShowOnboarding()) {
      router.replace("/onboarding");
    }
  }, [pathname, router]);

  return null;
}
