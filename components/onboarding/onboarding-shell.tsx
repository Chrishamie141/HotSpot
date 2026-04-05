import { ReactNode } from "react";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";

type OnboardingShellProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
};

export function OnboardingShell({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
}: OnboardingShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.16),_transparent_45%)]" />
      <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-fuchsia-500/35 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-500/35 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-xl flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_80px_rgba(6,8,20,0.65)] backdrop-blur-xl sm:p-8">
        <div className="space-y-5">
          <OnboardingProgress current={currentStep + 1} total={totalSteps} />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">{subtitle}</p>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
