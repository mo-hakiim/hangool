// Supabase Edge Function: notify-request
//
// Emails the owner when a visitor sends a contact message, quote request or
// viewing request. Called by three Supabase Database Webhooks (INSERT on
// inquiries, quote_requests, viewing_requests) — see SETUP.md ("Email alerts").
//
// Secrets (Supabase → Edge Functions → Secrets; never in the website or repo):
//   RESEND_API_KEY  — from resend.com → API Keys
//   NOTIFY_FROM     — e.g. "Hangool Website <alerts@hangooldevelopment.com>"
//   WEBHOOK_SECRET  — any long random text; the webhooks send it in the
//                     x-webhook-secret header so nobody else can trigger emails
// The recipient is Admin → Settings → "Alert email" (default info@hangooldevelopment.com).

export type Env = {
  url: string; // SUPABASE_URL
  serviceKey: string; // SUPABASE_SERVICE_ROLE_KEY
  resendKey: string;
  from: string;
  webhookSecret: string;
  siteUrl: string;
};

const DEFAULT_TO = "info@hangooldevelopment.com";
const TABLES: Record<string, string> = {
  inquiries: "New contact message",
  quote_requests: "New quote request",
  viewing_requests: "New viewing request",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Constant-time comparison so the secret can't be guessed by timing. */
function sameSecret(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type Rec = Record<string, unknown>;

/** Subject, HTML and plain-text body for one request. Exported for tests. */
export function compose(table: string, r: Rec, siteUrl: string) {
  const label = TABLES[table] ?? "New request";
  const digits = String(r["phone"] ?? "").replace(/\D/g, "");
  const rows: [string, unknown][] = [
    ["Name", r["name"]],
    ["Phone", r["phone"]],
    ["Email", r["email"]],
    ...(table === "quote_requests"
      ? ([
          ["Service", r["service_type"]],
          ["Location", r["location"]],
          ["Budget", r["budget_range"]],
        ] as [string, unknown][])
      : []),
    ...(table === "viewing_requests"
      ? ([
          ["Property", r["property_name"]],
          ["Preferred date", r["preferred_date"]],
        ] as [string, unknown][])
      : []),
    ["Language", r["language"] === "so" ? "Somali" : "English"],
  ];
  const filled = rows.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");
  const inbox = `${siteUrl.replace(/\/+$/, "")}/admin/requests?tab=${table}`;
  const subject = `${label}: ${String(r["name"] ?? "").slice(0, 80)}`;
  const message = String(r["message"] ?? "").trim();

  const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2a24">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden">
<tr><td style="background:#1a3d2e;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:bold">${esc(label)}</td></tr>
<tr><td style="padding:20px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${filled.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;font-weight:bold">${esc(v)}</td></tr>`).join("\n")}
</table>
${message ? `<p style="margin:16px 0 0;padding:12px 14px;background:#f4f1ea;border-radius:4px;font-size:14px;line-height:1.6;white-space:pre-line">${esc(message)}</p>` : ""}
<p style="margin:20px 0 0">
${digits ? `<a href="https://wa.me/${digits}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#25d366;color:#ffffff;text-decoration:none;border-radius:4px;font-weight:bold">WhatsApp</a><a href="tel:+${digits}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border:1px solid #1a3d2e;color:#1a3d2e;text-decoration:none;border-radius:4px;font-weight:bold">Call</a>` : ""}
<a href="${esc(inbox)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#d4a62a;color:#1f2a24;text-decoration:none;border-radius:4px;font-weight:bold">Open the requests inbox</a>
</p></td></tr>
<tr><td style="padding:14px 24px;font-size:12px;color:#6b7280;border-top:1px solid #eee">Sent automatically by hangooldevelopment.com. Reply by phone, WhatsApp or email, then mark the request as handled in the dashboard.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    label,
    "",
    ...filled.map(([k, v]) => `${k}: ${String(v)}`),
    ...(message ? ["", message] : []),
    "",
    ...(digits ? [`WhatsApp: https://wa.me/${digits}`] : []),
    `Requests inbox: ${inbox}`,
  ].join("\n");

  return { subject, html, text };
}

export async function handle(
  req: Request,
  env: Env,
  http: typeof fetch = fetch,
): Promise<Response> {
  if (req.method !== "POST") return json(405, { error: "Use POST." });
  if (!sameSecret(req.headers.get("x-webhook-secret") ?? "", env.webhookSecret)) {
    return json(401, { error: "Not allowed." });
  }
  if (!env.resendKey) return json(500, { error: "RESEND_API_KEY is not set." });

  let payload: { type?: string; table?: string; record?: Rec };
  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return json(400, { error: "Invalid payload." });
  }
  const table = payload.table ?? "";
  if (payload.type !== "INSERT" || !TABLES[table] || !payload.record) {
    return json(200, { skipped: true });
  }

  // Recipient from Admin → Settings (falls back to the company address).
  let to = DEFAULT_TO;
  try {
    const res = await http(`${env.url}/rest/v1/site_settings?select=notify_email&id=eq.1`, {
      headers: {
        apikey: env.serviceKey,
        ...(env.serviceKey.startsWith("eyJ") ? { authorization: `Bearer ${env.serviceKey}` } : {}),
      },
    });
    const rows = res.ok ? ((await res.json()) as { notify_email?: string | null }[]) : [];
    const saved = rows[0]?.notify_email?.trim();
    if (saved && EMAIL_RE.test(saved)) to = saved;
  } catch {
    /* keep the default */
  }

  const { subject, html, text } = compose(table, payload.record, env.siteUrl);
  const replyTo = String(payload.record["email"] ?? "").trim();
  const send = await http("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.resendKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.from || "Hangool Website <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      text,
      ...(EMAIL_RE.test(replyTo) ? { reply_to: replyTo } : {}),
    }),
  });
  if (!send.ok) {
    const detail = await send.text();
    console.error("Resend error", send.status, detail);
    return json(502, { error: `Email not sent (${send.status}).`, detail });
  }
  return json(200, { ok: true, to });
}

// Supabase Edge Runtime entry point (skipped when the file is imported by tests).
const deno = (
  globalThis as {
    Deno?: {
      env: { get(k: string): string | undefined };
      serve(h: (r: Request) => Promise<Response>): void;
    };
  }
).Deno;
if (deno) {
  const env: Env = {
    url: deno.env.get("SUPABASE_URL") ?? "",
    serviceKey: deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || deno.env.get("SERVICE_ROLE_KEY") || "",
    resendKey: deno.env.get("RESEND_API_KEY") ?? "",
    from: deno.env.get("NOTIFY_FROM") ?? "",
    webhookSecret: deno.env.get("WEBHOOK_SECRET") ?? "",
    siteUrl: deno.env.get("SITE_URL") ?? "https://hangooldevelopment.com",
  };
  deno.serve((req) => handle(req, env));
}
