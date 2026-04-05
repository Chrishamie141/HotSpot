import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-sm font-medium text-fuchsia-100 ${className}`}
    >
      {children}
    </span>
  );
}