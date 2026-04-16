import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#05070f] px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">NightPulse</p>
        <h1 className="mt-2 text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-zinc-400">Sign in to discover, post, and save nightlife spots.</p>
        <div className="mt-5">
          <LoginForm />
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Don&apos;t have an account? <Link href="/signup" className="text-cyan-200">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
