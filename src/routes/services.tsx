import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, HardHat, KeyRound } from "lucide-react";
import { images } from "../../company-data";
import { CTA, PageHeading } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/services")({
  head: () => pageHead("services", "/services"),
  component: Services,
});

const serviceImages = [
  images.residence,
  images.commercial,
  images.interior,
  images.construction,
  images.construction,
];

function Services() {
  const { t } = useI18n();
  usePageMeta(t.seo.services);
  return (
    <>
      <PageHeading
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        description={t.services.description}
      />
      <section className="section">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">{t.services.deptEyebrow}</div>
          <h2 className="section-title mb-9">{t.services.deptTitle}</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {(
              [
                ["/construction", HardHat, t.services.construction],
                ["/real-estate", KeyRound, t.services.realEstate],
              ] as const
            ).map(([to, Icon, d]) => (
              <Link key={to} to={to} className="service-card">
                <Icon className="service-icon" />
                <h3 className="font-bold text-lg">{d.title}</h3>
                <p className="section-copy mt-3">{d.text}</p>
                <span className="text-primary text-sm font-bold mt-5 flex items-center gap-2">
                  {t.services.explore} <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="site-container">
        {t.services.items.map((s, i) => (
          <section
            key={i}
            className="section border-t border-border grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <img
              src={serviceImages[i] ?? images.construction}
              alt={s.title}
              loading="lazy"
              decoding="async"
              className={`w-full aspect-[4/3] object-cover rounded-sm ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <div className="eyebrow text-primary mb-4">
                0{i + 1} / {t.services.listEyebrow}
              </div>
              <h2 className="section-title">{s.title}</h2>
              <p className="section-copy mt-5">
                {s.short} {t.services.workWithYou}
              </p>
              <ul className="space-y-4 mt-7">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
      <CTA />
    </>
  );
}
