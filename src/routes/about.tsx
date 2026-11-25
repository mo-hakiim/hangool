import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Target, Handshake, Hammer, Landmark } from "lucide-react";
import { images } from "../../company-data";
import { CTA, PageHeading, TextLink } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/about")({
  head: () => pageHead("about", "/about"),
  component: About,
});

function About() {
  const { t } = useI18n();
  usePageMeta(t.seo.about);
  const icons = [Compass, Target, Handshake, Hammer, Landmark];
  return (
    <>
      <PageHeading
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        description={t.about.description}
      />
      <section className="section">
        <div className="site-container grid md:grid-cols-2 gap-12 items-center">
          <img
            src={images.residence}
            alt={t.about.imageAlt}
            className="w-full aspect-[4/3] object-cover rounded-sm"
            loading="lazy"
            decoding="async"
          />
          <div>
            <div className="eyebrow text-primary mb-4">{t.about.aboutEyebrow}</div>
            <h2 className="section-title">
              {t.about.aboutTitle1}
              <br />
              {t.about.aboutTitle2}
            </h2>
            <p className="section-copy mt-6">{t.about.story}</p>
            <p className="text-primary font-semibold mt-5 flex items-center gap-2">
              <ArrowUpRight className="size-4" />
              {t.common.location}
            </p>
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container grid md:grid-cols-2 gap-12">
          {[
            { title: t.about.missionTitle, text: t.about.mission },
            { title: t.about.visionTitle, text: t.about.vision },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="section-title">{s.title}</h2>
              <p className="section-copy mt-5">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">{t.about.valuesEyebrow}</div>
          <h2 className="section-title mb-8">{t.about.valuesTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.about.values.map((v, i) => {
              const Icon = icons[i];
              return (
                <div className="service-card" key={i}>
                  {Icon && <Icon className="service-icon" />}
                  <h3 className="text-sm font-bold leading-6">{v}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow text-primary mb-4">{t.about.teamEyebrow}</div>
            <h2 className="section-title">{t.about.teamTitle}</h2>
          </div>
          <div className="flex flex-wrap gap-8">
            <TextLink to="/team">{t.about.teamLink}</TextLink>
            <TextLink to="/careers">{t.about.careersLink}</TextLink>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
