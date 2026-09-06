import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BookHeart, Bell, Plus, Smile } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { patient, reminders, weeklyScores, moodTrend, memories } from "@/lib/care-data";
import { toast } from "sonner";

export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver Dashboard — Lumen Care" },
      {
        name: "description",
        content:
          "Caregiver view: adherence to reminders, cognitive and mood trends, recent memories and gentle alerts for Eleanor.",
      },
      { property: "og:title", content: "Caregiver Dashboard — Lumen Care" },
      {
        property: "og:description",
        content: "Reminder adherence, cognitive and mood trends, and gentle alerts at a glance.",
      },
    ],
  }),
  component: CaregiverDashboard,
});

const alerts = [
  { id: "1", text: "Afternoon tablet missed yesterday at 13:00", tone: "warn" as const },
  { id: "2", text: "Memory Match score improved by 20 points", tone: "good" as const },
];

function CaregiverDashboard() {
  const done = reminders.filter((r) => r.done).length;
  const adherence = Math.round((done / reminders.length) * 100);
  const avgScore = Math.round(weeklyScores.reduce((s, d) => s + d.score, 0) / weeklyScores.length);
  const avgMood = (moodTrend.reduce((s, d) => s + d.mood, 0) / moodTrend.length).toFixed(1);

  return (
    <MobileShell>
      <main>
        <ScreenHeader
          title="Caregiver View"
          subtitle={`How ${patient.name} is doing this week`}
        />

        <div className="grid grid-cols-2 gap-4">
          <SoftCard>
            <p className="text-sm text-muted-foreground">Reminder adherence</p>
            <p className="mt-1 text-3xl font-bold text-primary">{adherence}%</p>
            <p className="text-sm text-muted-foreground">
              {done} of {reminders.length} today
            </p>
          </SoftCard>
          <SoftCard>
            <p className="text-sm text-muted-foreground">Avg cognitive score</p>
            <p className="mt-1 text-3xl font-bold text-primary">{avgScore}</p>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </SoftCard>
        </div>

        <SoftCard className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Cognitive trend</h2>
            <Pill tone="success">Improving</Pill>
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
                <span className="sr-only">
                  {d.day}: {d.score} points
                </span>
              </li>
            ))}
          </ul>
        </SoftCard>

        <SoftCard className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Smile className="size-6 text-primary" aria-hidden="true" /> Mood
            </h2>
            <Pill tone="gold">Avg {avgMood} / 5</Pill>
          </div>
          <ul className="flex items-end justify-between gap-2">
            {moodTrend.map((d) => (
              <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-secondary"
                  style={{ height: `${d.mood * 20}px` }}
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground">{d.day}</span>
                <span className="sr-only">
                  {d.day}: mood {d.mood} of 5
                </span>
              </li>
            ))}
          </ul>
        </SoftCard>

        <section className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <AlertTriangle className="size-6 text-primary" aria-hidden="true" /> Alerts
          </h2>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.id}>
                <SoftCard
                  className={a.tone === "warn" ? "bg-destructive/25" : "bg-success/40"}
                >
                  <p className="text-base font-semibold text-foreground">{a.text}</p>
                </SoftCard>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent memories added</h2>
          <ul className="space-y-3">
            {memories.slice(0, 2).map((m) => (
              <li key={m.id}>
                <Link to="/journal/$id" params={{ id: m.id }} className="block tap-press">
                  <SoftCard className="flex items-center gap-4">
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="size-16 shrink-0 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.date}</p>
                    </div>
                  </SoftCard>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 space-y-3">
          <Button
            variant="gold"
            size="care"
            className="w-full font-bold"
            onClick={() => toast.success("Reminder added to Eleanor's day")}
          >
            <Bell className="size-6" aria-hidden="true" /> Add reminder
          </Button>
          <Link to="/journal/new" className="block">
            <Button variant="care" size="care" className="w-full font-bold">
              <Plus className="size-6" aria-hidden="true" /> Add a memory
            </Button>
          </Link>
          <Link to="/journal" className="block">
            <Button variant="outline" size="care" className="w-full font-bold">
              <BookHeart className="size-6" aria-hidden="true" /> View journal
            </Button>
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
