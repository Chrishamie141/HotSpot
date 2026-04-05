"use client";

import { useMemo, useState } from "react";
import { Compass, Heart, MapPin, Radio } from "lucide-react";

const slides = [
  {
    title: "Explore hot places near you",
    body: "Find bars, clubs, lounges, and rooftops that match your vibe in seconds.",
    icon: Compass,
  },
  {
    title: "See what is active right now",
    body: "Live crowd momentum helps you pick a spot when the energy is actually there.",
    icon: Radio,
  },
  {
    title: "Check details before heading out",
    body: "View ratings, distance, pricing, and venue mood without jumping between apps.",
    icon: MapPin,
  },
  {
    title: "Save your go-to spots",
    body: "Bookmark favorites and build your personal nightlife shortlist for later.",
    icon: Heart,
  },
] as const;

type WalkthroughSlidesProps = {
  onBack: () => void;
  onNext: () => void;
};

export function WalkthroughSlides({ onBack, onNext }: WalkthroughSlidesProps) {
  const [index, setIndex] = useState(0);
  const slide = useMemo(() => slides[index], [index]);
  const Icon = slide.icon;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 inline-flex rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/15 p-3 text-fuchsia-100">
          <Icon size={24} />
        </div>
        <h2 className="text-xl font-semibold">{slide.title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/65">{slide.body}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {slides.map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={`h-2 rounded-full transition-all ${
              dotIndex === index ? "w-6 bg-fuchsia-300" : "w-2 bg-white/25"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium"
        >
          Back
        </button>
        {index === slides.length - 1 ? (
          <button
            onClick={onNext}
            className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-2.5 text-sm font-semibold"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => setIndex((value) => Math.min(value + 1, slides.length - 1))}
            className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-2.5 text-sm font-semibold"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
