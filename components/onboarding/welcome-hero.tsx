type WelcomeHeroProps = {
  onStart: () => void;
  onSkip: () => void;
};

export function WelcomeHero({ onStart, onSkip }: WelcomeHeroProps) {
  return (
    <div className="space-y-8">
      <div className="inline-flex items-center rounded-full border border-fuchsia-400/35 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-100">
        NightPulse
      </div>

      <div>
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          Find out what&apos;s lit near you tonight.
        </h1>
        <p className="mt-4 text-base leading-7 text-white/75">
          Discover hot bars, clubs, lounges, and rooftops with real crowd
          energy so you walk into the right vibe every time.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/70 sm:text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Live vibe</div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Real spots</div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Go out smarter</div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onStart}
          className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-4 py-3 text-base font-semibold shadow-[0_0_30px_rgba(217,70,239,0.35)] transition hover:scale-[1.01]"
        >
          Get Started
        </button>
        <button
          onClick={onSkip}
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
