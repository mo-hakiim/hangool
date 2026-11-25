import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Tag,
  KeyRound,
  Mountain,
  House,
  Store,
  Building,
  Castle,
  ShieldCheck,
  Building2,
  RotateCcw,
} from "lucide-react";
import { images } from "../../company-data";
import { CTA, EmptyState, LoadingGrid, MediaCard, PageHeading } from "@/components/site";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { fill, useI18n, useLocalize } from "@/i18n";
import { useProperties, type Availability, type PropertyRow, type PropertyType } from "@/data/live";
import { storageUrl } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";

type Search = {
  location?: string | undefined;
  type?: PropertyType | undefined;
  deal?: "sale" | "rent" | undefined;
  min?: number | undefined;
  max?: number | undefined;
  beds?: number | undefined;
  baths?: number | undefined;
  size?: number | undefined;
  status?: Availability | undefined;
};

const TYPES: PropertyType[] = ["apartment", "villa", "house", "land", "commercial", "office"];
const AVAIL: Availability[] = ["available", "reserved", "sold", "rented", "unavailable"];
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : undefined);

export const Route = createFileRoute("/real-estate")({
  head: () => pageHead("realEstate", "/real-estate"),
  validateSearch: (s: Record<string, unknown>): Search => ({
    location: str(s["location"]),
    type: TYPES.includes(s["type"] as PropertyType) ? (s["type"] as PropertyType) : undefined,
    deal: s["deal"] === "sale" || s["deal"] === "rent" ? s["deal"] : undefined,
    min: num(s["min"]),
    max: num(s["max"]),
    beds: num(s["beds"]),
    baths: num(s["baths"]),
    size: num(s["size"]),
    status: AVAIL.includes(s["status"] as Availability) ? (s["status"] as Availability) : undefined,
  }),
  component: RealEstate,
});

const icons = [Tag, KeyRound, Mountain, House, Store, Building, Castle, ShieldCheck, Building2];

function matches(p: PropertyRow, f: Search) {
  if (f.location && p.location.toLowerCase() !== f.location.toLowerCase()) return false;
  if (f.type && p.property_type !== f.type) return false;
  if (f.deal && p.deal !== f.deal) return false;
  if (f.min && (p.price == null || p.price < f.min)) return false;
  if (f.max && (p.price == null || p.price > f.max)) return false;
  if (f.beds && (p.bedrooms ?? 0) < f.beds) return false;
  if (f.baths && (p.bathrooms ?? 0) < f.baths) return false;
  if (f.size && (p.size_sqm ?? 0) < f.size) return false;
  if (f.status && p.availability !== f.status) return false;
  return true;
}

function RealEstate() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  usePageMeta(t.seo.realEstate);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/real-estate" });
  const properties = useProperties();

  const locations = useMemo(
    () =>
      [...new Set(properties.data.map((p) => p.location.trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [properties.data],
  );
  const results = properties.data.filter((p) => matches(p, search));
  const set = (patch: Partial<Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const active = Object.values(search).some((v) => v !== undefined);

  const select = (
    id: keyof Search,
    label: string,
    value: string | undefined,
    options: [string, string][],
    anyLabel: string,
  ) => (
    <label className="text-xs font-semibold" htmlFor={`f-${id}`}>
      {label}
      <select
        id={`f-${id}`}
        className="field"
        value={value ?? ""}
        onChange={(e) => set({ [id]: e.target.value || undefined } as Partial<Search>)}
      >
        <option value="">{anyLabel}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
  const number = (id: keyof Search, label: string, value: number | undefined) => (
    <label className="text-xs font-semibold" htmlFor={`f-${id}`}>
      {label}
      <input
        id={`f-${id}`}
        className="field"
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ""}
        onChange={(e) => set({ [id]: num(e.target.value) } as Partial<Search>)}
      />
    </label>
  );
  const counts: [string, string][] = [1, 2, 3, 4, 5].map((n) => [String(n), `${n}+`]);

  return (
    <>
      <PageHeading
        eyebrow={t.realEstate.eyebrow}
        title={t.realEstate.title}
        description={t.realEstate.description}
      />
      <section className="section">
        <div className="site-container">
          <h2 className="section-title mb-9">{t.realEstate.listTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.realEstate.items.map((s, i) => {
              const Icon = icons[i] ?? House;
              return (
                <div key={i} className="service-card">
                  <Icon className="service-icon" />
                  <h3 className="font-bold text-sm leading-6">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-6 mt-3">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section bg-muted" id="properties">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">{t.realEstate.listingsEyebrow}</div>
          <h2 className="section-title mb-8">{t.realEstate.listingsTitle}</h2>
          {properties.loading ? (
            <LoadingGrid />
          ) : !properties.data.length ? (
            <EmptyState
              title={t.search.emptyTitle}
              text={t.search.emptyText}
              offline={properties.error}
            />
          ) : (
            <>
              <form
                className="bg-background border border-border rounded-sm p-5 mb-9"
                aria-label={t.search.title}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {select(
                    "location",
                    t.search.location,
                    search.location,
                    locations.map((l) => [l, l]),
                    t.search.anyLocation,
                  )}
                  {select(
                    "type",
                    t.search.type,
                    search.type,
                    TYPES.map((v) => [v, t.property.types[v]]),
                    t.search.anyType,
                  )}
                  {select(
                    "deal",
                    t.search.deal,
                    search.deal,
                    [
                      ["sale", t.property.deal.sale],
                      ["rent", t.property.deal.rent],
                    ],
                    t.search.anyDeal,
                  )}
                  {number("min", t.search.minPrice, search.min)}
                  {number("max", t.search.maxPrice, search.max)}
                  {select("beds", t.search.bedrooms, search.beds?.toString(), counts, t.search.any)}
                  {select(
                    "baths",
                    t.search.bathrooms,
                    search.baths?.toString(),
                    counts,
                    t.search.any,
                  )}
                  {number("size", t.search.minSize, search.size)}
                  {select(
                    "status",
                    t.search.availability,
                    search.status,
                    AVAIL.map((v) => [v, t.property.availability[v]]),
                    t.search.anyAvailability,
                  )}
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      disabled={!active}
                      onClick={() => navigate({ search: {}, replace: true, resetScroll: false })}
                    >
                      <RotateCcw /> {t.search.reset}
                    </Button>
                  </div>
                </div>
              </form>
              <p className="text-sm text-muted-foreground mb-6" role="status">
                {fill(t.search.results, { n: results.length })}
              </p>
              {results.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
                  {results.map((p) => (
                    <MediaCard
                      key={p.id}
                      to="/property"
                      id={p.id}
                      image={p.images[0] ? storageUrl(p.images[0]) : images.residence}
                      title={loc(p.name, p.name_so)}
                      eyebrow={`${t.property.types[p.property_type]} · ${
                        p.price != null
                          ? formatPrice(p.price, lang) +
                            (p.deal === "rent" ? ` ${t.property.perMonth}` : "")
                          : t.property.priceOnRequest
                      }`}
                      location={p.location}
                      badge={
                        p.availability === "available"
                          ? t.property.deal[p.deal]
                          : t.property.availability[p.availability]
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-state section-copy">{t.search.noResults}</p>
              )}
            </>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
