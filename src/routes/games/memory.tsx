import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/games/memory")({
  head: () => ({
    meta: [
      { title: "Memory Match — Lumen Care Game" },
      {
        name: "description",
        content:
          "Memory Match: watch a short sequence of familiar objects, then tap them back in order. Five gentle difficulty levels.",
      },
      { property: "og:title", content: "Memory Match — Lumen Care Game" },
      {
        property: "og:description",
        content: "Watch a sequence of familiar objects, then tap them back in order.",
      },
    ],
  }),
  component: MemoryGame,
});

const objects = [
  { id: "mango", emoji: "🥭", label: "Mango" },
  { id: "banana", emoji: "🍌", label: "Banana" },
  { id: "apple", emoji: "🍎", label: "Apple" },
  { id: "grapes", emoji: "🍇", label: "Grapes" },
  { id: "lemon", emoji: "🍋", label: "Lemon" },
  { id: "cherry", emoji: "🍒", label: "Cherries" },
];

function makeSequence(level: number) {
  const length = level + 1;
  const pool = [...objects].sort(() => Math.random() - 0.5);
  return Array.from({ length }, (_, i) => pool[i % pool.length].id);
}

function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState(() => makeSequence(1));
  const [phase, setPhase] = useState<"watch" | "recall" | "done">("watch");
  const [picked, setPicked] = useState<string[]>([]);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (phase !== "watch") return;
    const t = setTimeout(() => setPhase("recall"), 5000);
    return () => clearTimeout(t);
  }, [phase, sequence]);

  function start(nextLevel: number) {
    setLevel(nextLevel);
    setSequence(makeSequence(nextLevel));
    setPicked([]);
    setPhase("watch");
  }

  function pick(id: string) {
    const next = [...picked, id];
    setPicked(next);
    if (next.length === sequence.length) {
      const ok = next.every((v, i) => v === sequence[i]);
      setCorrect(ok);
      setPhase("done");
      if (ok) {
        setScore((s) => s + level * 20);
        toast.success("Correct! Beautifully done.");
      } else {
        toast("Not quite — let's try that again.");
      }
    }
  }

  const choices = objects.slice(0, 4).map((o) => o.id).includes(sequence[0])
    ? objects.slice(0, 4)
    : objects.slice(0, 4);

  const choiceSet = Array.from(new Set([...sequence, ...objects.map((o) => o.id)])).slice(0, 4);

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
          <h1 className="text-xl font-bold">Memory Match — Level {level}</h1>
        </div>

        <SoftCard className="text-center">
          <p className="text-lg font-semibold text-primary">
            {phase === "watch"
              ? "Watch and remember…"
              : phase === "recall"
                ? "Now choose the sequence"
                : correct
                  ? "Correct!"
                  : "Try Again"}
          </p>

          <div className="mt-5 flex min-h-32 flex-wrap items-center justify-center gap-4">
            {phase === "watch" ? (
              sequence.map((id, i) => (
                <span key={`${id}-${i}`} className="text-5xl" aria-hidden="true">
                  {objects.find((o) => o.id === id)!.emoji}
                </span>
              ))
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {picked.length === 0 ? (
                  <span className="text-base text-muted-foreground">
                    Tap the objects in the order you saw them.
                  </span>
                ) : (
                  picked.map((id, i) => (
                    <span key={`${id}-${i}`} className="text-4xl" aria-hidden="true">
                      {objects.find((o) => o.id === id)!.emoji}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
        </SoftCard>

        {phase === "recall" ? (
          <div className="mt-5 grid grid-cols-2 gap-4">
            {choiceSet.map((id) => {
              const obj = objects.find((o) => o.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => pick(id)}
                  className="tap-press flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl bg-card text-lg font-semibold text-foreground"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <span className="text-4xl" aria-hidden="true">
                    {obj.emoji}
                  </span>
                  {obj.label}
                </button>
              );
            })}
          </div>
        ) : null}

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

        <div className="mt-6 flex items-center justify-between rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
          <span className="text-lg font-semibold">Score</span>
          <Pill tone="gold">{score} points</Pill>
        </div>
        <span className="sr-only">{choices.length} choices available</span>
      </main>
    </MobileShell>
  );
}
