import Image from "next/image";
import { Play } from "lucide-react";
import type { ComposerMedia } from "@/components/feed/types";

export function CreatePostMediaPicker({
  mediaLibrary,
  selectedMediaId,
  onSelect,
  onFileSelect,
}: {
  mediaLibrary: ComposerMedia[];
  selectedMediaId?: string;
  onSelect: (media: ComposerMedia) => void;
  onFileSelect: (file: File) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <label className="block rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4 text-center text-sm text-zinc-300">
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        Choose from device
      </label>

      <div className="grid grid-cols-3 gap-2">
        {mediaLibrary.map((media) => (
          <button
            type="button"
            key={media.id}
            onClick={() => onSelect(media)}
            className={`relative aspect-square overflow-hidden rounded-xl border ${
              selectedMediaId === media.id ? "border-fuchsia-300" : "border-white/10"
            }`}
          >
            <Image
              src={media.thumbnailUrl}
              alt="Media item"
              width={320}
              height={320}
              className="h-full w-full object-cover"
            />
            {media.mediaType === "video" ? (
              <span className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1 text-white">
                <Play size={12} className="fill-current" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
