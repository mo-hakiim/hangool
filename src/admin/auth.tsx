import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getSession,
  getStaff,
  signIn as apiSignIn,
  signOut as apiSignOut,
  supabaseEnabled,
  SupabaseError,
  updatePassword,
  type Session,
  type StaffRole,
} from "@/lib/supabase";

export type AuthStatus =
  | "checking"
  | "unconfigured" // this build has no Supabase settings
  | "unreachable" // Supabase could not be reached
  | "signedOut"
  | "notAdmin"
  | "deactivated" // staff row exists but the owner switched it off
  | "admin";

type AuthValue = {
  status: AuthStatus;
  email: string | undefined;
  /** The signed-in staff member's role (set when status is "admin"). */
  role: StaffRole | undefined;
  /** Their user id (to recognise "you" on the Staff page). */
  userId: string | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** A valid access token for write requests (refreshes it if needed). */
  token: () => Promise<string>;
  /** Re-checks the password, then sets a new one. */
  changePassword: (current: string, next: string) => Promise<void>;
  /** Signs in with a session taken from a password-reset email link. */
  adoptSession: (s: Session) => Promise<void>;
  retry: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(supabaseEnabled ? "checking" : "unconfigured");
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRole | undefined>(undefined);

  const adopt = useCallback(async (s: Session | null) => {
    setSession(s);
    setRole(undefined);
    if (!s) return setStatus("signedOut");
    try {
      const staff = await getStaff(s);
      if (!staff) return setStatus("notAdmin");
      if (!staff.active) return setStatus("deactivated");
      setRole(staff.role);
      setStatus("admin");
    } catch (e) {
      setStatus(e instanceof SupabaseError && e.status === 0 ? "unreachable" : "signedOut");
    }
  }, []);

  const check = useCallback(() => {
    if (!supabaseEnabled) return;
    setStatus("checking");
    void getSession().then(adopt);
  }, [adopt]);

  useEffect(check, [check]);

  const value = useMemo<AuthValue>(
    () => ({
      status,
      email: session?.user.email,
      role,
      userId: session?.user.id,
      signIn: async (email, password) => {
        await adopt(await apiSignIn(email, password));
      },
      signOut: async () => {
        await apiSignOut(session);
        setSession(null);
        setStatus("signedOut");
      },
      token: async () => {
        const s = await getSession();
        if (!s) {
          setSession(null);
          setStatus("signedOut");
          throw new Error("Your session has expired. Please sign in again.");
        }
        return s.access_token;
      },
      changePassword: async (current, next) => {
        const email = session?.user.email;
        if (!email) throw new Error("Please sign in again.");
        // Confirm it's really the owner before changing the password.
        const fresh = await apiSignIn(email, current).catch((e) => {
          if (
            e instanceof SupabaseError &&
            /invalid_credentials|invalid login/i.test(`${e.code} ${e.message}`)
          ) {
            throw new SupabaseError(
              "Your current password is not correct.",
              400,
              "wrong_current_password",
            );
          }
          throw e;
        });
        await updatePassword(fresh.access_token, next);
        setSession(fresh);
      },
      adoptSession: adopt,
      retry: check,
    }),
    [status, session, role, adopt, check],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
