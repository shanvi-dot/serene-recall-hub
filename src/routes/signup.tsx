import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSession, type Role } from "@/lib/session";
import authBg from "@/assets/auth-dream.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Lumen Care account" },
      {
        name: "description",
        content:
          "Create a Lumen Care account as a patient or caregiver and start capturing memories, playing gentle games and tracking daily care.",
      },
      { property: "og:title", content: "Create your Lumen Care account" },
      {
        property: "og:description",
        content: "Join Lumen Care as a patient or caregiver in under a minute.",
      },
    ],
  }),
  component: SignUpScreen,
});

function SignUpScreen() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [role, setRole] = useState<Role>("patient");
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <img
        src={authBg}
        alt=""
        width={768}
        height={1408}
        loading="lazy"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <h1 className="mb-5 text-center text-3xl font-bold text-primary-foreground drop-shadow">
          Create your account
        </h1>

        <form
          className="glass-card space-y-4 rounded-3xl p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!agreed) {
              toast.error("Please accept the Terms & Privacy Policy.");
              return;
            }
            signIn(role);
            toast.success("Account created. Welcome to Lumen Care!");
            navigate({ to: role === "caregiver" ? "/caregiver" : "/dashboard" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Full name
            </Label>
            <Input id="name" required className="min-h-14 rounded-2xl bg-card text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="min-h-14 rounded-2xl bg-card text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-base">
              Password
            </Label>
            <Input
              id="new-password"
              type="password"
              required
              className="min-h-14 rounded-2xl bg-card text-base"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-base font-medium">I am signing up as</legend>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as Role)} className="grid grid-cols-2 gap-3">
              {[
                { value: "patient", label: "Patient" },
                { value: "caregiver", label: "Caregiver" },
              ].map((o) => (
                <Label
                  key={o.value}
                  htmlFor={`role-${o.value}`}
                  className={`tap-press flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-card px-4 text-base font-semibold ${
                    role === o.value ? "border-primary text-primary" : "border-border text-foreground"
                  }`}
                >
                  <RadioGroupItem id={`role-${o.value}`} value={o.value} />
                  {o.label}
                </Label>
              ))}
            </RadioGroup>
          </fieldset>

          {role === "caregiver" ? (
            <div className="space-y-2">
              <Label htmlFor="patient-id" className="text-base">
                Patient name or ID
              </Label>
              <Input
                id="patient-id"
                placeholder="Eleanor Hayes or PT-1042"
                className="min-h-14 rounded-2xl bg-card text-base"
              />
            </div>
          ) : null}

          <Label
            htmlFor="terms"
            className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4 text-base leading-relaxed"
          >
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-1 size-6"
            />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </Label>

          <Button type="submit" variant="gold" size="care" className="w-full font-bold">
            Sign Up
          </Button>

          <p className="text-center text-base text-foreground">
            Already have an account?{" "}
            <Link to="/" className="font-bold text-primary underline-offset-4 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
