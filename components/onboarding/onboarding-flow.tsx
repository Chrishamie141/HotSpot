"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LocationPermissionStep } from "@/components/onboarding/location-permission-step";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import {
  AgeStep,
  InterestsStep,
  LocationStep,
  NameStep,
  PhotoUploadStep,
} from "@/components/onboarding/steps";
import { WalkthroughSlides } from "@/components/onboarding/walkthrough-slides";
import { WelcomeHero } from "@/components/onboarding/welcome-hero";
import {
  defaultOnboardingData,
  DEFAULT_CITY,
  loadOnboardingState,
  OnboardingData,
  persistOnboardingState,
  TOTAL_ONBOARDING_STEPS,
} from "@/lib/onboarding";

const TITLES = [
  ["Welcome to NightPulse", "Your nightlife companion for smarter nights out."],
  ["What should we call you?", "Set up your profile in under a minute."],
  ["How old are you?", "We keep recommendations nightlife-relevant for your age."],
  ["Where do you usually go out?", "We will prioritize nearby nightlife zones."],
  ["Pick your vibe", "Choose interests so your feed feels personal from day one."],
  ["Add a profile photo", "Optional, but it makes your profile look complete."],
  ["How NightPulse works", "A quick walkthrough before we launch you in."],
  ["Enable location", "We can show nightlife spots around you instantly."],
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  useEffect(() => {
    const shouldReset = searchParams.get("reset") === "1";
    if (shouldReset) {
      setData(defaultOnboardingData);
      setHydrated(true);
      return;
    }

    const stored = loadOnboardingState();
    if (stored.onboardingComplete) {
      router.replace("/explore");
      return;
    }

    setData(stored);
    setHydrated(true);
  }, [router, searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    persistOnboardingState(data);
  }, [data, hydrated]);

  const step = data.currentStep;
  const [title, subtitle] = useMemo(() => TITLES[step] ?? TITLES[0], [step]);

  const next = () => {
    setData((current) => ({
      ...current,
      currentStep: Math.min(current.currentStep + 1, TOTAL_ONBOARDING_STEPS - 1),
    }));
  };

  const back = () => {
    setData((current) => ({ ...current, currentStep: Math.max(current.currentStep - 1, 0) }));
  };

  const finish = () => {
    const finalizedCity = data.city.trim() ? data.city : DEFAULT_CITY;
    const finalized = {
      ...data,
      city: finalizedCity,
      onboardingComplete: true,
      currentStep: TOTAL_ONBOARDING_STEPS - 1,
    };

    setData(finalized);
    persistOnboardingState(finalized);

    window.setTimeout(() => {
      router.replace("/explore?welcome=1");
    }, 550);
  };

  const onSkipAll = () => {
    const skipped = {
      ...defaultOnboardingData,
      city: DEFAULT_CITY,
      locationPermission: "skipped" as const,
      onboardingComplete: true,
      currentStep: TOTAL_ONBOARDING_STEPS - 1,
    };
    setData(skipped);
    persistOnboardingState(skipped);
    router.replace("/explore");
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 text-white/60">
          Loading onboarding...
        </div>
      </main>
    );
  }

  return (
    <OnboardingShell
      title={title}
      subtitle={subtitle}
      currentStep={step}
      totalSteps={TOTAL_ONBOARDING_STEPS}
    >
      {step === 0 ? (
        <WelcomeHero onStart={next} onSkip={onSkipAll} />
      ) : null}

      {step === 1 ? (
        <NameStep
          value={data.firstName}
          onChange={(value) => setData((current) => ({ ...current, firstName: value }))}
          onNext={next}
        />
      ) : null}

      {step === 2 ? (
        <AgeStep
          value={data.age}
          onChange={(value) => setData((current) => ({ ...current, age: value }))}
          onBack={back}
          onNext={next}
        />
      ) : null}

      {step === 3 ? (
        <LocationStep
          value={data.city}
          onChange={(value) => setData((current) => ({ ...current, city: value }))}
          onBack={back}
          onNext={next}
        />
      ) : null}

      {step === 4 ? (
        <InterestsStep
          value={data.interests}
          onChange={(value) => setData((current) => ({ ...current, interests: value }))}
          onBack={back}
          onNext={next}
        />
      ) : null}

      {step === 5 ? (
        <PhotoUploadStep
          value={data.photoUrl}
          onChange={(value) => setData((current) => ({ ...current, photoUrl: value }))}
          onBack={back}
          onNext={next}
        />
      ) : null}

      {step === 6 ? <WalkthroughSlides onBack={back} onNext={next} /> : null}

      {step === 7 ? (
        <LocationPermissionStep
          city={data.city}
          onCityChange={(value) => setData((current) => ({ ...current, city: value }))}
          onBack={back}
          onResolved={({ permission, coordinates }) => {
            setData((current) => ({
              ...current,
              locationPermission: permission,
              coordinates,
              city: current.city.trim() ? current.city : DEFAULT_CITY,
            }));
            finish();
          }}
        />
      ) : null}
    </OnboardingShell>
  );
}
