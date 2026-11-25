import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Bath, Ruler, MapPin, MessageCircle, Phone, CalendarDays } from "lucide-react";
import { PageHeading } from "@/components/site";
import { DetailState, PhotoGallery } from "@/components/detail";
import { InquiryForm } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { fill, useI18n, useLocalize } from "@/i18n";
import { useProperty, useSettings } from "@/data/live";
import { storageUrl } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/property")({
  head: () => pageHead("property", "/property"),
  validateSearch: (s: Record<string, unknown>): { id: string } => ({
    id: typeof s["id"] === "string" ? s["id"].slice(0, 64) : "",
  }),
  component: PropertyPage,
});

function ViewingDate() {
  const { t } = useI18n();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <label className="block text-sm font-semibold">
      {t.property.preferredDate}
      <input className="field" type="date" name="preferred_date" min={today} />
    </label>
  );
}

function PropertyPage() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  const settings = useSettings();
  const { id } = Route.useSearch();
  const { data, loading, error } = useProperty(id);
  const p = data[0];
  const name = p ? loc(p.name, p.name_so) : "";
  const description = p ? loc(p.description, p.description_so) : "";
  const price =
    p?.price != null
      ? formatPrice(p.price, lang) + (p.deal === "rent" ? ` ${t.property.perMonth}` : "")
      : t.property.priceOnRequest;
  usePageMeta(
    p
      ? {
          title: name,
          description:
            description || `${t.property.types[p.property_type]} · ${price} · ${p.location}`,
          image: p.images[0] ? storageUrl(p.images[0]) : null,
        }
      : t.seo.property,
  );
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const waText = p ? `${fill(t.property.whatsappText, { name })}\n${pageUrl}` : "";
  const open = p && (p.availability === "available" || p.availability === "reserved");

  return (
    <DetailState
      loading={loading}
      error={error}
      found={!!p}
      back="/real-estate"
      backLabel={t.property.back}
    >
      {p && (
        <>
          <PageHeading
            eyebrow={`${t.property.types[p.property_type]} · ${t.property.deal[p.deal]} · ${t.property.availability[p.availability]}`}
            title={name}
            description={p.location}
          />
          <section className="section">
            <div className="site-container detail-grid">
              <div className="min-w-0 space-y-10">
                <PhotoGallery
                  photos={p.images.map((src, i) => ({
                    src: storageUrl(src),
                    alt: `${name} — ${t.common.photo.replace("{n}", String(i + 1))}`,
                  }))}
                />
                {description && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">{t.property.description}</h2>
                    <p className="section-copy prose-text">{description}</p>
                  </div>
                )}
              </div>
              <aside className="min-w-0 space-y-6">
                <div className="border border-border rounded-sm p-5 space-y-5">
                  <div>
                    <p className="text-xs text-muted-foreground">{t.property.price}</p>
                    <p className="text-2xl font-bold text-primary mt-1">{price}</p>
                  </div>
                  <dl className="fact-list">
                    <div className="col-span-2">
                      <dt className="flex items-center gap-1">
                        <MapPin className="size-3" /> {t.search.location}
                      </dt>
                      <dd>{p.location}</dd>
                    </div>
                    {p.bedrooms != null && (
                      <div>
                        <dt className="flex items-center gap-1">
                          <BedDouble className="size-3" /> {t.search.bedrooms}
                        </dt>
                        <dd>{p.bedrooms}</dd>
                      </div>
                    )}
                    {p.bathrooms != null && (
                      <div>
                        <dt className="flex items-center gap-1">
                          <Bath className="size-3" /> {t.search.bathrooms}
                        </dt>
                        <dd>{p.bathrooms}</dd>
                      </div>
                    )}
                    {p.size_sqm != null && (
                      <div>
                        <dt className="flex items-center gap-1">
                          <Ruler className="size-3" /> {t.property.sizeLabel}
                        </dt>
                        <dd>{fill(t.property.size, { n: p.size_sqm })}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a
                        href={`${settings.whatsappUrl}?text=${encodeURIComponent(waText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle /> {t.property.askWhatsApp}
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={settings.phoneHref}>
                        <Phone /> {t.common.call}
                      </a>
                    </Button>
                  </div>
                </div>
                {open && (
                  <div className="border border-border rounded-sm p-5" id="viewing">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <CalendarDays className="size-5 text-primary" /> {t.property.viewingTitle}
                    </h2>
                    <p className="section-copy mt-2 mb-5">{t.property.viewingText}</p>
                    <InquiryForm
                      kind="viewing"
                      extra={{ property_id: p.id, property_name: p.name }}
                      submitLabel={t.form.sendViewing}
                      successText={t.property.viewingSuccess}
                      whatsappIntro={`${fill(t.property.whatsappText, { name })}\n${pageUrl}`}
                    >
                      <ViewingDate />
                    </InquiryForm>
                  </div>
                )}
              </aside>
            </div>
          </section>
        </>
      )}
    </DetailState>
  );
}
