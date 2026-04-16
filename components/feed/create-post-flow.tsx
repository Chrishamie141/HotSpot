"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { mockMediaLibrary } from "@/components/feed/mock-feed-data";
import { CreatePostDetails } from "@/components/feed/create-post-details";
import { CreatePostEditor } from "@/components/feed/create-post-editor";
import { CreatePostMediaPicker } from "@/components/feed/create-post-media-picker";
import type { ComposerMedia } from "@/components/feed/types";

const steps = ["Select", "Edit", "Details"];

export function CreatePostFlow({
  onCreatePost,
}: {
  onCreatePost: (draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    peopleTags?: string;
    locationTag?: string;
  }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<ComposerMedia>();
  const [caption, setCaption] = useState("");
  const [venue, setVenue] = useState("Neon Harbor");
  const [locationTag, setLocationTag] = useState("Downtown");
  const [peopleTags, setPeopleTags] = useState("");
  const [vibeScore, setVibeScore] = useState(7);

  const canAdvance = useMemo(() => {
    if (step === 0) return Boolean(selectedMedia);
    return true;
  }, [step, selectedMedia]);

  function closeFlow() {
    setIsOpen(false);
    setStep(0);
    setCaption("");
    setVenue("Neon Harbor");
    setLocationTag("Downtown");
    setPeopleTags("");
    setVibeScore(7);
    setSelectedMedia(undefined);
  }

  function handleFileSelect(file: File) {
    const localUrl = URL.createObjectURL(file);
    setSelectedMedia({
      id: `upload-${Date.now()}`,
      thumbnailUrl: localUrl,
      mediaUrl: localUrl,
      mediaType: file.type.startsWith("video") ? "video" : "image",
    });
  }

  function handleNext() {
    if (step < 2 && canAdvance) {
      setStep((current) => current + 1);
      return;
    }

    onCreatePost({
      venue,
      caption: caption.trim() || "Night check-in",
      vibeScore,
      mediaUrl: selectedMedia?.mediaUrl,
      mediaType: selectedMedia?.mediaType,
      peopleTags,
      locationTag,
    });
    closeFlow();
  }

  function handleBack() {
    if (step === 0) {
      closeFlow();
    } else {
      setStep((current) => current - 1);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Create post"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-30 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 p-3 text-white shadow-[0_0_20px_rgba(217,70,239,0.45)]"
      >
        <Plus size={20} />
      </button>

      {isOpen ? (
        <section className="fixed inset-0 z-50 flex h-screen flex-col bg-[#050913]">
          <header className="flex items-center justify-between border-b border-white/10 px-3 py-3">
            <button type="button" onClick={handleBack} className="rounded-full border border-white/15 p-2 text-zinc-200">
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {steps.map((label, idx) => (
                <span
                  key={label}
                  className={`rounded-full px-2 py-1 text-[11px] ${idx <= step ? "bg-fuchsia-500/20 text-fuchsia-100" : "bg-white/[0.04] text-zinc-500"}`}
                >
                  {label}
                </span>
              ))}
            </div>

            <button type="button" onClick={closeFlow} className="rounded-full border border-white/15 p-2 text-zinc-200">
              <X size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto pb-6">
            {step === 0 ? (
              <CreatePostMediaPicker
                mediaLibrary={mockMediaLibrary}
                selectedMediaId={selectedMedia?.id}
                onSelect={setSelectedMedia}
                onFileSelect={handleFileSelect}
              />
            ) : null}

            {step === 1 && selectedMedia ? <CreatePostEditor media={selectedMedia} /> : null}

            {step === 2 ? (
              <CreatePostDetails
                venue={venue}
                caption={caption}
                locationTag={locationTag}
                peopleTags={peopleTags}
                vibeScore={vibeScore}
                onVenueChange={setVenue}
                onLocationTagChange={setLocationTag}
                onCaptionChange={setCaption}
                onPeopleTagsChange={setPeopleTags}
                onVibeChange={setVibeScore}
              />
            ) : null}
          </div>

          <footer className="border-t border-white/10 px-3 py-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 2 ? "Share" : "Next"}
            </button>
          </footer>
        </section>
      ) : null}
    </>
  );
}
