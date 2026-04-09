"use client";

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

export function ShareProfileSheet({ open, username, onClose }: { open: boolean; username: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const profileUrl = `https://nightpulse.app/${username.replace("@", "")}`;

  return (
    <section className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-md space-y-3 rounded-t-3xl border border-white/10 bg-[#0a0f1c] p-4 md:rounded-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Share profile</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 p-1.5"><X size={14} /></button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200">{profileUrl}</div>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(profileUrl);
            } catch {
              // no-op for unsupported env
            }
            setCopied(true);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
