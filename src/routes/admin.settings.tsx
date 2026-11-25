import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { BarChart3, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";

import { company } from "../../company-data";
import { useAdminRows, useAdminWrite } from "@/admin/data";
import { ErrorBox, Field, Panel, Spinner, errorMessage, inputClass } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import type { SettingsRow, Stats } from "@/data/live";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

const STAT_LABELS: [keyof Stats, string][] = [
  ["years", "Years of experience"],
  ["projects", "Projects delivered"],
  ["clients", "Happy clients"],
  ["professionals", "Skilled professionals"],
];
const TEXT_FIELDS = [
  "phone",
  "whatsapp",
  "email",
  "facebook",
  "tiktok",
  "instagram",
  "youtube",
  "address",
  "address_so",
  "map_query",
] as const;
type TextField = (typeof TEXT_FIELDS)[number];

const defaultSocial = (name: string) => company.socials.find((s) => s.name === name)?.url ?? "";
const placeholders: Record<TextField, string> = {
  phone: company.phone,
  whatsapp: company.whatsapp,
  email: company.email,
  facebook: defaultSocial("Facebook"),
  tiktok: defaultSocial("TikTok"),
  instagram: defaultSocial("Instagram"),
  youtube: defaultSocial("YouTube"),
  address: "e.g. Road 1, Jigjiga Yar, Hargeisa",
  address_so: "tusaale: Waddada 1, Jigjiga Yar, Hargeysa",
  map_query: "e.g. Hangool office, Hargeisa  —  or  9.5624, 44.0770",
};

function Settings() {
  const query = useAdminRows<SettingsRow>("site_settings", "select=*&id=eq.1");
  const write = useAdminWrite("site_settings");
  const row = query.data?.[0];

  const [text, setText] = useState<Record<TextField, string>>(
    () => Object.fromEntries(TEXT_FIELDS.map((k) => [k, ""])) as Record<TextField, string>,
  );
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Record<keyof Stats, string>>({
    years: String(company.suggestedStats.years),
    projects: String(company.suggestedStats.projects),
    clients: String(company.suggestedStats.clients),
    professionals: String(company.suggestedStats.professionals),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!row) return;
    setText(
      Object.fromEntries(TEXT_FIELDS.map((k) => [k, row[k] ?? ""])) as Record<TextField, string>,
    );
    setShowStats(!!row.stats);
    if (row.stats)
      setStats({
        years: String(row.stats.years),
        projects: String(row.stats.projects),
        clients: String(row.stats.clients),
        professionals: String(row.stats.professionals),
      });
  }, [row]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    let statsValue: Stats | null = null;
    if (showStats) {
      const parsed = Object.fromEntries(
        STAT_LABELS.map(([k]) => [k, Math.round(Number(stats[k]))]),
      ) as Stats;
      if (Object.values(parsed).some((n) => !Number.isFinite(n) || n <= 0))
        return setError("Each figure must be a whole number above zero.");
      statsValue = parsed;
    }
    for (const k of ["facebook", "tiktok", "instagram", "youtube"] as const) {
      if (text[k].trim() && !/^https:\/\//.test(text[k].trim()))
        return setError(`The ${k} link must start with https://`);
    }
    if (text.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email.trim()))
      return setError("The email address doesn't look right.");
    const patch: Record<string, unknown> = { stats: statsValue };
    for (const k of TEXT_FIELDS) patch[k] = text[k].trim() || null;
    setBusy(true);
    try {
      await write.save("1", patch);
      toast.success("Settings saved. The website shows them straight away.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (query.isPending)
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  if (query.isError) return <ErrorBox message={errorMessage(query.error)} />;

  const input = (k: TextField, label: string, hint?: string, type = "text") => (
    <Field label={label} hint={hint}>
      <input
        className={inputClass}
        type={type}
        value={text[k]}
        placeholder={placeholders[k]}
        onChange={(e) => setText((t) => ({ ...t, [k]: e.target.value }))}
      />
    </Field>
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Company figures and contact details used across the website.
        </p>
      </div>

      <Panel title="Company figures">
        <p className="text-sm text-muted-foreground flex gap-2">
          <BarChart3 className="size-4 shrink-0 mt-0.5 text-primary" />
          These numbers appear on the home page only after you confirm them here. The suggested
          values are not shown publicly until you save.
        </p>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            className="size-4"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
          />
          Show these figures on the website
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {STAT_LABELS.map(([k, label]) => (
            <Field key={k} label={label} hint={`Shown as “${stats[k] || "0"}+”`}>
              <input
                className={inputClass}
                type="number"
                min={1}
                step={1}
                disabled={!showStats}
                value={stats[k]}
                onChange={(e) => setStats((s) => ({ ...s, [k]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
      </Panel>

      <Panel title="Contact details">
        <p className="text-sm text-muted-foreground flex gap-2 mb-4">
          <Phone className="size-4 shrink-0 mt-0.5 text-primary" />
          Leave a field empty to use the built-in value shown in grey.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {input("phone", "Phone number")}
          {input(
            "whatsapp",
            "WhatsApp number",
            "Used for every WhatsApp button and form fallback.",
          )}
          {input("email", "Email address", undefined, "email")}
          <div />
          {input("facebook", "Facebook page link")}
          {input("tiktok", "TikTok link")}
          {input("instagram", "Instagram link")}
          {input("youtube", "YouTube link")}
        </div>
      </Panel>

      <Panel title="Office location and map">
        <p className="text-sm text-muted-foreground flex gap-2 mb-4">
          <MapPin className="size-4 shrink-0 mt-0.5 text-primary" />
          The address and Google map appear on the Contact page only once you fill them in.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {input("address", "Address (English)")}
          {input("address_so", "Address (Somali)")}
          <div className="sm:col-span-2">
            {input(
              "map_query",
              "Map location",
              "What you would type into Google Maps — an address, a place name, or coordinates like 9.5624, 44.0770.",
            )}
          </div>
        </div>
      </Panel>

      <ErrorBox message={error} />
      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="lg" disabled={busy} className="shadow-lg">
          {busy ? (
            <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            <Save />
          )}
          Save settings
        </Button>
      </div>
    </form>
  );
}
