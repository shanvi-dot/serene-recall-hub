import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MobileShell, ScreenHeader } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/session";
import { hashPin, MAX_PIN_ATTEMPTS } from "@/lib/pin";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/caregiver/unlock")({
  component: CaregiverUnlock,
});

function CaregiverUnlock() {
  const navigate = useNavigate();
  const { setView } = useSession();
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    const { data, error } = await supabase.from("caregivers").select("pin_hash").maybeSingle();
    const entered = await hashPin(pin);
    setChecking(false);

    if (!error && data?.pin_hash === entered) {
      setView("caregiver");
      navigate({ to: "/caregiver" });
      return;
    }

    const next = attempts + 1;
    setAttempts(next);
    setPin("");
    if (next >= MAX_PIN_ATTEMPTS) {
      navigate({ to: "/dashboard", replace: true }); // silent, no error shown
    }
  }

  return (
    <MobileShell>
      <main>
        <ScreenHeader title="Caregiver Access" subtitle="Enter your PIN" />
        <form onSubmit={submit} className="glass-card space-y-4 rounded-3xl p-6">
          <Input
            type="password"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            aria-label="Enter PIN"
            className="min-h-14 rounded-2xl bg-card text-center text-2xl tracking-widest"
          />
          <Button type="submit" variant="gold" size="care" className="w-full font-bold" disabled={checking}>
            {checking ? "Checking…" : "Unlock"}
          </Button>
        </form>
      </main>
    </MobileShell>
  );
}