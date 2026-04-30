"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { validatePassword, validateUsername } from "@/components/profile/auth-rules";

const existingHandles = ["nightpulse", "chris", "mira.nights", "cityafterdark"];

type AuthMode = "login" | "signup" | "forgot" | "change";

export function AuthModal({
  open,
  onClose,
  onUsernameCommitted,
}: {
  open: boolean;
  onClose: () => void;
  onUsernameCommitted: (username: string) => void;
}) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  function submit() {
    setMessage("");

    if (mode === "forgot") {
      if (!email.includes("@")) {
        setMessage("Enter a valid account email.");
        return;
      }
      setMessage("Password reset link sent.");
      return;
    }

    if (mode === "login") {
      if (!email.includes("@") || !password) {
        setMessage("Enter email and password.");
        return;
      }
      setMessage("Logged in (mock).");
      return;
    }

    if (mode === "signup") {
      const usernameError = validateUsername(username, existingHandles);
      if (usernameError) {
        setMessage(usernameError);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setMessage(passwordError);
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      onUsernameCommitted(`@${username.trim().toLowerCase()}`);
      setMessage("Account created (mock).");
      return;
    }

    if (mode === "change") {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setMessage(passwordError);
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      setMessage("Password changed (mock).");
    }
  }

  return (
    <section className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-lg space-y-3 rounded-t-3xl border border-white/10 bg-[#0a0f1c] p-4 md:rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            <button onClick={() => setMode("login")} className={`rounded-full px-2 py-1 ${mode === "login" ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-zinc-400"}`}>Log in</button>
            <button onClick={() => setMode("signup")} className={`rounded-full px-2 py-1 ${mode === "signup" ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-zinc-400"}`}>Sign up</button>
            <button onClick={() => setMode("forgot")} className={`rounded-full px-2 py-1 ${mode === "forgot" ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-zinc-400"}`}>Forgot</button>
            <button onClick={() => setMode("change")} className={`rounded-full px-2 py-1 ${mode === "change" ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-zinc-400"}`}>Change</button>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 p-1.5"><X size={14} /></button>
        </div>

        {mode !== "change" ? (
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none" />
        ) : null}

        {mode === "signup" ? (
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none" />
        ) : null}

        {mode !== "forgot" ? (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 pr-10 text-sm text-white outline-none"
            />
            <button type="button" onClick={() => setShowPassword((x) => !x)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        ) : null}

        {(mode === "signup" || mode === "change") ? (
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-white/15 bg-[#0c1120] px-3 py-2 text-sm text-white outline-none"
          />
        ) : null}

        {message ? <p className="text-xs text-cyan-200">{message}</p> : null}

        <button type="button" onClick={submit} className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
          {mode === "login" ? "Log in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Change password"}
        </button>
      </div>
    </section>
  );
}
