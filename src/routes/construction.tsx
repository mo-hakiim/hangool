import { createFileRoute } from "@tanstack/react-router";
import {
  House,
  Building2,
  Factory,
  Route as RoadIcon,
  PencilRuler,
  Calculator,
  ClipboardCheck,
  Paintbrush,
  MessagesSquare,
} from "lucide-react";
import { images } from "../../company-data";
import { CTA, PageHeading } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/construction")({
  head: () => pageHead("construction", "/construction"),
  component: Construction,
});

const icons = [
  House,
  Building2,
  Factory,
  RoadIcon,
  PencilRuler,
  Calculator,
  ClipboardCheck,
  Paintbrush,
  MessagesSquare,
];

function Construction() {
  const { t } = useI18n();
  usePageMeta(t.seo.construction);
  return (
    <>
      <PageHeading
        eyebrow={t.construction.eyebrow}
        title={t.construction.title}
        description={t.construction.description}
      />
      <section className="section">
        <div className="site-container">
          <h2 className="section-title mb-9">{t.construction.listTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.construction.items.map((s, i) => {
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
      <section className="section bg-muted">
        <div className="site-container grid md:grid-cols-2 gap-14 items-center">
          <img
            src={images.construction}
            alt={t.construction.title}
            className="w-full aspect-[5/4] object-cover rounded-sm"
            loading="lazy"
            decoding="async"
          />
          <div>
            <div className="eyebrow text-primary mb-4">{t.construction.processEyebrow}</div>
            <h2 className="section-title">{t.construction.processTitle}</h2>
            <ol className="grid sm:grid-cols-2 gap-7 mt-8">
              {t.construction.steps.map((s, i) => (
                <li key={i} className="border-t-2 border-secondary pt-4">
                  <p className="text-primary text-xs font-bold">0{i + 1}</p>
                  <h3 className="font-bold mt-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6 mt-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
