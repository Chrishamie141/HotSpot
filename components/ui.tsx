import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-2xl bg-night-card p-4 glow-border", className)}>{children}</div>;
}

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("inline-flex rounded-full bg-night-glow/30 px-2 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}
