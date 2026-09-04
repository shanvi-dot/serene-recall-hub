import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reminders as seed } from "@/lib/care-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Daily Reminders — Lumen Care" },
      {
        name: "description",
        content:
          "Gentle daily reminders for medication, water, meals and family calls, with big tap targets and a single on/off switch.",
      },
      { property: "og:title", content: "Daily Reminders — Lumen Care" },
      {
        property: "og:description",
        content: "Medication, water, meals and family calls — gently reminded, easily ticked off.",
      },
    ],
  }),
  component: RemindersScreen,
});

function RemindersScreen() {
  const [on, setOn] = useState(true);
  const [items, setItems] = useState(seed);
  const [adding, setAdding] = useState(false);

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="Daily Reminders" subtitle="Small nudges through the day" />

        <SoftCard className="mb-5">
          <Label htmlFor="all-reminders" className="flex items-center justify-between text-lg font-semibold">
            Reminders {on ? "On" : "Off"}
            <Switch
              id="all-reminders"
              checked={on}
              onCheckedChange={(v) => {
                setOn(v);
                toast(v ? "Reminders turned on" : "Reminders paused");
              }}
            />
          </Label>
        </SoftCard>

        <ul className="space-y-3">
          {items.map((r) => (
            <li key={r.id}>
              <SoftCard className={on ? "" : "opacity-60"}>
                <Label
                  htmlFor={`rem-${r.id}`}
                  className="flex items-center gap-4 text-base font-normal"
                >
                  <span className="w-16 text-lg font-bold text-primary">{r.time}</span>
                  <span className={`flex-1 text-base ${r.done ? "line-through text-muted-foreground" : ""}`}>
                    {r.text}
                  </span>
                  <Checkbox
                    id={`rem-${r.id}`}
                    checked={r.done}
                    disabled={!on}
                    className="size-7"
                    onCheckedChange={(v) =>
                      setItems((prev) =>
                        prev.map((p) => (p.id === r.id ? { ...p, done: v === true } : p)),
                      )
                    }
                  />
                </Label>
              </SoftCard>
            </li>
          ))}
        </ul>

        {adding ? (
          <SoftCard className="mt-5">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                setItems((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    time: String(form.get("time") || "09:00"),
                    text: String(form.get("text") || "New reminder"),
                    done: false,
                  },
                ]);
                setAdding(false);
                toast.success("Reminder added");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="time" className="text-base">
                  Time
                </Label>
                <Input id="time" name="time" type="time" required className="min-h-14 rounded-2xl text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text" className="text-base">
                  Reminder
                </Label>
                <Input
                  id="text"
                  name="text"
                  required
                  placeholder="Take medication"
                  className="min-h-14 rounded-2xl text-base"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="care" size="care" className="flex-1 font-bold">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="softOutline"
                  size="care"
                  className="flex-1"
                  onClick={() => setAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </SoftCard>
        ) : (
          <Button
            variant="gold"
            size="care"
            className="mt-5 w-full font-bold"
            onClick={() => setAdding(true)}
          >
            <Plus aria-hidden="true" /> Add Reminder
          </Button>
        )}
      </main>
    </MobileShell>
  );
}
