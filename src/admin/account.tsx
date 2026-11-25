import { useState, type FormEvent } from "react";
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "./auth";
import { Field, PasswordRules, Spinner, authMessage, checkNewPassword, inputClass } from "./ui";

/** Account button in the dashboard header: shows who is signed in, change password, sign out. */
export function AccountMenu() {
  const { email, signOut } = useAdminAuth();
  const [changing, setChanging] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <UserRound className="size-4" />
            <span className="hidden sm:inline">Account</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-sm">
          <DropdownMenuLabel className="font-normal">
            <span className="block text-xs text-muted-foreground">Signed in as</span>
            <span className="block truncate text-sm font-semibold">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setChanging(true)} className="cursor-pointer gap-2">
            <KeyRound className="size-4" /> Change password
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void signOut()} className="cursor-pointer gap-2">
            <LogOut className="size-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordDialog open={changing} onOpenChange={setChanging} />
    </>
  );
}

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { changePassword } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = checkNewPassword(next, confirm);
    if (problem) return setError(problem);
    setBusy(true);
    setError("");
    try {
      await changePassword(current, next);
      toast.success("Password changed. Use the new password next time you sign in.");
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="rounded-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Enter your current password, then choose a new one.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Current password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputClass}
            />
          </Field>
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
          {error && (
            <p
              role="alert"
              className="rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={busy}>
              {busy ? (
                <Spinner className="border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <KeyRound />
              )}
              Save new password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
