import { describe, expect, it } from "vitest";
import {
  handle as staffAdmin,
  type Env as StaffEnv,
} from "../../supabase/functions/staff-admin/index";
import {
  compose,
  handle as notify,
  type Env as NotifyEnv,
} from "../../supabase/functions/notify-request/index";

/* ---------- a tiny stand-in for Supabase Auth/REST and Resend ---------- */

type Call = { method: string; url: string; headers: Record<string, string>; body: unknown };
const OWNER = "00000000-0000-4000-8000-00000000000a";
const EDITOR = "00000000-0000-4000-8000-00000000000b";
const NEW_USER = "00000000-0000-4000-8000-0000000000ff";

function fakeSupabase(opts: {
  callerRole?: { role: string; active: boolean } | null;
  inviteStatus?: number;
  rowStatus?: number;
  deleteRows?: unknown[];
  deleteStatus?: number;
  notifyEmail?: string | null;
  resendStatus?: number;
}) {
  const calls: Call[] = [];
  const http = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = String(input);
    const headers = Object.fromEntries(
      Object.entries((init.headers ?? {}) as Record<string, string>),
    );
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    const method = init.method ?? "GET";
    calls.push({ method, url, headers, body });
    const res = (status: number, data: unknown) =>
      new Response(data === undefined ? "" : JSON.stringify(data), { status });
    if (url.endsWith("/auth/v1/user")) {
      return headers["authorization"] === "Bearer owner-token"
        ? res(200, { id: OWNER, email: "owner@hangool.test" })
        : headers["authorization"] === "Bearer editor-token"
          ? res(200, { id: EDITOR, email: "editor@hangool.test" })
          : res(401, { msg: "invalid JWT" });
    }
    if (url.includes("/rest/v1/admin_roles?select=role,active")) {
      return res(
        200,
        opts.callerRole === null ? [] : [opts.callerRole ?? { role: "owner", active: true }],
      );
    }
    if (url.includes("/auth/v1/invite")) {
      return opts.inviteStatus && opts.inviteStatus >= 400
        ? res(opts.inviteStatus, {
            msg: "A user with this email address has already been registered",
          })
        : res(200, { id: NEW_USER, email: body?.email });
    }
    if (url.endsWith("/rest/v1/admin_roles") && method === "POST") {
      return opts.rowStatus && opts.rowStatus >= 400
        ? res(opts.rowStatus, { message: "new row violates row-level security policy" })
        : res(201, [{ ...body }]);
    }
    if (url.includes("/rest/v1/admin_roles?user_id=eq.") && method === "DELETE") {
      return opts.deleteStatus && opts.deleteStatus >= 400
        ? res(opts.deleteStatus, { message: "The website must keep at least one active owner." })
        : res(200, opts.deleteRows ?? [{ user_id: EDITOR }]);
    }
    if (url.includes("/auth/v1/admin/users/") && method === "DELETE") return res(200, {});
    if (url.includes("/rest/v1/site_settings"))
      return res(200, [{ notify_email: opts.notifyEmail ?? null }]);
    if (url === "https://api.resend.com/emails") {
      return res(
        opts.resendStatus ?? 200,
        opts.resendStatus ? { message: "invalid key" } : { id: "email_1" },
      );
    }
    return res(404, { message: "not mocked: " + url });
  }) as typeof fetch;
  return { http, calls };
}

