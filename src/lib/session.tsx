import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "patient" | "caregiver";

const ROLE_KEY = "lumen.session.role";

/** Storage prefix so patient and caregiver state never share a key. */
export function scopeKey(role: Role, name: string) {
  return `lumen.state.${role}.${name}`;
}

function clearScope(role: Role) {
  if (typeof window === "undefined") return;
  const prefix = `lumen.state.${role}.`;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(prefix))
    .forEach((k) => window.localStorage.removeItem(k));
}

type SessionValue = {
  role: Role;
  hydrated: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("patient");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(ROLE_KEY);
    if (stored === "caregiver" || stored === "patient") setRole(stored);
    setHydrated(true);
  }, []);

  const signIn = useCallback((next: Role) => {
    // Signing in as one role wipes any leftover scratch state of the other.
    clearScope(next === "patient" ? "caregiver" : "patient");
    window.localStorage.setItem(ROLE_KEY, next);
    setRole(next);
  }, []);

  const signOut = useCallback(() => {
    clearScope("patient");
    clearScope("caregiver");
    window.localStorage.removeItem(ROLE_KEY);
    setRole("patient");
  }, []);

  const value = useMemo(
    () => ({ role, hydrated, signIn, signOut }),
    [role, hydrated, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

/** Where "home" is for the signed-in role. */
export function useHome() {
  const { role } = useSession();
  return role === "caregiver" ? ("/caregiver" as const) : ("/dashboard" as const);
}
