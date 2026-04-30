"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setError(""); setLoading(true);
    const response = await fetch("/api/auth/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ displayName, email, password }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error ?? "Unable to create account.");
    router.replace("/onboarding");
  }

  return <main className="min-h-screen bg-gradient-to-b from-[#060914] via-[#0c1030] to-[#05070f] text-white"><div className="mx-auto flex min-h-screen max-w-md items-center px-6"><form onSubmit={onSubmit} className="w-full space-y-4 rounded-3xl border border-cyan-400/20 bg-black/25 p-6"><h1 className="text-3xl font-semibold">Create account</h1><input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder="Display name" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/><input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" required placeholder="Confirm password" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/>{error ? <p className="text-sm text-rose-300">{error}</p> : null}<button disabled={loading} className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-60">{loading?"Creating account...":"Create account"}</button><Link href="/login" className="block text-sm text-cyan-300">Back to login</Link></form></div></main>;
}
