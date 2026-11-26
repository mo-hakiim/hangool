// Supabase Edge Function: staff-admin
//
// Invites and removes staff for the Hangool dashboard (Admin → Staff). These are
// the only staff actions that need the service_role key, which is read from the
// function's environment (a Supabase secret) and never sent to the website.
//
// Every call must come from a signed-in, ACTIVE OWNER. The staff row itself is
// written with the caller's own token, so Row Level Security and the database
// triggers (last-owner protection, staff_audit_log) apply exactly as in the
// dashboard, and the history shows the owner who made the change.
//
// Actions (POST JSON):
//   { action: "invite", email, role }   → sends the invite email, adds the staff row
//   { action: "resend", email }         → sends the invite email again
//   { action: "remove", user_id }       → removes the staff row and deletes the login
//
// Deploy: see SETUP.md ("Staff invites").

export type Env = {
  url: string; // SUPABASE_URL
  anonKey: string; // SUPABASE_ANON_KEY
  serviceKey: string; // SUPABASE_SERVICE_ROLE_KEY (Supabase secret)
  siteUrl: string; // SITE_URL, e.g. https://hangooldevelopment.com
};

const ROLES = ["owner", "editor", "requests"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

/** Headers for admin calls with the service key (legacy JWT or new sb_secret_ key). */
function serviceHeaders(env: Env): Record<string, string> {
  return {
    apikey: env.serviceKey,
    ...(env.serviceKey.startsWith("eyJ") ? { authorization: `Bearer ${env.serviceKey}` } : {}),
    "content-type": "application/json",
  };
}

async function readJson(res: Response): Promise<Record<string, unknown> | unknown[] | null> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { message: text };
  }
}

function errorText(body: unknown, fallback: string) {
  const b = (body ?? {}) as Record<string, unknown>;
  return String(b["message"] ?? b["msg"] ?? b["error_description"] ?? b["error"] ?? fallback);
}

