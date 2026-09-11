import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { hashPin } from "@/lib/pin";
import authBg from "@/assets/auth-dream.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Neuro Mitra account" },
      { name: "description", content: "Create a Neuro Mitra caregiver account and start capturing memories, playing gentle games and tracking daily care." },
      { property: "og:title", content: "Create your Neuro Mitra account" },
      { property: "og:description", content: "Set up your Neuro Mitra account in under a minute." },
    ],
  }),
  component: SignUpScreen,
});

function SignUpScreen() {
  const navigate = useNavigate();
  const { completeAuth } = useSession();
  const [step, setStep] = useState<1 | 2>(1);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [relation, setRelation] = useState("");
  const [patientName, setPatientName] = useState("");
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleStepOne(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStep(2);
  }

  async function handleStepTwo(e: FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits.");
      return;
    }
    setSubmitting(true);
    const pinHash = await hashPin(pin);
    const { error } = await supabase.rpc("create_family_account", {
      p_caregiver_name: caregiverName,
      p_relation: relation,
      p_patient_name: patientName,
      p_pin_hash: pinHash,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    completeAuth();
    toast.success("Account created. Welcome to Neuro Mitra!");
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <img src={authBg} alt="" width={768} height={1408} loading="lazy" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <h1 className="mb-5 text-center text-3xl font-bold text-primary-foreground drop-shadow">
          {step === 1 ? "Create your account" : "Tell us about you both"}
        </h1>

        {step === 1 ? (
          <form className="glass-card space-y-4 rounded-3xl p-6" onSubmit={handleStepOne}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-base">Password</Label>
              <Input id="new-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base" />
            </div>
            <Button type="submit" variant="gold" size="care" className="w-full font-bold" disabled={submitting}>
              {submitting ? "Creating account…" : "Continue"}
            </Button>
            <p className="text-center text-base text-foreground">
              Already have an account?{" "}
              <Link to="/" className="font-bold text-primary underline-offset-4 hover:underline">Log In</Link>
            </p>
          </form>
        ) : (
          <form className="glass-card space-y-4 rounded-3xl p-6" onSubmit={handleStepTwo}>
            <div className="space-y-2">
              <Label htmlFor="caregiver-name" className="text-base">Your full name</Label>
              <Input id="caregiver-name" required value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation" className="text-base">Your relation to the patient</Label>
              <Input id="relation" placeholder="e.g. Daughter" required value={relation} onChange={(e) => setRelation(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-name" className="text-base">Patient's full name</Label>
              <Input id="patient-name" required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-base">Set a caregiver PIN (4–6 digits)</Label>
              <Input id="pin" type="password" inputMode="numeric" maxLength={6} required value={pin} onChange={(e) => setPin(e.target.value)} className="min-h-14 rounded-2xl bg-card text-base tracking-widest" />
            </div>
            <Button type="submit" variant="gold" size="care" className="w-full font-bold" disabled={submitting}>
              {submitting ? "Setting up…" : "Finish setup"}
            </Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-base font-semibold text-primary underline-offset-4 hover:underline">
              Back
            </button>
          </form>
        )}
      </div>
    </main>
  );
}