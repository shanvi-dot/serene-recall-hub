import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { weeklyScores, moodTrend } from "@/lib/care-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — Lumen Care" },
      {
        name: "description",
        content:
          "See your weekly cognitive score, mood trend and gentle activity highlights inside Lumen Care.",
      },
      { property: "og:title", content: "My Progress — Lumen Care" },
      {
        property: "og:description",
        content: "Weekly cognitive score, mood trend and activity highlights.",
      },
    ],
  }),
  component: ProgressScreen,
});

function ProgressScreen() {
  const avg = Math.round(weeklyScores.reduce((s, d) => s + d.score, 0) / weeklyScores.length);

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="My Progress" subtitle="A gentle look at your week" />

        <div className="space-y-4">
          <SoftCard>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cognitive score</h2>
              <Pill tone="gold">Average {avg}</Pill>
            </div>
            <ul className="flex h-36 items-end justify-between gap-2">
              {weeklyScores.map((d) => (
                <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-primary">{d.score}</span>
                  <div
                    className="w-full rounded-t-xl bg-primary/80"
                    style={{ height: `${d.score}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{d.day}</span>
                </li>
              ))}
            </ul>
          </SoftCard>

          <SoftCard>
            <h2 className="mb-3 text-lg font-semibold">Mood trend</h2>
            <ul className="flex items-end justify-between gap-2">
              {moodTrend.map((d) => (
                <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">
                    {d.mood >= 5 ? "😊" : d.mood >= 4 ? "🙂" : "😌"}
                  </span>
                  <div
                    className="w-full rounded-t-xl bg-secondary"
                    style={{ height: `${d.mood * 18}px` }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{d.day}</span>
                </li>
              ))}
            </ul>
          </SoftCard>

          <SoftCard>
            <h2 className="mb-3 text-lg font-semibold">This week</h2>
            <dl className="grid grid-cols-2 gap-4 text-base">
              {[
                ["Games played", "12"],
                ["Memories added", "3"],
                ["Reminders kept", "26 / 30"],
                ["Best streak", "5 days"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-muted p-4">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-xl font-bold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </SoftCard>
        </div>
      </main>
    </MobileShell>
  );
}
