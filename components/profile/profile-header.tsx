import Image from "next/image";
import { MapPin } from "lucide-react";

export function ProfileHeader({
  displayName,
  username,
  bio,
  cityLine,
  avatarUrl,
}: {
  displayName: string;
  username: string;
  bio: string;
  cityLine: string;
  avatarUrl: string;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
      <div className="flex items-start gap-4">
        <Image
          src={avatarUrl}
          alt={displayName}
          width={96}
          height={96}
          className="h-20 w-20 rounded-3xl border border-fuchsia-300/30 object-cover md:h-24 md:w-24"
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="truncate text-xl font-semibold text-zinc-100">{displayName}</p>
          <p className="text-sm text-zinc-400">{username}</p>
          <p className="text-sm text-zinc-200">{bio}</p>
          <p className="inline-flex items-center gap-1 text-xs text-cyan-200">
            <MapPin size={12} /> {cityLine}
          </p>
        </div>
      </div>
    </section>
  );
}
