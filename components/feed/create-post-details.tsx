import { composerVenues } from "@/components/feed/mock-feed-data";

export function CreatePostDetails({
  venue,
  caption,
  peopleTags,
  vibeScore,
  onVenueChange,
  onCaptionChange,
  onPeopleTagsChange,
  onVibeChange,
}: {
  venue: string;
  caption: string;
  peopleTags: string;
  vibeScore: number;
  onVenueChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onPeopleTagsChange: (value: string) => void;
  onVibeChange: (value: number) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <select
        value={venue}
        onChange={(event) => onVenueChange(event.target.value)}
        className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none"
      >
        {composerVenues.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <textarea
        rows={4}
        value={caption}
        onChange={(event) => onCaptionChange(event.target.value)}
        placeholder="Write a caption"
        className="w-full resize-none rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
      />

      <input
        value={peopleTags}
        onChange={(event) => onPeopleTagsChange(event.target.value)}
        placeholder="Tag people"
        className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
      />

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span>Vibe</span>
          <span>{vibeScore}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={vibeScore}
          onChange={(event) => onVibeChange(Number(event.target.value))}
          className="w-full accent-fuchsia-400"
        />
      </div>
    </div>
  );
}
