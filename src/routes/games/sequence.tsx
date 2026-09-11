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
      { title: "Sequence Master — Neuro Mitra Game" },
      {
        name: "description",
        content:
          "Sequence Master: watch a soft colour pattern light up on the grid, then tap it back in the same order across five gentle levels.",
      },
      { property: "og:title", content: "Sequence Master — Neuro Mitra Game" },
      {
        property: "og:description",
        content: "Watch a colour pattern on the grid, then tap it back in order.",
      },
    ],
  }),
  component: SequenceGame,
});

/**
 * Distinct, high-contrast colours — one per box, never repeated in a round.
 * Rounds 1–2 use the first 9; later rounds add clearly different dark/light
 * shades (dark green vs light green, navy vs sky) so elderly users can tell
 * every box apart.
 */
const tints = [
  "bg-red-600",
  "bg-blue-700",
  "bg-yellow-400",
  "bg-pink-500",
  "bg-green-600",
  "bg-orange-500",
  "bg-purple-700",
  "bg-teal-600",
  "bg-rose-800",
  "bg-sky-400",
  "bg-amber-600",
  "bg-fuchsia-400",
  "bg-green-900",
  "bg-lime-500",
  "bg-indigo-500",
  "bg-cyan-700",
];

/** Level 1 starts with four boxes; each level adds more boxes to remember. */
const levelBoxes = [4, 6, 9, 12, 16];
const levelColumns = [2, 3, 3, 4, 4];

function boxCount(level: number) {
  return levelBoxes[Math.min(level, levelBoxes.length) - 1] ?? 4;
}

function columnCount(level: number) {
  return levelColumns[Math.min(level, levelColumns.length) - 1] ?? 2;
}

function makePattern(level: number) {
  const cells = boxCount(level);
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
    setFlash(pattern[0] ?? null);
    const id = setInterval(() => {
      i += 1;
      if (i >= pattern.length) {
        clearInterval(id);
        setFlash(null);
        setPhase("repeat");
        return;
      }
      setFlash(pattern[i] ?? null);
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

  const boxes = boxCount(level);
  const columns = columnCount(level);

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
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: boxes }, (_, cell) => (
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
