import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, LogOut, Phone, ShieldCheck, Type, UserCog } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { patient } from "@/lib/care-data";
import { toast } from "sonner";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Lumen Care" },
      {
        name: "description",
        content:
          "Manage your Lumen Care profile: care circle contacts, reminder alerts, larger text and emergency help.",
      },
      { property: "og:title", content: "My Profile — Lumen Care" },
      {
        property: "og:description",
        content: "Care circle contacts, reminder alerts, larger text and emergency help.",
      },
    ],
  }),
  component: ProfileScreen,
});

const circle = [
  { name: "Mary Hayes", relation: "Daughter · Primary caregiver", phone: "07700 900123" },
  { name: "Robert Hayes", relation: "Son", phone: "07700 900456" },
  { name: "Dr. Amara Osei", relation: "GP", phone: "01273 900789" },
];

function ProfileScreen() {
  const navigate = useNavigate();
  const { role, signOut } = useSession();
  const [alerts, setAlerts] = useState(true);
  const [largeText, setLargeText] = useState(false);

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="My Profile" subtitle="Your details and preferences" />

        <SoftCard className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {patient.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{patient.fullName}</p>
            <p className="text-base text-muted-foreground">Patient ID {patient.id}</p>
            <div className="mt-2">
              <Pill tone="gold">Early stage care plan</Pill>
            </div>
          </div>
        </SoftCard>

        <section className="mt-5">
          <h2 className="mb-3 text-lg font-semibold text-foreground">My care circle</h2>
          <ul className="space-y-3">
            {circle.map((c) => (
              <li key={c.name}>
                <SoftCard className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.relation}</p>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    aria-label={`Call ${c.name}`}
                    className="tap-press flex size-14 items-center justify-center rounded-2xl bg-muted text-primary"
                  >
                    <Phone className="size-6" aria-hidden="true" />
                  </a>
                </SoftCard>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 space-y-3">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Preferences</h2>
          <SoftCard className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-base font-semibold text-foreground">
              <Bell className="size-6 text-primary" aria-hidden="true" /> Reminder alerts
            </span>
            <Switch
              checked={alerts}
              onCheckedChange={(v) => {
                setAlerts(v);
                toast(v ? "Reminder alerts on" : "Reminder alerts off");
              }}
              aria-label="Reminder alerts"
            />
          </SoftCard>
          <SoftCard className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-base font-semibold text-foreground">
              <Type className="size-6 text-primary" aria-hidden="true" /> Larger text
            </span>
            <Switch
              checked={largeText}
              onCheckedChange={(v) => {
                setLargeText(v);
                toast(v ? "Larger text on" : "Larger text off");
              }}
              aria-label="Larger text"
            />
          </SoftCard>
          <SoftCard className="flex items-center gap-3 text-base font-semibold text-foreground">
            <ShieldCheck className="size-6 text-primary" aria-hidden="true" /> Privacy &amp; data
          </SoftCard>
        </section>

        <Button
          variant="gold"
          size="care"
          className="mt-6 w-full font-bold"
          onClick={() => toast("Emergency contact called: Mary Hayes")}
        >
          Emergency help
        </Button>

        <Button
          variant="outline"
          size="care"
          className="mt-3 w-full font-bold"
          onClick={() => {
            signOut();
            toast("You've been signed out.");
            navigate({ to: "/" });
          }}
        >
          <LogOut className="size-6" aria-hidden="true" /> Log out
        </Button>
      </main>
    </MobileShell>
  );
}
