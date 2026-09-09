import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * "view" replaces the old "role". There is only ONE real account type now
 * (caregiver, via Supabase Auth — wired in later). "view" just controls
 * which screens are showing on this device right now.
 * - "patient": default, shown day-to-day
 * - "caregiver": unlocked via PIN in Settings > Caregiver Profile
 */
export type View = "patient" | "caregiver";

const AUTH_KEY = "lumen.session.authenticated";
const VIEW_KEY = "lumen.session.view";

export function scopeKey(view: View, name: string) {
  return `lumen.state.${view}.${name}`;
}

function clearScope(view: View) {
  if (typeof window === "undefined") return;
  const prefix = `lumen.state.${view}.`;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(prefix))
    .forEach((k) => window.localStorage.removeItem(k));
}

type SessionValue = {
  isAuthenticated: boolean;
  view: View;
  hydrated: boolean;
  /** Call once signup/login succeeds. Logs the device in, shows patient view. */
  completeAuth: () => void;
  /** Switch this device's current view. Does NOT re-authenticate. */
  setView: (view: View) => void;
  /** Full sign-out — back to the login screen. */
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setViewState] = useState<View>("patient");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const authed = window.localStorage.getItem(AUTH_KEY) === "true";
    const storedView = window.localStorage.getItem(VIEW_KEY);
    setIsAuthenticated(authed);
    if (storedView === "caregiver" || storedView === "patient") setViewState(storedView);
    setHydrated(true);
  }, []);

  const completeAuth = useCallback(() => {
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem(VIEW_KEY, "patient");
    setIsAuthenticated(true);
    setViewState("patient");
  }, []);

  const setView = useCallback((next: View) => {
    window.localStorage.setItem(VIEW_KEY, next);
    setViewState(next);
  }, []);

  const signOut = useCallback(() => {
    clearScope("patient");
    clearScope("caregiver");
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(VIEW_KEY);
    setIsAuthenticated(false);
    setViewState("patient");
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, view, hydrated, completeAuth, setView, signOut }),
    [isAuthenticated, view, hydrated, completeAuth, setView, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}