export async function handle(
  req: Request,
  env: Env,
  http: typeof fetch = fetch,
): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { error: "Use POST." });
  if (!env.url || !env.anonKey || !env.serviceKey) {
    return json(500, { error: "The function is missing its Supabase settings." });
  }

  // 1. Who is calling?
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return json(401, { error: "Please sign in again." });
  const asCaller = { apikey: env.anonKey, authorization: `Bearer ${token}` };

  const userRes = await http(`${env.url}/auth/v1/user`, { headers: asCaller });
  if (!userRes.ok) return json(401, { error: "Your session has expired. Please sign in again." });
  const caller = (await readJson(userRes)) as { id?: string; email?: string } | null;
  if (!caller?.id) return json(401, { error: "Please sign in again." });

  // 2. Only active owners may manage staff.
  const roleRes = await http(
    `${env.url}/rest/v1/admin_roles?select=role,active&user_id=eq.${caller.id}`,
    { headers: asCaller },
  );
  const roleRows = roleRes.ok
    ? ((await readJson(roleRes)) as { role: string; active: boolean }[])
    : [];
  if (!roleRows?.[0] || roleRows[0].role !== "owner" || !roleRows[0].active) {
    return json(403, { error: "Only owners can manage staff." });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const action = String(body["action"] ?? "");
  const redirect = `${env.siteUrl.replace(/\/+$/, "")}/admin/reset-password`;

  const sendInvite = (email: string, role: string) =>
    http(`${env.url}/auth/v1/invite?redirect_to=${encodeURIComponent(redirect)}`, {
      method: "POST",
      headers: serviceHeaders(env),
      body: JSON.stringify({ email, data: { role, invited_by: caller.email ?? caller.id } }),
    });

  // 3a. Invite a new staff member.
  if (action === "invite") {
    const email = String(body["email"] ?? "")
      .trim()
      .toLowerCase();
    const role = String(body["role"] ?? "");
    if (!EMAIL_RE.test(email)) return json(400, { error: "Please enter a valid email address." });
    if (!(ROLES as readonly string[]).includes(role))
      return json(400, { error: "Please choose a role." });

    const inviteRes = await sendInvite(email, role);
    const invited = (await readJson(inviteRes)) as Record<string, unknown> | null;
    if (!inviteRes.ok) {
      const msg = errorText(invited, "The invite could not be sent.");
      if (inviteRes.status === 422 || /already|exists|registered/i.test(msg)) {
        return json(409, {
          error:
            "This email already has a login. If they were removed before, ask the site manager to delete the old login in Supabase → Authentication → Users, then invite again.",
        });
      }
      if (inviteRes.status === 429 || /rate limit/i.test(msg)) {
        return json(429, {
          error: "Too many emails sent recently. Please wait an hour and try again.",
        });
      }
      return json(502, { error: msg });
    }
    const userId = String(
      (invited as { id?: string; user?: { id?: string } })?.id ??
        (invited as { user?: { id?: string } })?.user?.id ??
        "",
    );
    if (!UUID_RE.test(userId))
      return json(502, { error: "The invite was sent but no user was returned." });

    // Add the staff row as the owner (so RLS + the history log apply).
    const rowRes = await http(`${env.url}/rest/v1/admin_roles`, {
      method: "POST",
      headers: { ...asCaller, "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify({ user_id: userId, email, role, invited_by: caller.id }),
    });
    if (!rowRes.ok) {
      const detail = errorText(await readJson(rowRes), "Could not save the staff member.");
      // Don't leave an orphan login behind.
      await http(`${env.url}/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: serviceHeaders(env),
      });
      return json(400, { error: detail });
    }
    return json(200, { ok: true, user_id: userId, message: `Invite sent to ${email}.` });
  }

  // 3b. Send the invite email again (e.g. it went to spam or expired).
  if (action === "resend") {
    const email = String(body["email"] ?? "")
      .trim()
      .toLowerCase();
    if (!EMAIL_RE.test(email)) return json(400, { error: "Please enter a valid email address." });
    const res = await sendInvite(email, String(body["role"] ?? ""));
    if (!res.ok) {
      const msg = errorText(await readJson(res), "The invite could not be sent.");
      if (res.status === 422 || /already|exists|registered/i.test(msg)) {
        return json(409, {
          error:
            "This person has already set their password. They can use “Forgot password?” on the sign-in page.",
        });
      }
      return json(502, { error: msg });
    }
    return json(200, { ok: true, message: `Invite sent again to ${email}.` });
  }

  // 3c. Remove a staff member completely.
  if (action === "remove") {
    const userId = String(body["user_id"] ?? "");
    if (!UUID_RE.test(userId)) return json(400, { error: "Unknown staff member." });
    if (userId === caller.id) {
      return json(400, { error: "You can't remove yourself. Ask another owner to do it." });
    }
    const delRes = await http(`${env.url}/rest/v1/admin_roles?user_id=eq.${userId}`, {
      method: "DELETE",
      headers: { ...asCaller, prefer: "return=representation" },
    });
    const deleted = await readJson(delRes);
    if (!delRes.ok)
      return json(400, { error: errorText(deleted, "Could not remove this staff member.") });
    if (!Array.isArray(deleted) || deleted.length === 0) {
      return json(404, { error: "This staff member was not found." });
    }
    const authRes = await http(`${env.url}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: serviceHeaders(env),
    });
    if (!authRes.ok && authRes.status !== 404) {
      return json(200, {
        ok: true,
        warning:
          "Their access was removed, but the login could not be deleted. Delete it in Supabase → Authentication → Users.",
      });
    }
    return json(200, { ok: true, message: "Staff member removed." });
  }

  return json(400, { error: "Unknown action." });
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
    anonKey: deno.env.get("SUPABASE_ANON_KEY") || deno.env.get("ANON_KEY") || "",
    serviceKey: deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || deno.env.get("SERVICE_ROLE_KEY") || "",
    siteUrl: deno.env.get("SITE_URL") ?? "https://hangooldevelopment.com",
  };
  deno.serve((req) => handle(req, env));
}
