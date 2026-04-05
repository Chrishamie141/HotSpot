import { ChangeEvent } from "react";
import { NIGHTLIFE_INTERESTS } from "@/lib/onboarding";

type BaseStepActions = {
  onNext: () => void;
  onBack?: () => void;
  canContinue?: boolean;
  nextLabel?: string;
};

function StepActions({
  onNext,
  onBack,
  canContinue = true,
  nextLabel = "Continue",
}: BaseStepActions) {
  return (
    <div className="mt-6 flex gap-3">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium"
        >
          Back
        </button>
      ) : null}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}

type NameStepProps = {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
};

export function NameStep({ value, onChange, onNext }: NameStepProps) {
  return (
    <div>
      <label className="text-sm text-white/70">First name</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Jordan"
        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base outline-none ring-fuchsia-300/60 transition focus:ring"
      />
      <StepActions onNext={onNext} canContinue={value.trim().length > 1} />
    </div>
  );
}

type AgeStepProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  onNext: () => void;
  onBack: () => void;
};

export function AgeStep({ value, onChange, onNext, onBack }: AgeStepProps) {
  return (
    <div>
      <label className="text-sm text-white/70">Age</label>
      <input
        type="number"
        min={18}
        max={99}
        value={value ?? ""}
        onChange={(event) => {
          if (!event.target.value) {
            onChange(null);
            return;
          }
          const nextValue = Number(event.target.value);
          onChange(Number.isFinite(nextValue) ? nextValue : null);
        }}
        placeholder="24"
        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base outline-none ring-fuchsia-300/60 transition focus:ring"
      />
      <p className="mt-2 text-xs text-white/55">We use this to tune nightlife recommendations.</p>
      <StepActions onBack={onBack} onNext={onNext} canContinue={Boolean(value && value > 0)} />
    </div>
  );
}

type LocationStepProps = {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function LocationStep({ value, onChange, onNext, onBack }: LocationStepProps) {
  return (
    <div>
      <label className="text-sm text-white/70">City or area</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Brooklyn, NYC"
        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base outline-none ring-fuchsia-300/60 transition focus:ring"
      />
      <StepActions onBack={onBack} onNext={onNext} canContinue={value.trim().length > 1} />
    </div>
  );
}

type InterestsStepProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export function InterestsStep({ value, onChange, onNext, onBack }: InterestsStepProps) {
  const toggle = (interest: string) => {
    onChange(
      value.includes(interest)
        ? value.filter((entry) => entry !== interest)
        : [...value, interest]
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {NIGHTLIFE_INTERESTS.map((interest) => {
          const active = value.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                active
                  ? "border-fuchsia-300/70 bg-fuchsia-500/20 text-white"
                  : "border-white/15 bg-white/5 text-white/75"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onNext} canContinue={value.length > 0} />
    </div>
  );
}

type PhotoUploadStepProps = {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  onNext: () => void;
  onBack: () => void;
};

export function PhotoUploadStep({ value, onChange, onNext, onBack }: PhotoUploadStepProps) {
  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/55">No photo</div>
          )}
        </div>
        <div>
          <p className="text-sm text-white/80">Add a profile photo (optional)</p>
          <p className="text-xs text-white/55">Helps personalize your NightPulse profile.</p>
        </div>
      </div>
      <label className="block w-full cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/90">
        Upload from device
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </label>
      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue" />
    </div>
  );
}
