"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { composerVenues } from "@/components/feed/mock-feed-data";

export function FeedComposer({
  onCreatePost,
}: {
  onCreatePost: (draft: {
    venue: string;
    caption: string;
    vibeScore: number;
    mediaUrl?: string;
    mediaType?: "image" | "video";
  }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [venue, setVenue] = useState(composerVenues[0]);
  const [vibeScore, setVibeScore] = useState(6);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function reset() {
    setCaption("");
    setVenue(composerVenues[0]);
    setVibeScore(6);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(undefined);
    setMediaType("image");
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  }

  function submit() {
    onCreatePost({
      venue,
      caption: caption.trim() || "Night check-in",
      vibeScore,
      mediaUrl: previewUrl,
      mediaType,
    });
    reset();
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100"
      >
        <Plus size={16} /> Post
      </button>

      <button
        type="button"
        aria-label="Create post"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-30 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 p-3 text-white shadow-[0_0_20px_rgba(217,70,239,0.45)] md:hidden"
      >
        <Plus size={20} />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/60 p-0 md:place-items-center md:p-6">
          <div className="max-h-[92vh] w-full max-w-lg space-y-3 overflow-auto rounded-t-3xl border border-white/10 bg-[#0b111d] p-4 md:rounded-3xl md:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">New post</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-white/20 p-1.5">
                <X size={14} />
              </button>
            </div>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/20 px-4 py-3 text-sm text-zinc-200">
              <input type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
              <ImagePlus size={16} /> Add photo/video
            </label>

            <select
              value={venue}
              onChange={(event) => setVenue(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none"
            >
              {composerVenues.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <textarea
              rows={3}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Write a caption"
              className="w-full resize-none rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <input type="range" min={1} max={10} value={vibeScore} onChange={(event) => setVibeScore(Number(event.target.value))} className="w-full accent-fuchsia-400" />

            {previewUrl ? (
              mediaType === "video" ? (
                <video src={previewUrl} controls muted className="max-h-80 w-full rounded-xl object-cover" />
              ) : (
                <img src={previewUrl} alt="preview" className="max-h-80 w-full rounded-xl object-cover" />
              )
            ) : null}

            <button type="button" onClick={submit} className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
              Share
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
