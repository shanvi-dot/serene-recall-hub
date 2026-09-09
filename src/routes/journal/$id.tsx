import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Users, Calendar } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { memories, sentimentLabel } from "@/lib/care-data";

export const Route = createFileRoute("/journal/$id")({
  loader: ({ params }) => {
    const memory = memories.find((m) => m.id === params.id);
    if (!memory) throw notFound();
    return { memory };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Memory not found — Neuro Mitra" }, { name: "robots", content: "noindex" }],
      };
    }
    const { memory } = loaderData;
    return {
      meta: [
        { title: `${memory.title} — Neuro Mitra Memory` },
        { name: "description", content: memory.description.slice(0, 155) },
        { property: "og:title", content: `${memory.title} — Neuro Mitra Memory` },
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
          <SoftCard>
            <h2 className="text-lg font-semibold text-foreground">Weekly quiz</h2>
            <p className="mt-1 text-base text-muted-foreground">
              Questions about this memory now come up in the gentle end-of-week quiz.
            </p>
            <Link
              to="/journal/quiz"
              className="tap-press mt-4 flex min-h-14 items-center justify-center rounded-2xl bg-muted text-base font-semibold text-primary"
            >
              Go to weekly quiz
            </Link>
          </SoftCard>
        </section>
      </main>
    </MobileShell>
  );
}