const staffEnv: StaffEnv = {
  url: "https://x.supabase.co",
  anonKey: "sb_publishable_test",
  serviceKey: "sb_secret_test",
  siteUrl: "https://hangooldevelopment.com",
};
const call = (body: unknown, token = "owner-token") =>
  new Request("https://fn/staff-admin", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("staff-admin Edge Function", () => {
  it("refuses callers who are not signed in", async () => {
    const { http } = fakeSupabase({});
    const res = await staffAdmin(call({ action: "invite" }, "bad-token"), staffEnv, http);
    expect(res.status).toBe(401);
  });

  it("refuses editors (only owners can manage staff)", async () => {
    const { http, calls } = fakeSupabase({ callerRole: { role: "editor", active: true } });
    const res = await staffAdmin(
      call({ action: "invite", email: "a@b.co", role: "editor" }, "editor-token"),
      staffEnv,
      http,
    );
    expect(res.status).toBe(403);
    expect(calls.some((c) => c.url.includes("/invite"))).toBe(false);
  });

  it("refuses deactivated owners", async () => {
    const { http } = fakeSupabase({ callerRole: { role: "owner", active: false } });
    expect(
      (
        await staffAdmin(
          call({ action: "invite", email: "a@b.co", role: "editor" }),
          staffEnv,
          http,
        )
      ).status,
    ).toBe(403);
  });

  it("invites: sends the email with the service key and adds the row as the owner", async () => {
    const { http, calls } = fakeSupabase({});
    const res = await staffAdmin(
      call({ action: "invite", email: " New@Hangool.test ", role: "requests" }),
      staffEnv,
      http,
    );
    expect(res.status).toBe(200);
    const invite = calls.find((c) => c.url.includes("/auth/v1/invite"))!;
    expect(invite.headers["apikey"]).toBe("sb_secret_test");
    expect(invite.url).toContain(
      encodeURIComponent("https://hangooldevelopment.com/admin/reset-password"),
    );
    expect(invite.body).toMatchObject({ email: "new@hangool.test" });
    const row = calls.find((c) => c.url.endsWith("/rest/v1/admin_roles") && c.method === "POST")!;
    expect(row.headers["authorization"]).toBe("Bearer owner-token"); // RLS + history apply
    expect(row.headers["apikey"]).toBe("sb_publishable_test");
    expect(row.body).toEqual({
      user_id: NEW_USER,
      email: "new@hangool.test",
      role: "requests",
      invited_by: OWNER,
    });
  });

  it("rejects bad email addresses and unknown roles", async () => {
    const { http } = fakeSupabase({});
    expect(
      (await staffAdmin(call({ action: "invite", email: "nope", role: "editor" }), staffEnv, http))
        .status,
    ).toBe(400);
    expect(
      (await staffAdmin(call({ action: "invite", email: "a@b.co", role: "admin" }), staffEnv, http))
        .status,
    ).toBe(400);
  });

  it("explains when the email already has a login", async () => {
    const { http } = fakeSupabase({ inviteStatus: 422 });
    const res = await staffAdmin(
      call({ action: "invite", email: "a@b.co", role: "editor" }),
      staffEnv,
      http,
    );
    expect(res.status).toBe(409);
  });

  it("deletes the new login again if the staff row can't be saved", async () => {
    const { http, calls } = fakeSupabase({ rowStatus: 403 });
    const res = await staffAdmin(
      call({ action: "invite", email: "a@b.co", role: "editor" }),
      staffEnv,
      http,
    );
    expect(res.status).toBe(400);
    expect(
      calls.some(
        (c) => c.method === "DELETE" && c.url.endsWith(`/auth/v1/admin/users/${NEW_USER}`),
      ),
    ).toBe(true);
  });

  it("removes: deletes the row as the owner, then the login with the service key", async () => {
    const { http, calls } = fakeSupabase({});
    const res = await staffAdmin(call({ action: "remove", user_id: EDITOR }), staffEnv, http);
    expect(res.status).toBe(200);
    const del = calls.filter((c) => c.method === "DELETE");
    expect(del[0]!.url).toContain(`admin_roles?user_id=eq.${EDITOR}`);
    expect(del[0]!.headers["authorization"]).toBe("Bearer owner-token");
    expect(del[1]!.url).toContain(`/auth/v1/admin/users/${EDITOR}`);
    expect(del[1]!.headers["apikey"]).toBe("sb_secret_test");
  });

  it("won't remove yourself, and passes on the last-owner protection", async () => {
    const { http } = fakeSupabase({});
    expect(
      (await staffAdmin(call({ action: "remove", user_id: OWNER }), staffEnv, http)).status,
    ).toBe(400);
    const blocked = fakeSupabase({ deleteStatus: 400 });
    const res = await staffAdmin(
      call({ action: "remove", user_id: EDITOR }),
      staffEnv,
      blocked.http,
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toMatch(/at least one active owner/);
    expect(blocked.calls.some((c) => c.url.includes("/auth/v1/admin/users/"))).toBe(false);
  });

  it("sends a legacy service_role JWT as a Bearer token too", async () => {
    const { http, calls } = fakeSupabase({});
    await staffAdmin(
      call({ action: "resend", email: "a@b.co" }),
      { ...staffEnv, serviceKey: "eyJhbGciOi.legacy.key" },
      http,
    );
    expect(calls.find((c) => c.url.includes("/invite"))!.headers["authorization"]).toBe(
      "Bearer eyJhbGciOi.legacy.key",
    );
  });
});

/* ---------- notify-request ---------- */

const notifyEnv: NotifyEnv = {
  url: "https://x.supabase.co",
  serviceKey: "sb_secret_test",
  resendKey: "re_test",
  from: "Hangool Website <alerts@hangooldevelopment.com>",
  webhookSecret: "s3cret-value-123",
  siteUrl: "https://hangooldevelopment.com",
};
const hook = (payload: unknown, secret = "s3cret-value-123") =>
  new Request("https://fn/notify-request", {
    method: "POST",
    headers: { "x-webhook-secret": secret, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
const quote = {
  type: "INSERT",
  table: "quote_requests",
  record: {
    name: "Faisal <b>",
    phone: "+252 63 7778899",
    email: "faisal@example.com",
    service_type: "Commercial Construction",
    location: "Hargeisa",
    budget_range: "$50,000 – $150,000",
    message: "Office building,\n3 floors.",
    language: "so",
  },
};

describe("notify-request Edge Function", () => {
  it("rejects calls without the webhook secret", async () => {
    const { http, calls } = fakeSupabase({});
    expect((await notify(hook(quote, "wrong"), notifyEnv, http)).status).toBe(401);
    expect((await notify(hook(quote, ""), notifyEnv, http)).status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("emails the default address when no alert email is set", async () => {
    const { http, calls } = fakeSupabase({});
    const res = await notify(hook(quote), notifyEnv, http);
    expect(res.status).toBe(200);
    const mail = calls.find((c) => c.url === "https://api.resend.com/emails")!;
    expect(mail.headers["authorization"]).toBe("Bearer re_test");
    expect(mail.body).toMatchObject({
      from: "Hangool Website <alerts@hangooldevelopment.com>",
      to: ["info@hangooldevelopment.com"],
      reply_to: "faisal@example.com",
      subject: "New quote request: Faisal <b>",
    });
  });

  it("uses the alert email saved in Admin → Settings", async () => {
    const { http, calls } = fakeSupabase({ notifyEmail: "owner@hangool.test" });
    await notify(hook(quote), notifyEnv, http);
    expect((calls.find((c) => c.url.includes("resend"))!.body as { to: string[] }).to).toEqual([
      "owner@hangool.test",
    ]);
  });

  it("ignores updates and other tables", async () => {
    const { http, calls } = fakeSupabase({});
    expect(
      await (await notify(hook({ ...quote, type: "UPDATE" }), notifyEnv, http)).json(),
    ).toEqual({ skipped: true });
    expect(
      await (await notify(hook({ ...quote, table: "projects" }), notifyEnv, http)).json(),
    ).toEqual({ skipped: true });
    expect(calls.some((c) => c.url.includes("resend"))).toBe(false);
  });

  it("reports a Resend failure instead of pretending it worked", async () => {
    const { http } = fakeSupabase({ resendStatus: 403 });
    expect((await notify(hook(quote), notifyEnv, http)).status).toBe(502);
  });

  it("builds a safe email with every detail and quick-reply links", () => {
    const { subject, html, text } = compose("quote_requests", quote.record, notifyEnv.siteUrl);
    expect(subject).toBe("New quote request: Faisal <b>");
    expect(html).toContain("Faisal &lt;b&gt;"); // escaped, no HTML injection
    expect(html).not.toContain("Faisal <b>");
    for (const v of [
      "Commercial Construction",
      "Hargeisa",
      "$50,000 – $150,000",
      "Somali",
      "https://wa.me/252637778899",
      "tel:+252637778899",
      "/admin/requests?tab=quote_requests",
    ])
      expect(html).toContain(v);
    expect(text).toContain("Office building,\n3 floors.");
    const viewing = compose(
      "viewing_requests",
      { name: "Ali", phone: "063 1234567", property_name: "Villa", preferred_date: "2026-12-01" },
      notifyEnv.siteUrl,
    );
    expect(viewing.subject).toBe("New viewing request: Ali");
    expect(viewing.html).toContain("Villa");
    expect(viewing.html).toContain("2026-12-01");
  });
});
