import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { MobileProfile } from "@/types/domain";

type AuthStatus = "loading" | "unauthenticated" | "authenticated" | "admin_rejected";

export type SignInResult =
  | { status: "success" }
  | { status: "admin_rejected" }
  | { status: "error"; message: string };

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  profile: MobileProfile | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  /** Clears the one-shot "admin_rejected" status after the login screen has shown its message. */
  acknowledgeAdminRejection: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, created_at")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MobileProfile | null>(null);

  const applySession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);

    if (!nextSession) {
      setProfile(null);
      setStatus("unauthenticated");
      return;
    }

    const fetchedProfile = await fetchProfile(nextSession.user.id);
    if (!fetchedProfile) {
      setProfile(null);
      setStatus("unauthenticated");
      return;
    }

    if (fetchedProfile.role === "admin") {
      setProfile(null);
      setStatus("admin_rejected");
      await supabase.auth.signOut();
      return;
    }

    setProfile(fetchedProfile as MobileProfile);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) applySession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) applySession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { status: "error", message: error?.message ?? "Invalid credentials" };
    }

    const fetchedProfile = await fetchProfile(data.user.id);
    if (!fetchedProfile) {
      await supabase.auth.signOut();
      return { status: "error", message: "Profile not found" };
    }

    if (fetchedProfile.role === "admin") {
      await supabase.auth.signOut();
      return { status: "admin_rejected" };
    }

    return { status: "success" };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const acknowledgeAdminRejection = useCallback(() => {
    setStatus((current) => (current === "admin_rejected" ? "unauthenticated" : current));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, profile, signIn, signOut, acknowledgeAdminRejection }),
    [status, session, profile, signIn, signOut, acknowledgeAdminRejection]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
