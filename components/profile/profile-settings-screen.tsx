"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

const toggleItems = new Set(["Privacy", "Notifications"]);

export function ProfileSettingsScreen({
  open,
  items,
  onClose,
  onOpenAuth,
  onOpenEdit,
  onNavigateTab,
  profile,
  onUpdateProfile,
  onLogout,
}: {
  open: boolean;
  items: string[];
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenEdit: () => void;
  onNavigateTab: (tab: "posts" | "tagged" | "saved") => void;
  profile: any;
  onUpdateProfile: (changes: Record<string, unknown>) => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [panel, setPanel] = useState<string>();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Privacy: !profile?.isPrivate,
    Notifications: profile?.notificationsEnabled ?? true,
  });
  const [accountDisplayName, setAccountDisplayName] = useState(profile?.displayName ?? "");
  const [contentPrefs, setContentPrefs] = useState({
    showVideos: profile?.showVideos ?? true,
    showNightlifeEvents: profile?.showNightlifeEvents ?? true,
    showFoodSpots: profile?.showFoodSpots ?? true,
  });
  const [preferredVibes, setPreferredVibes] = useState<string[]>(profile?.preferredVibes ?? []);
  const [message, setMessage] = useState("");

  if (!open) return null;

  function handleItemClick(item: string) {
    setMessage("");

    if (item === "Edit profile") return onOpenEdit();
    if (item === "Account settings") return setPanel("account");
    if (item === "Saved posts") return onNavigateTab("saved");
    if (item === "Tagged posts") return onNavigateTab("tagged");
    if (item === "Log out") return onLogout();
    if (item === "Help & support") return setPanel("help");
    if (item === "Content preferences") return setPanel("content");
    if (item === "Nightlife preferences") return setPanel("nightlife");

    if (toggleItems.has(item)) {
      const next = !toggles[item];
      setToggles((current) => ({ ...current, [item]: next }));
      if (item === "Privacy") void onUpdateProfile({ isPrivate: !next });
      if (item === "Notifications") void onUpdateProfile({ notificationsEnabled: next });
      return;
    }

    setMessage(`${item} opened.`);
  }

  return (
    <section className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 md:items-center md:justify-center md:p-6">
      <div className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-3xl border border-white/10 bg-[#0a0f1c] p-4 md:rounded-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Settings</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 p-1.5"><X size={14} /></button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleItemClick(item)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-left text-sm text-zinc-200"
            >
              <span>{item}</span>
              {toggleItems.has(item) ? (
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${toggles[item] ? "bg-cyan-500/15 text-cyan-200" : "bg-zinc-700/40 text-zinc-400"}`}>
                  {toggles[item] ? "On" : "Off"}
                </span>
              ) : (
                <ChevronRight size={14} className="text-zinc-500" />
              )}
            </button>
          ))}
        </div>

        {message ? <p className="mt-3 text-xs text-cyan-200">{message}</p> : null}
        {panel === "account" ? (
          <div className="mt-3 space-y-2 rounded-xl border border-white/10 p-3 text-sm">
            <p className="text-zinc-300">Local account mode</p>
            <p className="text-zinc-400">Email: {profile?.email || "Not set"}</p>
            <p className="text-zinc-400">Account ID: {profile?.accountId}</p>
            <input value={accountDisplayName} onChange={(e) => setAccountDisplayName(e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0c1120] px-2 py-1.5" />
            <button className="rounded-lg border border-white/15 px-3 py-1.5" onClick={() => onUpdateProfile({ displayName: accountDisplayName })}>Save display name</button>
          </div>
        ) : null}
        {panel === "content" ? <div className="mt-3 space-y-2 text-sm">{(["showVideos","showNightlifeEvents","showFoodSpots"] as const).map((k) => <button key={k} onClick={async () => { const n = !contentPrefs[k]; const next = { ...contentPrefs, [k]: n }; setContentPrefs(next); await onUpdateProfile(next); }} className="flex w-full justify-between rounded-xl border border-white/10 px-3 py-2"><span>{k}</span><span>{contentPrefs[k] ? "On" : "Off"}</span></button>)}</div> : null}
        {panel === "nightlife" ? <div className="mt-3 space-y-2 text-sm">{["lounges","clubs","bars","restaurants","live music"].map((v) => <button key={v} onClick={async () => { const has = preferredVibes.includes(v); const next = has ? preferredVibes.filter((x) => x !== v) : [...preferredVibes, v]; setPreferredVibes(next); await onUpdateProfile({ preferredVibes: next }); }} className="flex w-full justify-between rounded-xl border border-white/10 px-3 py-2"><span>{v}</span><span>{preferredVibes.includes(v) ? "Selected" : "Not selected"}</span></button>)}</div> : null}
        {panel === "help" ? <div className="mt-3 rounded-xl border border-white/10 p-3 text-sm text-zinc-300"><p>Need help? Contact support@hotspot.app</p><p className="mt-2">Report a bug: include steps, page, and screenshot.</p><p className="mt-2">App help: use Feed to post, Explore to find venues, and Profile to manage settings.</p></div> : null}
      </div>
    </section>
  );
}
