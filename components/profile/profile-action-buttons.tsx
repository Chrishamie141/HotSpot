import { Settings, Share2, UserRoundPen } from "lucide-react";

export function ProfileActionButtons() {
  const actions = [
    { label: "Edit Profile", icon: UserRoundPen },
    { label: "Share Profile", icon: Share2 },
    { label: "Settings", icon: Settings },
  ];

  return (
    <section className="grid grid-cols-3 gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-white/[0.08]"
          >
            <Icon size={14} /> {action.label}
          </button>
        );
      })}
    </section>
  );
}
