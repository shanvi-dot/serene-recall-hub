import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/games/sequence")({
  head: () => ({
    meta: [
      { title: "Sequence Master — Lumen Care Game" },
      {
        name: "description",
        content:
          "Sequence Master: watch a soft colour pattern light up on the grid, then tap it back in the same order across five gentle levels.",
      },
      { property: "og:title", content: "Sequence Master — Lumen Care Game" },
      {
        property: "og:description",
        content: "Watch a colour pattern on the grid, then tap it back in order.",
      },
    ],
  }),
  component: SequenceGame,
});

const tints = [
  "bg-primary/70",
  "bg-secondary",
  "bg-gold/70",
  "bg-success",
  "bg-primary/45",
  "bg-secondary/60",
  "bg-gold/45",
  "bg-success/60",
  "bg-primary/60",
  "bg-secondary/80",
  "bg-gold/60",
  "bg-success/80",
  "bg-primary/35",
  "bg-secondary/45",
  "bg-gold/35",
  "bg-success/45",
];

function gridSize(level: number) {
  return level >= 4 ? 4 : 3;
}

function makePattern(level: number) {
  const cells = gridSize(level) ** 2;
  return Array.from({ length: level + 2 }, () => Math.floor(Math.random() * cells));
}

function SequenceGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState(() => makePattern(1));
  const [phase, setPhase] = useState<"watch" | "repeat" | "done">("watch");
  const [flash, setFlash] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number[]>([]);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (phase !== "watch") return;
    let i = 0;
    setFlash(pattern[0]);
    const id = setInterval(() => {
      i += 1;
      if (i >= pattern.length) {
        clearInterval(id);
        setFlash(null);
        setPhase("repeat");
        return;
      }
      setFlash(pattern[i]);
    }, 900);
    return () => clearInterval(id);
  }, [phase, pattern]);

  function start(next: number) {
    setLevel(next);
    setPattern(makePattern(next));
    setTapped([]);
    setPhase("watch");
  }

  function tap(cell: number) {
    if (phase !== "repeat") return;
    setFlash(cell);
    setTimeout(() => setFlash(null), 250);
    const next = [...tapped, cell];
    setTapped(next);
    if (next.length === pattern.length) {
      const ok = next.every((v, i) => v === pattern[i]);
      setCorrect(ok);
      setPhase("done");
      if (ok) {
        setScore((s) => s + level * 25);
        toast.success("Correct! Lovely memory.");
      } else {
        toast("Try again — no rush at all.");
      }
    }
  }

  const size = gridSize(level);

  return (
    <MobileShell>
      <main>
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/games"
            aria-label="Back to games"
            className="tap-press flex size-12 items-center justify-center rounded-2xl bg-card text-primary"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-bold">Sequence Master — Level {level}</h1>
        </div>

        <SoftCard>
          <p className="text-center text-lg font-semibold text-primary">
            {phase === "watch"
              ? "Watch the pattern, then repeat"
              : phase === "repeat"
                ? "Your turn! Tap the sequence"
                : correct
                  ? "Correct!"
                  : "Try Again"}
          </p>

          <div
            className="mx-auto mt-5 grid gap-3"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: size * size }, (_, cell) => (
              <button
                key={cell}
                onClick={() => tap(cell)}
                disabled={phase !== "repeat"}
                aria-label={`Box ${cell + 1}`}
                className={`tap-press aspect-square rounded-2xl transition-opacity duration-300 ${tints[cell]} ${
                  flash === cell ? "opacity-100 ring-4 ring-primary" : "opacity-55"
                }`}
              />
            ))}
          </div>
        </SoftCard>

        {phase === "done" ? (
          <div className="mt-5 flex gap-3">
            {correct && level < 5 ? (
              <Button variant="gold" size="care" className="flex-1 font-bold" onClick={() => start(level + 1)}>
                Next Level
              </Button>
            ) : null}
            <Button
              variant="softOutline"
              size="care"
              className="flex-1 font-bold"
              onClick={() => start(correct && level >= 5 ? 1 : level)}
            >
              {correct && level >= 5 ? "Start Over" : "Retry"}
            </Button>
          </div>
        ) : null}

        <div
          className="mt-6 flex items-center justify-between rounded-3xl bg-card p-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <span className="text-lg font-semibold">Score</span>
          <Pill tone="gold">{score} points</Pill>
        </div>
      </main>
    </MobileShell>
  );
}
