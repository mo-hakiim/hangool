import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle, Phone, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminRows, useAdminWrite, type Row } from "@/admin/data";
import {
  ConfirmDelete,
  ErrorBox,
  Panel,
  RequireRole,
  Spinner,
  errorMessage,
  textareaClass,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";

type Kind = "inquiries" | "quote_requests" | "viewing_requests";
const TABS: { kind: Kind; label: string }[] = [
  { kind: "inquiries", label: "Contact messages" },
  { kind: "quote_requests", label: "Quote requests" },
  { kind: "viewing_requests", label: "Viewing requests" },
];

export const Route = createFileRoute("/admin/requests")({
  validateSearch: (s: Record<string, unknown>): { tab: Kind; show: "new" | "all" } => ({
    tab: TABS.some((t) => t.kind === s["tab"]) ? (s["tab"] as Kind) : "inquiries",
    show: s["show"] === "all" ? "all" : "new",
  }),
  component: () => (
    <RequireRole area="requests">
      <Requests />
    </RequireRole>
  ),
});

const NEW_ONLY = "select=id&status=eq.new";
const digits = (s: unknown) => String(s ?? "").replace(/\D/g, "");
const when = (iso: unknown) =>
  new Date(String(iso)).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function Requests() {
  const { tab, show } = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/requests" });
  const newInquiries = useAdminRows<Row>("inquiries", NEW_ONLY);
  const newQuotes = useAdminRows<Row>("quote_requests", NEW_ONLY);
  const newViewings = useAdminRows<Row>("viewing_requests", NEW_ONLY);
  const counts: Record<Kind, number> = {
    inquiries: newInquiries.data?.length ?? 0,
    quote_requests: newQuotes.data?.length ?? 0,
    viewing_requests: newViewings.data?.length ?? 0,
  };
  const rows = useAdminRows<Row>(
    tab,
    `select=*${show === "new" ? "&status=eq.new" : ""}&order=created_at.desc&limit=200`,
  );
  const write = useAdminWrite(tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages sent from the website. Reply by phone, WhatsApp or email, then mark them as
          handled.
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <Button
            key={t.kind}
            role="tab"
            aria-selected={tab === t.kind}
            variant={tab === t.kind ? "default" : "outline"}
            onClick={() => navigate({ search: { tab: t.kind, show } })}
          >
            {t.label}
            {counts[t.kind] > 0 && (
              <span className="rounded-full bg-secondary px-2 text-[11px] font-bold text-secondary-foreground">
                {counts[t.kind]}
              </span>
            )}
          </Button>
        ))}
      </div>
      <div className="flex gap-4 text-sm">
        {(["new", "all"] as const).map((s) => (
          <label key={s} className="flex items-center gap-2">
            <input
              type="radio"
              name="show"
              checked={show === s}
              onChange={() => navigate({ search: { tab, show: s } })}
            />
            {s === "new" ? "New only" : "All (including handled)"}
          </label>
        ))}
      </div>
      <Panel>
        {rows.isPending ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-7" />
          </div>
        ) : rows.isError ? (
          <ErrorBox message={errorMessage(rows.error)} />
        ) : !rows.data.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {show === "new" ? "No new requests. You're all caught up." : "No requests yet."}
          </p>
        ) : (
          <ul className="divide-y">
            {rows.data.map((r) => (
              <RequestItem key={r.id} row={r} kind={tab} write={write} />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function RequestItem({
  row: r,
  kind,
  write,
}: {
  row: Row;
  kind: Kind;
  write: ReturnType<typeof useAdminWrite>;
}) {
  const [notes, setNotes] = useState(String(r["notes"] ?? ""));
  const handled = r["status"] === "handled";
  const details: [string, unknown][] =
    kind === "quote_requests"
      ? [
          ["Service", r["service_type"]],
          ["Location", r["location"]],
          ["Budget", r["budget_range"]],
        ]
      : kind === "viewing_requests"
        ? [
            ["Property", r["property_name"]],
            ["Preferred date", r["preferred_date"]],
          ]
        : [];

  const setStatus = async (status: "new" | "handled") => {
    try {
      await write.save(r.id, {
        status,
        handled_at: status === "handled" ? new Date().toISOString() : null,
        notes: notes.trim() || null,
      });
      toast.success(status === "handled" ? "Marked as handled." : "Moved back to new.");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <li className="py-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {String(r["name"])}{" "}
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold uppercase text-muted-foreground">
              {String(r["language"] ?? "en")}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {when(r["created_at"])}
            {handled && r["handled_at"] ? ` · handled ${when(r["handled_at"])}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button size="sm" variant="outline" asChild>
            <a href={`tel:+${digits(r["phone"])}`}>
              <Phone /> {String(r["phone"])}
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={`https://wa.me/${digits(r["phone"])}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          {r["email"] ? (
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${String(r["email"])}`}>
                <Mail /> Email
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      {details.some(([, v]) => v) && (
        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
          {details
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">
                  {k === "Property" && r["property_id"] ? (
                    <a
                      className="text-primary underline-offset-4 hover:underline"
                      href={`${import.meta.env.BASE_URL}property?id=${String(r["property_id"])}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {String(v)}
                    </a>
                  ) : (
                    String(v)
                  )}
                </dd>
              </div>
            ))}
        </dl>
      )}
      {r["message"] ? <p className="whitespace-pre-line text-sm">{String(r["message"])}</p> : null}
      <textarea
        className={`${textareaClass} min-h-16`}
        placeholder="Internal notes (only visible here)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        aria-label="Internal notes"
      />
      <div className="flex flex-wrap gap-2">
        {handled ? (
          <Button size="sm" variant="outline" onClick={() => void setStatus("new")}>
            <RotateCcw /> Mark as new
          </Button>
        ) : (
          <Button size="sm" onClick={() => void setStatus("handled")}>
            <CheckCircle2 /> Mark as handled
          </Button>
        )}
        <ConfirmDelete
          title="Delete this request?"
          description="It will be removed permanently."
          onConfirm={() =>
            void write
              .destroy(r.id)
              .then(() => toast.success("Deleted."))
              .catch((e) => toast.error(errorMessage(e)))
          }
        >
          <Button size="sm" variant="ghost">
            <Trash2 className="text-destructive" /> Delete
          </Button>
        </ConfirmDelete>
      </div>
    </li>
  );
}
