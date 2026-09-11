import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/caregiver-unlock/$caregiverId")({
  head: () => ({
    meta: [
      { title: "Caregiver PIN — Neuro Mitra" },
      { name: "description", content: "Enter your caregiver PIN to open your dashboard." },
    ],
  }),
  component: CaregiverUnlockScreen,
});

function CaregiverUnlockScreen() {
  const { caregiverId } = useParams({ from: "/caregiver-unlock/$caregiverId" });
  const navigate = useNavigate();
  const [caregiverName, setCaregiverName] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    async function loadCaregiver() {
      const { data, error } = await supabase
        .from("caregivers")
        .select("name")
        .eq("id", caregiverId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching caregiver name:", error);
      }
      setCaregiverName(data?.name ?? null);
      setLoadingName(false);
    }
    loadCaregiver();
  }, [caregiverId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits.");
      return;
    }

    setSubmitting(true);
    const { data: isValid, error } = await supabase.rpc("verify_caregiver_pin_by_id", {
      p_caregiver_id: caregiverId,
      p_pin: pin,
    });
    setSubmitting(false);

    if (error) {
      console.error("Error verifying PIN:", error);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (!isValid) {
      toast.error("Incorrect PIN. Please try again.");
      setPin("");
      return;
    }

    navigate({ to: "/caregiver-dashboard/$caregiverId", params: { caregiverId } });
  }

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="Caregiver Access" subtitle="Enter your PIN to continue" />

        <SoftCard className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {loadingName ? "…" : (caregiverName ?? "?").charAt(0)}
          </div>
          <p className="text-lg font-semibold text-foreground">
            {loadingName ? "Loading…" : caregiverName ?? "Caregiver not found"}
          </p>
        </SoftCard>

        <form className="glass-card mt-5 space-y-4 rounded-3xl p-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="unlock-pin" className="text-base">
              Caregiver PIN
            </Label>
            <Input
              id="unlock-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="min-h-14 rounded-2xl bg-card text-center text-2xl tracking-[0.5em]"
            />
          </div>

          <Button type="submit" variant="gold" size="care" className="w-full font-bold" disabled={submitting || !caregiverName}>
            {submitting ? "Checking…" : "Unlock"}
          </Button>

          <Link
            to="/profile"
            className="block w-full text-center text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            Back to profile
          </Link>
        </form>
      </main>
    </MobileShell>
  );
}