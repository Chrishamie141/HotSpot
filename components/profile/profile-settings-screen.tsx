"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

const toggleItems = new Set(["Privacy", "Notifications", "Content preferences", "Nightlife preferences"]);

export function ProfileSettingsScreen({
  open,
  items,
  onClose,
  onOpenAuth,
  onOpenEdit,
  onNavigateTab,
}: {
  open: boolean;
  items: string[];
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenEdit: () => void;
  onNavigateTab: (tab: "posts" | "tagged" | "saved") => void;
}) {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Privacy: true,
    Notifications: true,
    "Content preferences": true,
    "Nightlife preferences": true,
  });
  const [message, setMessage] = useState("");

  if (!open) return null;

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } finally {
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("nightpulse:feed-posts:v1");
          window.localStorage.removeItem("nightpulse:favorites:v1");
          window.sessionStorage.clear();
        } catch {
          // noop
        }
      }

      onClose();
      router.replace("/login");
      router.refresh();
    }
  }

  function handleItemClick(item: string) {
    setMessage("");

    if (item === "Edit profile") return onOpenEdit();
    if (item === "Account settings") return onOpenAuth();
    if (item === "Saved posts") return onNavigateTab("saved");
    if (item === "Tagged posts") return onNavigateTab("tagged");
    if (item === "Log out") {
      void handleLogout();
      return;
    }
    if (item === "Help & support") return setMessage("Support contact: support@nightpulse.app");

    if (toggleItems.has(item)) {
      setToggles((current) => ({ ...current, [item]: !current[item] }));
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
              className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-left text-sm text-zinc-200"
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
      </div>
    </section>
  );
}
