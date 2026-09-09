import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import authBg from "@/assets/auth-dream.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen Care — Gentle Dementia Care Companion" },
      {
        name: "description",
        content:
          "Sign in to Lumen Care: memory games, a photo journal, daily reminders and caregiver insights designed for people living with dementia.",
      },
      { property: "og:title", content: "Lumen Care — Gentle Dementia Care Companion" },
      {
        property: "og:description",
        content:
          "Memory games, a photo journal, daily reminders and caregiver insights, in one calm app.",
      },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const { completeAuth } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    completeAuth();
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <img
        src={authBg}
        alt=""
        width={768}
        height={1408}
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-primary-foreground drop-shadow">Welcome to</p>
          <h1 className="text-4xl font-bold text-primary-foreground drop-shadow">Lumen Care</h1>
          <p className="mt-2 text-base text-primary-foreground/90 drop-shadow">
            A calm place for memories, gentle games and daily care.
          </p>
        </div>

        <form className="glass-card space-y-4 rounded-3xl p-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-base">
              Email or phone
            </Label>
            <Input
              id="identifier"
              required
              placeholder="eleanor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-14 rounded-2xl bg-card text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-14 rounded-2xl bg-card text-base"
            />
          </div>

          <button
            type="button"
            onClick={() => toast("We'll send a reset link to your email.")}
            className="text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            Forgot Password?
          </button>

          <Button type="submit" variant="gold" size="care" className="w-full font-bold" disabled={submitting}>
            {submitting ? "Logging in…" : "Log In"}
          </Button>

          <p className="text-center text-base text-foreground">
            New here?{" "}
            <Link to="/signup" className="font-bold text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}