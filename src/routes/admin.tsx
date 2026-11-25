import { useState, type FormEvent } from "react";
import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowLeft, Lock, Mail, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";

import { AdminAuthProvider, useAdminAuth } from "@/admin/auth";
import {
  AdminHeader,
  Card,
  Centered,
  ErrorBox,
  Field,
  Spinner,
  authMessage,
  inputClass,
} from "@/admin/ui";
import { Logo } from "@/admin/logo";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { requestPasswordReset } from "@/lib/supabase";

// The dashboard is reached from a small footer link and is kept out of search engines.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Hangool" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-muted">
        <Gate />
      </div>
      <Toaster position="top-center" richColors />
    </AdminAuthProvider>
  );
}

function Gate() {
  const { status, email, signOut, retry } = useAdminAuth();
  // The password-reset page (opened from the email link) must work while signed out.
  const isReset = Boolean(useMatch({ from: "/admin/reset-password", shouldThrow: false }));
  if (isReset) return <Outlet />;

  if (status === "checking") {
    return (
      <Centered>
        <Spinner className="size-8" />
      </Centered>
    );
  }
  if (status === "unconfigured") {
    return (
      <Centered>
        <Card>
          <ShieldAlert className="mx-auto size-8 text-primary" />
          <h1 className="mt-3 text-center text-2xl font-medium">Dashboard not connected</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            This version of the website isn't connected to the website database, so you can't sign
            in here. The site manager needs to add the Supabase settings (
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) and rebuild the
            site.
          </p>
        </Card>
      </Centered>
    );
  }
  if (status === "unreachable") {
    return (
      <Centered>
        <Card>
          <WifiOff className="mx-auto size-8 text-primary" />
          <h1 className="mt-3 text-center text-2xl font-medium">Can't reach the database</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            The dashboard couldn't connect to the website database. Check your internet connection
            and try again in a moment.
          </p>
          <Button className="mt-6 w-full" variant="default" onClick={retry}>
            <RefreshCw /> Try again
          </Button>
        </Card>
      </Centered>
    );
  }
  if (status === "signedOut") return <LoginForm />;
  if (status === "notAdmin") {
    return (
      <Centered>
        <Card>
          <ShieldAlert className="mx-auto size-8 text-destructive" />
          <h1 className="mt-3 text-center text-2xl font-medium">Not an admin</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            The password is correct, but <strong className="text-foreground">{email}</strong> isn't
            on the website's admin list, so it can't manage the website. Ask the site manager to add
            this account as an admin in Supabase, or sign out and use the owner's account.
          </p>
          <Button className="mt-6 w-full" variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </Card>
      </Centered>
    );
  }
  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <Outlet />
      </main>
    </>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  return (
    <Centered>
      <Card>
        <Logo className="mx-auto h-10" />
        {mode === "signin" ? (
          <SignInForm onForgot={() => setMode("forgot")} />
        ) : (
          <ForgotForm onBack={() => setMode("signin")} />
        )}
      </Card>
    </Centered>
  );
}

// Accounts are created only in Supabase — there is deliberately no sign-up here.
function SignInForm({ onForgot }: { onForgot: () => void }) {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mt-6 text-center text-2xl font-medium">Hangool dashboard</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Sign in to manage the website.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <button
            type="button"
            onClick={onForgot}
            className="mt-2 text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <ErrorBox message={error} />
        <Button type="submit" variant="default" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <Spinner className="border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            <Lock />
          )}
          Sign in
        </Button>
      </form>
    </>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mt-6 text-center text-2xl font-medium">Reset your password</h1>
      {sent ? (
        <div className="mt-4 space-y-4 text-center">
          <Mail className="mx-auto size-10 text-primary" />
          <p className="text-sm text-muted-foreground">
            If <strong className="text-foreground">{email}</strong> belongs to an admin account, a
            reset link is on its way. Open the email and tap the link to choose a new password.
            Check your spam folder if it doesn't arrive within a few minutes.
          </p>
          <Button variant="outline" className="w-full" onClick={onBack}>
            <ArrowLeft /> Back to sign in
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Enter the account's email and we'll send a link to set a new password.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <ErrorBox message={error} />
            <Button type="submit" variant="default" size="lg" className="w-full" disabled={busy}>
              {busy ? (
                <Spinner className="border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <Mail />
              )}
              Send reset link
            </Button>
            <button
              type="button"
              onClick={onBack}
              className="mx-auto flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="size-4" /> Back to sign in
            </button>
          </form>
        </>
      )}
    </>
  );
}
