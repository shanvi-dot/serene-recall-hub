import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { Gamepad2, BookHeart, Bell, TrendingUp, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import {
  greeting,
  todayLabel,
  memories,
  reminders,
  weeklyScores,
  patient,
} from "@/lib/care-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today — Lumen Care Patient Home" },
      {
        name: "description",
        content:
          "Your daily Lumen Care home: last game score, latest memory, the next reminder and your weekly cognitive trend.",
      },
      { property: "og:title", content: "Today — Lumen Care Patient Home" },
      {
        property: "og:description",
        content: "Games, memories, reminders and progress in one gentle daily view.",
      },
    ],
  }),
  component: Dashboard,
});

const navCards = [
  { to: "/games", label: "Games", icon: Gamepad2, tint: "bg-secondary/45" },
  { to: "/journal", label: "Journal", icon: BookHeart, tint: "bg-muted" },
  { to: "/reminders", label: "Reminders", icon: Bell, tint: "bg-gold/35" },
  { to: "/progress", label: "Progress", icon: TrendingUp, tint: "bg-success/50" },
] as const;

function Dashboard() {
  const navigate = useNavigate();
  const { role } = useSession();

  useEffect(() => {
    if (role === "caregiver") navigate({ to: "/caregiver", replace: true });
  }, [role, navigate]);

  const nextReminder = reminders.find((r) => !r.done) ?? reminders[0];
  const latest = memories[0];
  const trend = weeklyScores.at(-1)!.score - weeklyScores[0].score;

  return (
    <MobileShell>
      <main>
        <header className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting()}, {patient.name}
            </h1>
            <p className="text-base text-muted-foreground">{todayLabel()}</p>
          </div>
        </header>

        <nav aria-label="Main sections" className="mb-6 grid grid-cols-2 gap-4">
          {navCards.map(({ to, label, icon: Icon, tint }) => (
            <Link
              key={to}
              to={to}
              className={`tap-press flex min-h-28 flex-col items-start justify-between rounded-3xl p-4 text-lg font-semibold text-foreground ${tint}`}
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <Icon className="size-8 text-primary" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-4">
          <SoftCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Last game played</h2>
                <p className="text-base text-muted-foreground">Memory Match · Level 2</p>
              </div>
              <Pill tone="gold">Score 180</Pill>
            </div>
            <Link
              to="/games"
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-muted text-base font-semibold text-primary"
            >
              Play again <ChevronRight className="size-5" aria-hidden="true" />
            </Link>
          </SoftCard>

          <SoftCard>
            <h2 className="mb-3 text-lg font-semibold">Recent memory</h2>
            <Link to="/journal/$id" params={{ id: latest.id }} className="flex items-center gap-4">
              <img
                src={latest.image}
                alt={latest.title}
                loading="lazy"
                className="size-20 shrink-0 rounded-2xl object-cover"
              />
              <div>
                <p className="text-base font-semibold text-foreground">{latest.title}</p>
                <p className="text-sm text-muted-foreground">{latest.date}</p>
              </div>
            </Link>
          </SoftCard>

          <SoftCard>
            <h2 className="text-lg font-semibold">Next reminder</h2>
            <p className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{nextReminder.time}</span>
              <span className="text-base text-foreground">{nextReminder.text}</span>
            </p>
          </SoftCard>

          <SoftCard>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Weekly cognitive score</h2>
              <Pill tone="success">+{trend} pts</Pill>
            </div>
            <ul className="flex h-32 items-end justify-between gap-2">
              {weeklyScores.map((d) => (
                <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-primary/80"
                    style={{ height: `${d.score}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{d.day}</span>
                  <span className="sr-only">{d.score} points</span>
                </li>
              ))}
            </ul>
          </SoftCard>
        </div>
      </main>
    </MobileShell>
  );
}
