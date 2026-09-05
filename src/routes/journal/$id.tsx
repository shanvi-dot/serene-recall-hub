import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MapPin, Users, Calendar } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { memories, sentimentLabel } from "@/lib/care-data";
import { toast } from "sonner";

export const Route = createFileRoute("/journal/$id")({
  loader: ({ params }) => {
    const memory = memories.find((m) => m.id === params.id);
    if (!memory) throw notFound();
    return { memory };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Memory not found — Lumen Care" }, { name: "robots", content: "noindex" }],
      };
    }
    const { memory } = loaderData;
    return {
      meta: [
        { title: `${memory.title} — Lumen Care Memory` },
        { name: "description", content: memory.description.slice(0, 155) },
        { property: "og:title", content: `${memory.title} — Lumen Care Memory` },
        { property: "og:description", content: memory.description.slice(0, 155) },
        { property: "og:image", content: memory.image },
        { name: "twitter:image", content: memory.image },
      ],
    };
  },
  component: MemoryDetail,
  notFoundComponent: MemoryNotFound,
});

function MemoryNotFound() {
  return (
    <MobileShell>
      <main className="text-center">
        <h1 className="text-2xl font-bold text-foreground">We couldn't find that memory</h1>
        <Link
          to="/journal"
          className="mt-6 inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground"
        >
          Back to journal
        </Link>
      </main>
    </MobileShell>
  );
}

function MemoryDetail() {
  const { memory } = Route.useLoaderData();
  const s = sentimentLabel[memory.sentiment];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = memory.quiz.filter((q, i) => answers[i] === q.answer).length;

  return (
    <MobileShell>
      <main>
        <Link
          to="/journal"
          className="mb-4 flex min-h-12 items-center gap-2 text-base font-semibold text-primary"
        >
          <ArrowLeft className="size-6" aria-hidden="true" /> Back to journal
        </Link>

        <img
          src={memory.image}
          alt={memory.title}
          className="h-56 w-full rounded-3xl object-cover"
          style={{ boxShadow: "var(--shadow-card)" }}
        />

        <div className="mt-5 flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-foreground">{memory.title}</h1>
          <span className="text-3xl" role="img" aria-label={s.label}>
            {s.emoji}
          </span>
        </div>
        <p className="mt-1 text-base text-muted-foreground">{s.label}</p>

        <SoftCard className="mt-5">
          <p className="text-base leading-relaxed text-foreground">{memory.description}</p>
          <ul className="mt-4 space-y-2 text-base text-foreground">
            <li className="flex items-center gap-3">
              <Calendar className="size-5 text-primary" aria-hidden="true" /> {memory.date}
            </li>
            <li className="flex items-center gap-3">
              <Users className="size-5 text-primary" aria-hidden="true" /> {memory.who}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-5 text-primary" aria-hidden="true" /> {memory.where}
            </li>
          </ul>
        </SoftCard>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Gentle recall quiz</h2>
            <Pill tone="success">
              {correct} of {memory.quiz.length}
            </Pill>
          </div>

          <div className="space-y-4">
            {memory.quiz.map((q, i) => (
              <SoftCard key={q.question}>
                <p className="text-base font-semibold text-foreground">{q.question}</p>
                <div className="mt-3 space-y-3">
                  {q.options.map((opt, oi) => {
                    const picked = answers[i] === oi;
                    const isCorrect = picked && oi === q.answer;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setAnswers((a) => ({ ...a, [i]: oi }));
                          toast(oi === q.answer ? "That's right!" : "Not quite — try again.");
                        }}
                        className={`tap-press flex min-h-14 w-full items-center justify-between rounded-2xl px-4 text-base font-semibold ${
                          isCorrect
                            ? "bg-success text-success-foreground"
                            : picked
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
              </SoftCard>
            ))}
          </div>

          {answered === memory.quiz.length ? (
            <Button
              variant="gold"
              size="care"
              className="mt-5 w-full font-bold"
              onClick={() => toast.success("Well done — quiz saved to your progress.")}
            >
              Finish quiz
            </Button>
          ) : null}
        </section>
      </main>
    </MobileShell>
  );
}
