import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Brain, Grid3x3 } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";

export const Route = createFileRoute("/games/")({
  head: () => ({
    meta: [
      { title: "Gentle Memory Games — Lumen Care" },
      {
        name: "description",
        content:
          "Two calm cognitive games: Memory Match for object sequences and Sequence Master for colour grid patterns, with five gentle levels each.",
      },
      { property: "og:title", content: "Gentle Memory Games — Lumen Care" },
      {
        property: "og:description",
        content: "Memory Match and Sequence Master — calm games with five gentle levels each.",
      },
    ],
  }),
  component: GamesScreen,
});

const games = [
  {
    to: "/games/memory" as const,
    title: "Memory Match",
    description: "Watch & remember the sequence",
    icon: Brain,
    score: 180,
  },
  {
    to: "/games/sequence" as const,
    title: "Sequence Master",
    description: "Repeat the pattern",
    icon: Grid3x3,
    score: 140,
  },
];

function GamesScreen() {
  return (
    <MobileShell>
      <main>
        <ScreenHeader title="Games" subtitle="Play a little every day" />
        <div className="space-y-5">
          {games.map((g) => (
            <SoftCard key={g.to}>
              <div className="flex items-start gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/45">
                  <g.icon className="size-7 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{g.title}</h2>
                  <p className="text-base text-muted-foreground">{g.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Pill>Level 1/5</Pill>
                    <Pill tone="gold">Recent score {g.score}</Pill>
                  </div>
                </div>
              </div>
              <Link
                to={g.to}
                className="gold-bg tap-press mt-5 flex min-h-14 items-center justify-center gap-2 rounded-2xl text-lg font-bold text-gold-foreground"
              >
                <Play className="size-6" aria-hidden="true" /> Play
              </Link>
            </SoftCard>
          ))}
        </div>
      </main>
    </MobileShell>
  );
}
