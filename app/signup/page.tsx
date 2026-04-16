import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#05070f] px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">NightPulse</p>
        <h1 className="mt-2 text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-zinc-400">Join the nightlife community and build your profile.</p>
        <div className="mt-5">
          <SignupForm />
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-cyan-200">Log in</Link>
        </p>
      </section>
    </main>
  );
}
