import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, LogOut, Mail, Phone, ShieldCheck, UserCog } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { caregiver, patient } from "@/lib/care-data";
import { useSession } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/caregiver/profile")({
  head: () => ({
    meta: [
      { title: "Caregiver Profile — Lumen Care" },
      {
        name: "description",
        content:
          "Your caregiver account: the person you care for, alert preferences, weekly summaries and account controls.",
      },
      { property: "og:title", content: "Caregiver Profile — Lumen Care" },
      {
        property: "og:description",
        content: "Your caregiver account, alert preferences and weekly summaries.",
      },
    ],
  }),
  component: CaregiverProfile,
});

function CaregiverProfile() {
  const navigate = useNavigate();
  const { role, signIn, signOut } = useSession();
  const [alerts, setAlerts] = useState(true);
  const [weekly, setWeekly] = useState(true);

  useEffect(() => {
    if (role !== "caregiver") signIn("caregiver");
  }, [role, signIn]);

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="My Profile" subtitle="Your caregiver account" />

        <SoftCard className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {caregiver.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{caregiver.fullName}</p>
            <p className="text-base text-muted-foreground">{caregiver.relation}</p>
            <div className="mt-2">
              <Pill tone="gold">Caregiver account</Pill>
            </div>
          </div>
        </SoftCard>

        <SoftCard className="mt-4">
          <h2 className="text-lg font-semibold text-foreground">Caring for</h2>
          <p className="mt-1 text-base text-foreground">
            {patient.fullName} · ID {patient.id}
          </p>
          <Link to="/caregiver" className="mt-3 block">
            <Button variant="care" size="care" className="w-full font-bold">
              <UserCog className="size-6" aria-hidden="true" /> Open care dashboard
            </Button>
          </Link>
        </SoftCard>

        <section className="mt-5">
          <h2 className="mb-3 text-lg font-semibold text-foreground">My contact details</h2>
          <ul className="space-y-3">
            <li>
              <SoftCard className="flex items-center justify-between gap-3">
                <span className="text-base text-foreground">{caregiver.phone}</span>
                <a
                  href={`tel:${caregiver.phone.replace(/\s/g, "")}`}
                  aria-label="Call my number"
                  className="tap-press flex size-14 items-center justify-center rounded-2xl bg-muted text-primary"
                >
                  <Phone className="size-6" aria-hidden="true" />
                </a>
              </SoftCard>
            </li>
            <li>
              <SoftCard className="flex items-center gap-3">
                <Mail className="size-6 text-primary" aria-hidden="true" />
                <span className="text-base text-foreground">{caregiver.email}</span>
              </SoftCard>
            </li>
          </ul>
        </section>

        <section className="mt-5 space-y-3">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Preferences</h2>
          <SoftCard className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-base font-semibold text-foreground">
              <Bell className="size-6 text-primary" aria-hidden="true" /> Missed reminder alerts
            </span>
            <Switch
              checked={alerts}
              onCheckedChange={(v) => {
                setAlerts(v);
                toast(v ? "Alerts on" : "Alerts off");
              }}
              aria-label="Missed reminder alerts"
            />
          </SoftCard>
          <SoftCard className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3 text-base font-semibold text-foreground">
              <ShieldCheck className="size-6 text-primary" aria-hidden="true" /> Weekly summary email
            </span>
            <Switch
              checked={weekly}
              onCheckedChange={(v) => {
                setWeekly(v);
                toast(v ? "Weekly summary on" : "Weekly summary off");
              }}
              aria-label="Weekly summary email"
            />
          </SoftCard>
        </section>

        <Button
          variant="outline"
          size="care"
          className="mt-6 w-full font-bold"
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
