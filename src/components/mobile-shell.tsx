import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gamepad2, BookHeart, Bell, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/reminders", label: "Reminders", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <div className="flex-1 px-5 pt-6 pb-32">{children}</div>

      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 px-2 pb-2 pt-2 backdrop-blur"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <ul className="flex items-stretch justify-between">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className={`tap-press flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-sm font-semibold ${
                    active ? "bg-muted text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 text-base text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
