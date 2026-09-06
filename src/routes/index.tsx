import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSession, type Role } from "@/lib/session";
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
  const { signIn } = useSession();
  const [role, setRole] = useState<Role>("patient");

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

        <form
          className="glass-card space-y-4 rounded-3xl p-6"
          onSubmit={(e) => {
            e.preventDefault();
            signIn(role);
            toast.success("Welcome back!");
            navigate({ to: role === "caregiver" ? "/caregiver" : "/dashboard" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-base">
              Email or phone
            </Label>
            <Input
              id="identifier"
              required
              placeholder="eleanor@example.com"
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
              className="min-h-14 rounded-2xl bg-card text-base"
            />
          </div>

          <div className="space-y-2">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="role"
                aria-label="Account type"
                className="min-h-14 rounded-2xl bg-card text-base"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient" className="text-base">
                  Patient
                </SelectItem>
                <SelectItem value="caregiver" className="text-base">
                  Caregiver
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={() => toast("We'll send a reset link to your email.")}
            className="text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            Forgot Password?
          </button>

          <Button type="submit" variant="gold" size="care" className="w-full font-bold">
            Log In
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
