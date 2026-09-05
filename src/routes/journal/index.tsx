import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { memories, sentimentLabel } from "@/lib/care-data";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Memory Journal — Lumen Care" },
      {
        name: "description",
        content:
          "A gentle photo journal of recent moments: who was there, where it happened and how it felt.",
      },
      { property: "og:title", content: "Memory Journal — Lumen Care" },
      {
        property: "og:description",
        content: "Photos and short notes of recent moments, kept simple and calm.",
      },
    ],
  }),
  component: JournalList,
});

function JournalList() {
  return (
    <MobileShell>
      <main>
        <ScreenHeader
          title="Memory Journal"
          subtitle="Moments worth keeping"
          action={
            <Link
              to="/journal/new"
              className="tap-press flex min-h-14 min-w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
              aria-label="Add a new memory"
            >
              <Plus className="size-7" aria-hidden="true" />
            </Link>
          }
        />

        <ul className="space-y-4">
          {memories.map((m) => {
            const s = sentimentLabel[m.sentiment];
            return (
              <li key={m.id}>
                <Link to="/journal/$id" params={{ id: m.id }} className="block tap-press">
                  <SoftCard className="p-0 overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-semibold text-foreground">{m.title}</h2>
                        <span className="text-2xl" role="img" aria-label={s.label}>
                          {s.emoji}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{m.date}</p>
                      <p className="mt-2 line-clamp-2 text-base text-foreground">{m.description}</p>
                    </div>
                  </SoftCard>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </MobileShell>
  );
}
