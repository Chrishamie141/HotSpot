"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ImagePlus, Video, X } from "lucide-react";
import { availableVenues } from "@/components/live/mock-live-posts";

const defaultVibe = 6;

type MediaPostComposerProps = {
  onCreatePost: (draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
  }) => void;
};

export function MediaPostComposer({ onCreatePost }: MediaPostComposerProps) {
  const [caption, setCaption] = useState("");
  const [venue, setVenue] = useState(availableVenues[0]);
  const [vibeScore, setVibeScore] = useState(defaultVibe);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const vibeLabel = useMemo(() => {
    if (vibeScore <= 2) return "Chill 😌";
    if (vibeScore <= 4) return "Calm 🙂";
    if (vibeScore <= 6) return "Active 😎";
    if (vibeScore <= 8) return "Lit 🔥";
    return "Crazy 🚀";
  }, [vibeScore]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  }

  function resetComposer() {
    setCaption("");
    setVenue(availableVenues[0]);
    setVibeScore(defaultVibe);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(undefined);
    setMediaType("image");
  }

  function submitPost() {
    onCreatePost({
      venue,
      caption: caption.trim() || "Live check-in from tonight.",
      vibeScore,
      mediaUrl: previewUrl,
      mediaType,
    });
    resetComposer();
  }

  return (
    <section className="space-y-4 rounded-3xl border border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/10 to-cyan-500/5 p-4 shadow-[0_0_30px_rgba(217,70,239,0.2)] md:p-5">
      <div>
        <h3 className="text-lg font-semibold">Create live post</h3>
        <p className="text-sm text-zinc-300">Share tonight&apos;s vibe in seconds — upload media, tag venue, and rate the energy.</p>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/20 px-4 py-3 text-sm text-zinc-200 transition hover:border-cyan-300/50 hover:bg-black/30">
        <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
        {mediaType === "video" ? <Video size={16} /> : <ImagePlus size={16} />}
        Upload image/video
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm text-zinc-300">
          <span>Tag venue</span>
          <select
            className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none ring-fuchsia-400/40 focus:ring"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
          >
            {availableVenues.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          <span>Vibe rating · {vibeLabel}</span>
          <input
            type="range"
            min={1}
            max={10}
            value={vibeScore}
            onChange={(event) => setVibeScore(Number(event.target.value))}
            className="w-full accent-fuchsia-400"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-zinc-300">
        <span>Caption</span>
        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none ring-fuchsia-400/40 placeholder:text-zinc-500 focus:ring"
          placeholder="What&apos;s happening right now?"
        />
      </label>

      {previewUrl ? (
        <div className="space-y-2 rounded-2xl border border-white/15 bg-black/25 p-3">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Preview</span>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 hover:bg-white/10"
              type="button"
              onClick={() => {
                if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(undefined);
              }}
            >
              <X size={12} /> Remove
            </button>
          </div>

          {mediaType === "video" ? (
            <video src={previewUrl} controls muted className="max-h-80 w-full rounded-xl object-cover" />
          ) : (
            <img src={previewUrl} alt="Selected upload preview" className="max-h-80 w-full rounded-xl object-cover" />
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submitPost}
        className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Post to live feed
      </button>
    </section>
  );
}
