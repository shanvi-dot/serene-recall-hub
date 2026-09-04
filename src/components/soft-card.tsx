import type { ReactNode } from "react";

export function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-border/60 bg-card p-5 ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {children}
    </div>
  );
}

export function Pill({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "gold" | "success" }) {
  const tones = {
    primary: "bg-muted text-primary",
    gold: "bg-gold/30 text-gold-foreground",
    success: "bg-success/50 text-success-foreground",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
