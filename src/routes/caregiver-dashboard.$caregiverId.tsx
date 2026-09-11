import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { supabase } from "@/integrations/supabase/client";
import { greeting, todayLabel } from "@/lib/care-data";

export const Route = createFileRoute("/caregiver-dashboard/$caregiverId")({
  head: () => ({
    meta: [
      { title: "Caregiver Dashboard — Neuro Mitra" },
      { name: "description", content: "Caregiver view of Neuro Mitra." },
    ],
  }),
  component: CaregiverDashboard,
});

function CaregiverDashboard() {
  const { caregiverId } = useParams({ from: "/caregiver-dashboard/$caregiverId" });
  const [caregiverName, setCaregiverName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("caregivers")
        .select("name")
        .eq("id", caregiverId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching caregiver name:", error);
      }
      setCaregiverName(data?.name ?? null);
      setLoading(false);
    }
    load();
  }, [caregiverId]);

  return (
    <MobileShell>
      <main>
        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-5" aria-hidden="true" /> Back to profile
        </Link>

        <header className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {loading ? "…" : (caregiverName ?? "?").charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {loading ? (
                <>{greeting()}…</>
              ) : (
                <>
                  {greeting()}, {caregiverName ?? "there"}
                </>
              )}
            </h1>
            <p className="text-base text-muted-foreground">{todayLabel()}</p>
          </div>
        </header>

        <SoftCard>
          <p className="text-base text-foreground">
            This is your caregiver dashboard. Caregiver-specific tools (insights, editing
            reminders, reviewing progress) can be added here.
          </p>
        </SoftCard>
      </main>
    </MobileShell>
  );
}