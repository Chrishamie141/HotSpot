"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error ?? "Invalid email or password.");
    router.replace(data.user?.onboardingCompleted ? "/profile" : "/onboarding");
  }

  return <main className="min-h-screen bg-gradient-to-b from-[#060914] via-[#0c1030] to-[#05070f] text-white"><div className="mx-auto flex min-h-screen max-w-md items-center px-6"><form onSubmit={onSubmit} className="w-full space-y-4 rounded-3xl border border-cyan-400/20 bg-black/25 p-6"><h1 className="text-3xl font-semibold">Log in</h1><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-xl border border-white/20 bg-[#0a1022] px-3 py-2.5"/>{error ? <p className="text-sm text-rose-300">{error}</p> : null}<button disabled={loading} className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-60">{loading?"Logging in...":"Log in"}</button><div className="flex items-center justify-between text-sm"><Link href="/signup" className="text-cyan-300">Create account</Link><button type="button" className="text-zinc-300">Forgot password?</button></div></form></div></main>;
}
