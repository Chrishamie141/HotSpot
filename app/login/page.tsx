"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMessage(body.error ?? "Unable to log in.");
      return;
    }
    const meRes = await fetch("/api/auth/me");
    if (!meRes.ok) {
      setStatus("error");
      setErrorMessage("Unable to load your account.");
      return;
    }
    const me = await meRes.json();
    router.replace(me.user?.onboardingCompleted ? "/profile" : "/onboarding");
  }

  return <main className="relative min-h-screen overflow-hidden bg-black text-white">{/* trimmed for brevity styles */}
    <div className="relative mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-black/90 p-6 shadow-2xl backdrop-blur md:p-8 space-y-4">
        <h2 className="text-center text-3xl font-semibold tracking-tight">Welcome back</h2>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Email" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Password" className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2" />
        <button disabled={status==="loading"} className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-5 py-3 font-semibold text-black">{status==="loading"?"Signing in...":"Sign in"}</button>
        <Link href="/api/auth/google/start" className="block w-full rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-center">Continue with Google</Link>
        <div className="flex justify-between text-sm text-zinc-300"><Link href="/signup" className="text-cyan-300">Create account</Link><span>Forgot password?</span></div>
        {status==="error" && <p className="text-sm text-rose-300">{errorMessage}</p>}
      </form>
    </div>
  </main>;
}
