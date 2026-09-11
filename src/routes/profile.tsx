import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard, Pill } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { patient } from "@/lib/care-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Neuro Mitra" },
      {
        name: "description",
        content:
          "Manage your Neuro Mitra profile: caregiver access, reminder alerts, larger text and emergency help.",
      },
      { property: "og:title", content: "My Profile — Neuro Mitra" },
      {
        property: "og:description",
        content: "Caregiver access, reminder alerts, larger text and emergency help.",
      },
    ],
  }),
  component: ProfileScreen,
});

type CaregiverRow = { id: string; name: string };

function ProfileScreen() {
  const navigate = useNavigate();
  const { signOut } = useSession();
  const [alerts, setAlerts] = useState(true);
  const [caregivers, setCaregivers] = useState<CaregiverRow[]>([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingCaregivers(false);
        return;
      }

      const { data: myCaregiverRow, error: myCaregiverError } = await supabase
        .from("caregivers")
        .select("family_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (myCaregiverError) {
        console.error("Error fetching current caregiver:", myCaregiverError);
      }

      if (!myCaregiverRow) {
        setLoadingCaregivers(false);
        return;
      }

      const { data: caregiverRows, error: caregiverRowsError } = await supabase
        .from("caregivers")
        .select("id, name")
        .eq("family_id", myCaregiverRow.family_id)
        .order("created_at", { ascending: true });

      if (caregiverRowsError) {
        console.error("Error fetching family caregivers:", caregiverRowsError);
      }

      setCaregivers(caregiverRows ?? []);
      setLoadingCaregivers(false);
    }
    load();
  }, []);

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
          <h2 className="mb-3 text-lg font-semibold text-foreground">Caregiver</h2>
          {loadingCaregivers ? (
            <p className="text-base text-muted-foreground">Loading…</p>
          ) : caregivers.length === 0 ? (
            <p className="text-base text-muted-foreground">No caregiver found for this account.</p>
          ) : (
            <ul className="space-y-3">
              {caregivers.map((c) => (
                <li key={c.id}>
                  <SoftCard className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {c.name.charAt(0)}
                      </div>
                      <p className="text-base font-semibold text-foreground">{c.name}</p>
                    </div>
                    <Link
                      to="/caregiver-unlock/$caregiverId"
                      params={{ caregiverId: c.id }}
                      className="tap-press flex min-h-12 items-center gap-1 rounded-2xl bg-muted px-4 text-base font-semibold text-primary"
                    >
                      Open <ChevronRight className="size-5" aria-hidden="true" />
                    </Link>
                  </SoftCard>
                </li>
              ))}
            </ul>
          )}
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

          <SoftCard className="flex items-center gap-3 text-base font-semibold text-foreground">
            <ShieldCheck className="size-6 text-primary" aria-hidden="true" /> Privacy &amp; data
          </SoftCard>
        </section>

        <Button
          variant="gold"
          size="care"
          className="mt-6 w-full font-bold"
          onClick={() => toast("Emergency contact called.")}
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