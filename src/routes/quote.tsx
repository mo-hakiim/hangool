import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { PageHeading } from "@/components/site";
import { InquiryForm, useFieldErrors } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { useSettings } from "@/data/live";

export const Route = createFileRoute("/quote")({
  head: () => pageHead("quote", "/quote"),
  component: Quote,
});

function QuoteFields() {
  const { t } = useI18n();
  const { err, aria } = useFieldErrors();
  const services = [
    ...t.construction.items.map((s) => s.title),
    ...t.realEstate.items.map((s) => s.title),
  ];
  return (
    <>
      <label className="block text-sm font-semibold">
        {t.quote.serviceType}
        <select className="field" name="service_type" defaultValue="" {...aria("service_type")}>
          <option value="" disabled>
            {t.quote.selectService}
          </option>
          {[...new Set(services)].map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>{t.quote.other}</option>
        </select>
        {err("service_type")}
      </label>
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="text-sm font-semibold">
          {t.quote.location}
          <input
            className="field"
            name="location"
            maxLength={160}
            placeholder={t.common.location}
          />
        </label>
        <label className="text-sm font-semibold">
          {t.quote.budget}
          <select className="field" name="budget_range" defaultValue="">
            <option value="">{t.quote.selectBudget}</option>
            {t.quote.budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}

function Quote() {
  const { t } = useI18n();
  const settings = useSettings();
  usePageMeta(t.seo.quote);
  return (
    <>
      <PageHeading
        eyebrow={t.quote.eyebrow}
        title={t.quote.title}
        description={t.quote.description}
      />
      <section className="section">
        <div className="site-container grid lg:grid-cols-[1.3fr_1fr] gap-14">
          <div className="min-w-0">
            <h2 className="section-title">{t.quote.formTitle}</h2>
            <p className="section-copy mt-3 mb-8">{t.quote.formText}</p>
            <InquiryForm
              kind="quote"
              submitLabel={t.form.sendQuote}
              successText={t.quote.success}
              whatsappIntro="Hello Hangool, I would like a quote."
            >
              <QuoteFields />
            </InquiryForm>
          </div>
          <aside className="min-w-0">
            <h2 className="text-2xl font-bold mb-7">{t.quote.asideTitle}</h2>
            <ol className="space-y-6">
              {t.quote.steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-secondary font-bold text-lg leading-6">0{i + 1}</span>
                  <p className="section-copy">{s}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3 mt-9">
              <Button asChild>
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> {t.common.whatsapp}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={settings.phoneHref}>
                  <Phone /> <span dir="ltr">{settings.phone}</span>
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
