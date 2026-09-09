import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { dailyItems, todaysItem, categoryLabel } from "@/lib/daily-news";
import { todayLabel } from "@/lib/care-data";

export const Route = createFileRoute("/daily-news")({
  head: () => ({
    meta: [
      { title: "Daily News — Neuro Mitra" },
      {
        name: "description",
        content: "One gentle news story, fact or tip for today, refreshed daily.",
      },
      { property: "og:title", content: "Daily News — Neuro Mitra" },
      {
        property: "og:description",
        content: "One gentle news story, fact or tip for today, refreshed daily.",
      },
    ],
  }),
  component: DailyNews,
});

function DailyNews() {
  const today = todaysItem();

  return (
    <MobileShell>
      <main>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Daily news</h1>
          <p className="flex items-center gap-2 text-base text-muted-foreground">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            {todayLabel()}
          </p>
        </header>

        <SoftCard className="mb-6">
          <div className="mb-3">
            <Pill tone="gold">{categoryLabel[today.category]}</Pill>
          </div>
          {today.image && (
            <img
              src={today.image}
              alt={today.title}
              loading="lazy"
              className="mb-4 h-44 w-full rounded-2xl object-cover"
            />
          )}
          <h2 className="text-xl font-bold text-foreground">{today.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-foreground">{today.body}</p>
        </SoftCard>

        <h2 className="mb-3 text-lg font-semibold">Earlier this week</h2>
        <div className="space-y-3">
          {dailyItems
            .filter((item) => item !== today)
            .map((item) => (
              <SoftCard key={item.title}>
                <Pill tone="primary">{categoryLabel[item.category]}</Pill>
                <h3 className="mt-2 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </SoftCard>
            ))}
        </div>
      </main>
    </MobileShell>
  );
}
