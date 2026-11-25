import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/data/live";
import { useI18n } from "@/i18n";
import { submit, supabaseEnabled } from "@/lib/supabase";

export type FormKind = "contact" | "quote" | "viewing";

const TABLE: Record<FormKind, string> = {
  contact: "inquiries",
  quote: "quote_requests",
  viewing: "viewing_requests",
};

// Allowed characters for a phone number; 7–15 digits (international format).
const PHONE_RE = /^\+?[\d\s()-]{7,22}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500; // humans take longer than this to fill a form

type Values = Record<string, string>;

export function validate(kind: FormKind, v: Values) {
  const errors: Record<string, "required" | "invalidPhone" | "invalidEmail"> = {};
  const required = ["name", "phone", ...(kind === "quote" ? ["service_type"] : [])];
  if (kind !== "viewing") required.push("message");
  for (const k of required) if (!v[k]?.trim()) errors[k] = "required";
  const digits = (v["phone"] ?? "").replace(/\D/g, "");
  if (
    v["phone"]?.trim() &&
    (!PHONE_RE.test(v["phone"].trim()) || digits.length < 7 || digits.length > 15)
  )
    errors["phone"] = "invalidPhone";
  if (v["email"]?.trim() && !EMAIL_RE.test(v["email"].trim())) errors["email"] = "invalidEmail";
  return errors;
}

/**
 * Contact, quote and viewing forms. Rows are inserted into Supabase (visitors can
 * insert but never read). A hidden "website" field and a minimum fill time keep
 * simple bots out. If saving fails, the visitor gets a clear error and a WhatsApp
 * button with their message already written.
 */
export function InquiryForm({
  kind,
  extra,
  children,
  submitLabel,
  successText,
  whatsappIntro,
}: {
  kind: FormKind;
  /** Fixed fields added to the row, e.g. the property id. */
  extra?: Record<string, string>;
  /** Kind-specific fields rendered between phone/email and the message. */
  children?: ReactNode;
  submitLabel: string;
  successText: string;
  whatsappIntro: string;
}) {
  const { t, lang } = useI18n();
  const settings = useSettings();
  const started = useRef(Date.now());
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "tooFast">("idle");
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    started.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v: Values = {};
    data.forEach((value, key) => (v[key] = String(value).trim()));

    // Honeypot: real visitors never see or fill this field. Pretend it worked.
    if (v["website"]) {
      setState("sent");
      return;
    }
    const errs = validate(kind, v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    if (Date.now() - started.current < MIN_FILL_MS) {
      setState("tooFast");
      return;
    }

    const { website: _hp, ...fields } = v;
    const row: Record<string, unknown> = { ...extra, language: lang };
    for (const [k, val] of Object.entries(fields)) row[k] = val || null;

    const lines = [
      whatsappIntro,
      ...Object.entries(fields)
        .filter(([, val]) => val)
        .map(([, val]) => val),
    ];
    setFallback(`${settings.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`);

    setState("sending");
    try {
      if (!supabaseEnabled) throw new Error("not configured");
      await submit(TABLE[kind], row);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="form-alert flex gap-3 items-start" data-kind="success" role="status">
        <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
        <p>{successText}</p>
      </div>
    );
  }

  const err = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${kind}-${name}-error`}>
        {t.form[errors[name]!]}
      </span>
    ) : null;
  const aria = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${kind}-${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 relative">
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="text-sm font-semibold">
          {t.form.name}
          <input
            className="field"
            name="name"
            autoComplete="name"
            placeholder={t.form.namePlaceholder}
            maxLength={120}
            {...aria("name")}
          />
          {err("name")}
        </label>
        <label className="text-sm font-semibold">
          {t.form.phone}
          <input
            className="field"
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={t.form.phonePlaceholder}
            maxLength={30}
            {...aria("phone")}
          />
          {err("phone")}
        </label>
      </div>
      <label className="block text-sm font-semibold">
        {t.form.email}
        <input
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t.form.emailPlaceholder}
          maxLength={160}
          {...aria("email")}
        />
        {err("email")}
      </label>
      {children && <FieldErrors.Provider value={{ err, aria }}>{children}</FieldErrors.Provider>}
      <label className="block text-sm font-semibold">
        {kind === "quote" ? t.form.projectMessage : t.form.message}
        <textarea
          className="field min-h-32"
          name="message"
          maxLength={3000}
          placeholder={kind === "quote" ? t.form.projectPlaceholder : t.form.messagePlaceholder}
          {...aria("message")}
        />
        {err("message")}
      </label>
      <Button variant="gold" size="lg" type="submit" disabled={state === "sending"}>
        <Send />
        {state === "sending" ? t.form.sending : submitLabel}
      </Button>
      {state === "tooFast" && (
        <p className="form-alert" data-kind="error" role="alert">
          {t.form.tooFast}
        </p>
      )}
      {state === "error" && (
        <div className="form-alert space-y-3" data-kind="error" role="alert">
          <p>{t.form.error}</p>
          <Button asChild>
            <a href={fallback || settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> {t.common.whatsapp}
            </a>
          </Button>
        </div>
      )}
    </form>
  );
}

/* Lets kind-specific fields passed as children show the same error messages. */
type FieldCtx = {
  err: (name: string) => ReactNode;
  aria: (name: string) => Record<string, unknown>;
};
const FieldErrors = createContext<FieldCtx>({ err: () => null, aria: () => ({}) });
export const useFieldErrors = () => useContext(FieldErrors);
