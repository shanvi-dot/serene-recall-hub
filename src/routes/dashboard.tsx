import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gamepad2, BookHeart, Bell, TrendingUp, ChevronRight, Newspaper } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { supabase } from "@/integrations/supabase/client";
import {
  greeting,
  todayLabel,
  weeklyScores,
  patient as fallbackPatient,
} from "@/lib/care-data";
import { todaysItem, categoryLabel } from "@/lib/daily-news";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today — Neuro Mitra" },
      { name: "description", content: "Your Neuro Mitra: last game score, latest memory, the next reminder and your weekly cognitive trend." },
      { property: "og:title", content: "Today — Neuro Mitra" },
      { property: "og:description", content: "Games, memories, reminders and progress in one gentle daily view." },
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

type LatestJournal = { id: string; content: string; event_time: string } | null;
type NextReminder = { label: string; scheduled_time: string } | null;

function Dashboard() {
  const [patientName, setPatientName] = useState(fallbackPatient.name);
  const [latest, setLatest] = useState<LatestJournal>(null);
  const [nextReminder, setNextReminder] = useState<NextReminder>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: patientRow } = await supabase.from("patients").select("name").limit(1).maybeSingle();
      if (patientRow?.name) setPatientName(patientRow.name);

      const { data: journalRow } = await supabase
        .from("journal_entries")
        .select("id, content, event_time")
        .order("event_time", { ascending: false })
        .limit(1)
        .maybeSingle();
      setLatest(journalRow ?? null);

      const { data: reminderRows } = await supabase
        .from("reminders")
        .select("label, scheduled_time")
        .order("scheduled_time", { ascending: true });
      if (reminderRows && reminderRows.length > 0) {
        const now = new Date().toTimeString().slice(0, 8);
        const upcoming = reminderRows.find((r) => r.scheduled_time > now);
        setNextReminder(upcoming ?? reminderRows[0]);
      }

      setLoading(false);
    }
    load();
  }, []);

  const trend = weeklyScores.at(-1)!.score - weeklyScores[0]!.score;
  const daily = todaysItem();

  return (
    <MobileShell>
      <main>
        <header className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {patientName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting()}, {patientName}
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
            {loading ? (
              <p className="text-base text-muted-foreground">Loading…</p>
            ) : latest ? (
              <Link to="/journal/$id" params={{ id: latest.id }} className="block">
                <p className="text-base font-semibold text-foreground line-clamp-2">{latest.content}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(latest.event_time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </Link>
            ) : (
              <p className="text-base text-muted-foreground">No journal entries yet.</p>
            )}
          </SoftCard>

          <SoftCard>
            <h2 className="text-lg font-semibold">Next reminder</h2>
            {loading ? (
              <p className="mt-2 text-base text-muted-foreground">Loading…</p>
            ) : nextReminder ? (
              <p className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{nextReminder.scheduled_time.slice(0, 5)}</span>
                <span className="text-base text-foreground">{nextReminder.label}</span>
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">No reminders set yet.</p>
            )}
          </SoftCard>

          <SoftCard>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Weekly cognitive score</h2>
              <Pill tone="success">+{trend} pts</Pill>
            </div>
            <ul className="flex h-32 items-end justify-between gap-2">
              {weeklyScores.map((d) => (
                <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-primary/80" style={{ height: `${d.score}%` }} aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">{d.day}</span>
                  <span className="sr-only">{d.score} points</span>
                </li>
              ))}
            </ul>
          </SoftCard>

          <SoftCard>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Daily news</h2>
              <Pill tone="gold">{categoryLabel[daily.category]}</Pill>
            </div>
            <div className="flex items-start gap-3">
              <Newspaper className="mt-1 size-8 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-base font-semibold text-foreground">{daily.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{daily.body}</p>
              </div>
            </div>
            <Link
              to="/daily-news"
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-muted text-base font-semibold text-primary"
            >
              Read today&apos;s story <ChevronRight className="size-5" aria-hidden="true" />
            </Link>
          </SoftCard>
        </div>
      </main>
    </MobileShell>
  );
}