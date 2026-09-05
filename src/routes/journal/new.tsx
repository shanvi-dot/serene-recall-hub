import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, Mic } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/journal/new")({
  head: () => ({
    meta: [
      { title: "Add a Memory — Lumen Care" },
      {
        name: "description",
        content:
          "Capture a new memory: add a photo, say or type what happened, note who was there and how it felt.",
      },
      { property: "og:title", content: "Add a Memory — Lumen Care" },
      {
        property: "og:description",
        content: "Add a photo, a short note, who was there and how the moment felt.",
      },
    ],
  }),
  component: NewMemory,
});

const feelings = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "neutral", emoji: "😌", label: "Calm" },
  { value: "sad", emoji: "😔", label: "Tender" },
] as const;

function NewMemory() {
  const navigate = useNavigate();
  const [feeling, setFeeling] = useState<string>("happy");
  const [photo, setPhoto] = useState<string | null>(null);

  return (
    <MobileShell>
      <main>
        <button
          type="button"
          onClick={() => navigate({ to: "/journal" })}
          className="mb-4 flex min-h-12 items-center gap-2 text-base font-semibold text-primary"
        >
          <ArrowLeft className="size-6" aria-hidden="true" /> Back to journal
        </button>

        <h1 className="mb-5 text-2xl font-bold text-foreground">Add a Memory</h1>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Memory saved to the journal");
            navigate({ to: "/journal" });
          }}
        >
          <SoftCard>
            <Label htmlFor="photo" className="text-base">
              Photo
            </Label>
            {photo ? (
              <img
                src={photo}
                alt="Selected memory photo"
                className="mt-3 h-44 w-full rounded-2xl object-cover"
              />
            ) : (
              <label
                htmlFor="photo"
                className="tap-press mt-3 flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-muted text-base font-semibold text-primary"
              >
                <Camera className="size-8" aria-hidden="true" />
                Take or choose a photo
              </label>
            )}
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto(URL.createObjectURL(file));
              }}
            />
          </SoftCard>

          <SoftCard>
            <Label htmlFor="story" className="text-base">
              What happened?
            </Label>
            <Textarea
              id="story"
              required
              rows={4}
              placeholder="We had tea in the garden with Mary…"
              className="mt-2 rounded-2xl bg-background text-base"
            />
            <button
              type="button"
              onClick={() => toast("Listening… speak when you're ready.")}
              className="tap-press mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-muted text-base font-semibold text-primary"
            >
              <Mic className="size-6" aria-hidden="true" /> Record with my voice
            </button>
          </SoftCard>

          <SoftCard className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="who" className="text-base">
                Who was there?
              </Label>
              <Input
                id="who"
                placeholder="Mary, Theo"
                className="min-h-14 rounded-2xl bg-background text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="where" className="text-base">
                Where were you?
              </Label>
              <Input
                id="where"
                placeholder="Home garden"
                className="min-h-14 rounded-2xl bg-background text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="when" className="text-base">
                When?
              </Label>
              <Input
                id="when"
                type="date"
                className="min-h-14 rounded-2xl bg-background text-base"
              />
            </div>
          </SoftCard>

          <SoftCard>
            <p className="text-base font-semibold text-foreground">How did it feel?</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {feelings.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={feeling === f.value}
                  onClick={() => setFeeling(f.value)}
                  className={`tap-press flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl text-base font-semibold ${
                    feeling === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {f.emoji}
                  </span>
                  {f.label}
                </button>
              ))}
            </div>
          </SoftCard>

          <Button type="submit" variant="gold" size="care" className="w-full font-bold">
            Save Memory
          </Button>
        </form>
      </main>
    </MobileShell>
  );
}
