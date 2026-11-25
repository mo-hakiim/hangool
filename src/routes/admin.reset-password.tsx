import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";

import { useAdminAuth } from "@/admin/auth";
import {
  Card,
  Centered,
  ErrorBox,
  Field,
  PasswordRules,
  Spinner,
  authMessage,
  checkNewPassword,
  inputClass,
} from "@/admin/ui";
import { Logo } from "@/admin/logo";
import { Button } from "@/components/ui/button";
import {
  initialUrlHash,
  sessionFromRecoveryLink,
  updatePassword,
  type Session,
} from "@/lib/supabase";

// Opened from the "reset your password" email. Supabase adds the sign-in tokens to the
// URL fragment (#access_token=…&type=recovery); this page uses them to set a new password.
export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPasswordPage,
});

type State =
  | { step: "loading" }
  | { step: "noLink" }
  | { step: "badLink"; message: string }
  | { step: "form"; session: Session }
  | { step: "done" };

function ResetPasswordPage() {
  const { adoptSession } = useAdminAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ step: "loading" });
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash || initialUrlHash;
    // Don't leave the one-time tokens in the address bar or browser history.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    sessionFromRecoveryLink(hash)
      .then((session) => setState(session ? { step: "form", session } : { step: "noLink" }))
      .catch((e) => setState({ step: "badLink", message: authMessage(e) }));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.step !== "form") return;
    const problem = checkNewPassword(next, confirm);
    if (problem) return setError(problem);
    setBusy(true);
    setError("");
    try {
      await updatePassword(state.session.access_token, next);
      setState({ step: "done" });
      await adoptSession(state.session);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const toSignIn = () => void navigate({ to: "/admin" });

  return (
    <Centered>
      <Card>
        <Logo className="mx-auto h-10" />
        {state.step === "loading" && (
          <div className="mt-8 flex justify-center">
            <Spinner className="size-8" />
          </div>
        )}

        {(state.step === "noLink" || state.step === "badLink") && (
          <div className="mt-6 space-y-4 text-center">
            <ShieldAlert className="mx-auto size-9 text-destructive" />
            <h1 className="text-2xl font-medium">
              {state.step === "noLink" ? "Open the link from your email" : "This link doesn't work"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {state.step === "noLink"
                ? "To set a new password, use the reset link we emailed you. You can request one from the sign-in page with “Forgot password?”."
                : state.message}
            </p>
            <Button variant="default" className="w-full" onClick={toSignIn}>
              <ArrowLeft /> Go to sign in
            </Button>
          </div>
        )}

        {state.step === "form" && (
          <>
            <h1 className="mt-6 text-center text-2xl font-medium">Choose a new password</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              For <strong className="text-foreground">{state.session.user.email}</strong>
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="New password">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Repeat new password">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <PasswordRules />
              <ErrorBox message={error} />
              <Button type="submit" variant="default" size="lg" className="w-full" disabled={busy}>
                {busy ? (
                  <Spinner className="border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <KeyRound />
                )}
                Save new password
              </Button>
            </form>
          </>
        )}

        {state.step === "done" && (
          <div className="mt-6 space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h1 className="text-2xl font-medium">Password updated</h1>
            <p className="text-sm text-muted-foreground">
              You're signed in. Use the new password next time.
            </p>
            <Button variant="default" className="w-full" onClick={toSignIn}>
              Open the dashboard
            </Button>
          </div>
        )}
      </Card>
    </Centered>
  );
}
