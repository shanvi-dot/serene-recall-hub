import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { memories } from "@/lib/care-data";
import { toast } from "sonner";

export const Route = createFileRoute("/journal/quiz")({
  head: () => ({
    meta: [
      { title: "Weekly Memory Quiz — Neuro Mitra" },
      {
        name: "description",
        content:
          "A gentle end-of-week quiz about the memories saved this week, one calm question at a time.",
      },
      { property: "og:title", content: "Weekly Memory Quiz — Neuro Mitra" },
      {
        property: "og:description",
        content: "One gentle question at a time about this week's memories.",
      },
    ],
  }),
  component: WeeklyQuiz,
});

type Item = {
  memoryId: string;
  memoryTitle: string;
  image: string;
  question: string;
  options: string[];
  answer: number;
};

const items: Item[] = memories.flatMap((m) =>
  m.quiz.map((q) => ({
    memoryId: m.id,
    memoryTitle: m.title,
    image: m.image,
    question: q.question,
    options: q.options,
    answer: q.answer,
  })),
);

function WeeklyQuiz() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[step]!;
  const total = items.length;

  function choose(oi: number) {
    if (picked !== null) return;
    setPicked(oi);
    const right = oi === item.answer;
    if (right) setScore((s) => s + 1);
    toast(right ? "That's right!" : "Not quite — that's alright.");
  }

  function next() {
    if (step + 1 >= total) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
  }

  function restart() {
    setStep(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  return (
    <MobileShell>
      <main>
        <Link
          to="/journal"
          className="mb-4 flex min-h-12 items-center gap-2 text-base font-semibold text-primary"
        >
          <ArrowLeft className="size-6" aria-hidden="true" /> Back to journal
        </Link>

        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Weekly quiz</h1>
            <p className="mt-1 text-base text-muted-foreground">
              A gentle look back at this week's memories
            </p>
          </div>
          <Pill tone="success">
            {score} of {total}
          </Pill>
        </div>

        {done ? (
          <SoftCard className="text-center">
            <p className="text-5xl" role="img" aria-label="Well done">
              🌷
            </p>
            <h2 className="mt-3 text-xl font-bold text-foreground">Quiz finished</h2>
            <p className="mt-2 text-base text-foreground">
              You remembered {score} of {total} today. Every one counts.
            </p>
            <Button variant="gold" size="care" className="mt-5 w-full font-bold" onClick={restart}>
              <RotateCcw className="size-5" aria-hidden="true" /> Take it again
            </Button>
            <Link
              to="/journal"
              className="tap-press mt-3 flex min-h-14 items-center justify-center rounded-2xl bg-muted text-base font-semibold text-primary"
            >
              Back to memories
            </Link>
          </SoftCard>
        ) : (
          <>
            <div
              className="mb-5 h-3 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={step + 1}
              aria-label={`Question ${step + 1} of ${total}`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((step + 1) / total) * 100}%` }}
              />
            </div>

            <SoftCard className="overflow-hidden p-0">
              <img
                src={item.image}
                alt={item.memoryTitle}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-sm text-muted-foreground">
                  Question {step + 1} of {total} · {item.memoryTitle}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.question}</p>

                <div className="mt-4 space-y-3">
                  {item.options.map((opt, oi) => {
                    const isPicked = picked === oi;
                    const isCorrect = picked !== null && oi === item.answer;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => choose(oi)}
                        className={`tap-press flex min-h-14 w-full items-center justify-between rounded-2xl px-4 text-base font-semibold ${
                          isCorrect
                            ? "bg-success text-success-foreground"
                            : isPicked
                              ? "bg-destructive/40 text-foreground"
                              : "bg-muted text-foreground"
                        }`}
                      >
                        {opt}
                        {isCorrect ? <Check className="size-6" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </SoftCard>

            {picked !== null ? (
              <Button variant="gold" size="care" className="mt-5 w-full font-bold" onClick={next}>
                {step + 1 >= total ? "See my result" : "Next question"}
              </Button>
            ) : null}
          </>
        )}
      </main>
    </MobileShell>
  );
}
