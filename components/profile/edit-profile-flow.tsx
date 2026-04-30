"use client";

import { useState } from "react";
import { X } from "lucide-react";
export function EditProfileFlow({
  open,
  profile,
  onClose,
  onSave,
}: {
  open: boolean;
  profile: {
    displayName: string;
    username: string;
    bio: string;
    cityLine: string;
    avatarUrl: string;
  };
  onClose: () => void;
  onSave: (changes: { displayName: string; username: string; bio: string; cityLine: string; avatarUrl: string }) => void;
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [cityLine, setCityLine] = useState(profile.cityLine);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-lg space-y-3 rounded-t-3xl border border-white/10 bg-[#0a0f1c] p-4 md:rounded-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Edit profile</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 p-1.5"><X size={14} /></button>
        </div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white" />
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white" />
        <input value={cityLine} onChange={(e) => setCityLine(e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white" />
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar URL" className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white" />

        <button
          type="button"
          onClick={() => {
            onSave({ displayName, username, bio, cityLine, avatarUrl });
            onClose();
          }}
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
