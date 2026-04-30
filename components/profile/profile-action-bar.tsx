import { MessageCircle, Settings, Share2, UserRoundPen } from "lucide-react";

export function ProfileActionBar({
  isCurrentUser,
  isFollowing,
  onFollowToggle,
  onShare,
  onEdit,
  onSettings,
}: {
  isCurrentUser: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onShare: () => void;
  onEdit: () => void;
  onSettings: () => void;
}) {
  if (isCurrentUser) {
    return (
      <section className="grid grid-cols-3 gap-2">
        <button type="button" onClick={onEdit} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100"><UserRoundPen size={14} /> Edit Profile</button>
        <button type="button" onClick={onShare} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100"><Share2 size={14} /> Share</button>
        <button type="button" onClick={onSettings} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100"><Settings size={14} /> Settings</button>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-3 gap-2">
      <button type="button" onClick={onFollowToggle} className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-medium ${isFollowing ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-100" : "border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-100"}`}>
        {isFollowing ? "Following" : "Follow"}
      </button>
      <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100"><MessageCircle size={14} /> Message</button>
      <button type="button" onClick={onShare} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100"><Share2 size={14} /> Share</button>
    </section>
  );
}
