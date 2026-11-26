import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { History, MailPlus, Power, RefreshCw, Send, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/admin/auth";
import { useAdminRows } from "@/admin/data";
import {
  ConfirmDelete,
  ErrorBox,
  Field,
  Panel,
  ROLE_LABELS,
  RequireRole,
  Spinner,
  errorMessage,
  inputClass,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { SupabaseError, callFunction, update, type StaffRole } from "@/lib/supabase";

export const Route = createFileRoute("/admin/staff")({
  component: () => (
    <RequireRole area="owner">
      <Staff />
    </RequireRole>
  ),
});

type StaffRow = {
  user_id: string;
  role: StaffRole;
  active: boolean;
  email: string | null;
  created_at: string;
};
type LogRow = {
  id: number;
  actor_email: string | null;
  action: string;
  target_email: string | null;
  old_role: string | null;
  new_role: string | null;
  created_at: string;
};

const ROLES: StaffRole[] = ["owner", "editor", "requests"];
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/** Plain message for Edge Function errors, including "not deployed yet". */
function functionMessage(e: unknown) {
  if (e instanceof SupabaseError && e.status === 404 && /function/i.test(e.message))
    return "The staff-admin function isn't deployed yet. See SETUP.md → “Staff invites”.";
  return errorMessage(e);
}

function Staff() {
  const { token, userId } = useAdminAuth();
  const qc = useQueryClient();
  const staff = useAdminRows<StaffRow>("admin_roles", "select=*&order=created_at.asc");
  const log = useAdminRows<LogRow>("staff_audit_log", "select=*&order=created_at.desc&limit=100");
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "admin_roles"] });
    void qc.invalidateQueries({ queryKey: ["admin", "staff_audit_log"] });
  };

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("editor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const invite = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      return setError("Please enter a valid email address.");
    setBusy(true);
    try {
      const out = await callFunction<{ message?: string }>(
        "staff-admin",
        { action: "invite", email: email.trim(), role },
        await token(),
      );
      toast.success(out.message ?? "Invite sent.");
      setEmail("");
      refresh();
    } catch (err) {
      setError(functionMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const change = async (
    row: StaffRow,
    patch: Partial<Pick<StaffRow, "role" | "active">>,
    done: string,
  ) => {
    try {
      await update("admin_roles", row.user_id, patch, await token(), "user_id");
      toast.success(done);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      refresh();
    }
  };

  const act = async (body: Record<string, unknown>, done: string) => {
    try {
      const out = await callFunction<{ message?: string; warning?: string }>(
        "staff-admin",
        body,
        await token(),
      );
      if (out.warning) toast.warning(out.warning);
      else toast.success(out.message ?? done);
    } catch (err) {
      toast.error(functionMessage(err));
    } finally {
      refresh();
    }
  };

  const activeOwners = (staff.data ?? []).filter((s) => s.role === "owner" && s.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invite people to the dashboard and choose what each person can do.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r} className="rounded-sm border bg-card p-4">
            <p className="text-sm font-bold">{ROLE_LABELS[r].name}</p>
            <p className="text-xs text-muted-foreground mt-1">{ROLE_LABELS[r].description}.</p>
          </div>
        ))}
      </div>

      <Panel title="Invite a staff member">
        <form onSubmit={invite} className="grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <Field label="Email address">
            <input
              type="email"
              className={inputClass}
              value={email}
              autoComplete="off"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Role">
            <select
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r].name}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit" disabled={busy} className="h-11">
            {busy ? (
              <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <MailPlus />
            )}
            Send invite
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          They get an email with a link to set their own password, then sign in at
          hangooldevelopment.com/admin.
        </p>
        <div className="mt-3">
          <ErrorBox message={error} />
        </div>
      </Panel>

      <Panel title="Team access">
        {staff.isPending ? (
          <div className="flex justify-center py-8">
            <Spinner className="size-7" />
          </div>
        ) : staff.isError ? (
          <ErrorBox message={errorMessage(staff.error)} />
        ) : (
          <ul className="divide-y">
            {staff.data.map((s) => {
              const isYou = s.user_id === userId;
              const lastOwner = s.role === "owner" && s.active && activeOwners <= 1;
              return (
                <li key={s.user_id} className="flex flex-wrap items-center gap-3 py-3">
                  <UserCog className="size-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1 basis-[calc(100%-3rem)] sm:basis-0">
                    <p className="font-semibold truncate">
                      {s.email ?? s.user_id}
                      {isYou && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added {when(s.created_at)}
                      {lastOwner ? " · the only owner, can't be downgraded or removed" : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      s.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.active ? "Active" : "Deactivated"}
                  </span>
                  <select
                    aria-label={`Role for ${s.email ?? "staff member"}`}
                    className={`${inputClass.replace("w-full", "")} h-9 w-36 shrink-0`}
                    value={s.role}
                    disabled={lastOwner}
                    onChange={(e) =>
                      void change(
                        s,
                        { role: e.target.value as StaffRole },
                        `${s.email ?? "Staff member"} is now ${ROLE_LABELS[e.target.value as StaffRole].name}.`,
                      )
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r].name}
                      </option>
                    ))}
                  </select>
                  <div className="ml-auto flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={lastOwner || isYou}
                      title={s.active ? "Deactivate" : "Reactivate"}
                      onClick={() =>
                        void change(
                          s,
                          { active: !s.active },
                          s.active
                            ? "Deactivated. They can no longer use the dashboard."
                            : "Reactivated.",
                        )
                      }
                    >
                      <Power /> {s.active ? "Deactivate" : "Reactivate"}
                    </Button>
                    {!isYou && (
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Send the invite email again"
                        onClick={() =>
                          void act(
                            { action: "resend", email: s.email, role: s.role },
                            "Invite sent again.",
                          )
                        }
                      >
                        <Send /> <span className="hidden sm:inline">Resend invite</span>
                      </Button>
                    )}
                    {!isYou && !lastOwner && (
                      <ConfirmDelete
                        title={`Remove ${s.email ?? "this staff member"}?`}
                        description="Their login is deleted and they lose all access. This can't be undone, but you can invite them again later."
                        onConfirm={() =>
                          void act({ action: "remove", user_id: s.user_id }, "Removed.")
                        }
                      >
                        <Button size="sm" variant="ghost" title="Remove">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </ConfirmDelete>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Panel title="History">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <History className="size-4 text-primary" /> Every invite, role change, deactivation and
            removal.
          </p>
          <Button size="sm" variant="ghost" onClick={refresh} aria-label="Refresh history">
            <RefreshCw />
          </Button>
        </div>
        {log.isPending ? (
          <Spinner />
        ) : log.isError ? (
          <ErrorBox message={errorMessage(log.error)} />
        ) : !log.data.length ? (
          <p className="text-sm text-muted-foreground">No changes yet.</p>
        ) : (
          <ul className="divide-y text-sm">
            {log.data.map((l) => (
              <li key={l.id} className="py-2 flex flex-wrap gap-x-3 gap-y-1">
                <span className="text-xs text-muted-foreground w-40 shrink-0">
                  {when(l.created_at)}
                </span>
                <span className="min-w-0">
                  <strong>{l.actor_email ?? "Unknown"}</strong> {describe(l)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function describe(l: LogRow) {
  const who = l.target_email ?? "a staff member";
  const name = (r: string | null) => (r ? (ROLE_LABELS[r as StaffRole]?.name ?? r) : "");
  switch (l.action) {
    case "added":
      return `added ${who} as ${name(l.new_role)}`;
    case "role_changed":
      return `changed ${who} from ${name(l.old_role)} to ${name(l.new_role)}`;
    case "deactivated":
      return `deactivated ${who}`;
    case "reactivated":
      return `reactivated ${who}`;
    case "removed":
      return `removed ${who} (${name(l.old_role)})`;
    default:
      return `updated ${who}`;
  }
}
