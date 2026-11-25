import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { PageHeading, SocialLinks } from "@/components/site";
import { InquiryForm } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { useSettings } from "@/data/live";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("contact", "/contact"),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  const loc = useLocalize();
  const settings = useSettings();
  usePageMeta(t.seo.contact);
  const address = loc(settings.address, settings.addressSo);
  const details = [
    {
      icon: Phone,
      title: t.contact.callUs,
      value: settings.phone,
      href: settings.phoneHref,
      external: false,
    },
    {
      icon: MessageCircle,
      title: t.common.whatsapp,
      value: settings.whatsapp,
      href: settings.whatsappUrl,
      external: true,
    },
    {
      icon: Mail,
      title: t.contact.emailUs,
      value: settings.email,
      href: settings.emailHref,
      external: false,
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        description={t.contact.description}
      />
      <section className="section">
        <div className="site-container grid lg:grid-cols-[1.3fr_1fr] gap-14">
          <div className="min-w-0">
            <h2 className="section-title">{t.contact.formTitle}</h2>
            <p className="section-copy mt-3 mb-8">{t.contact.formText}</p>
            <InquiryForm
              kind="contact"
              submitLabel={t.form.send}
              successText={t.contact.success}
              whatsappIntro={t.form.waContact}
            />
          </div>
          <aside className="min-w-0">
            <h2 className="text-2xl font-bold mb-7">{t.contact.asideTitle}</h2>
            <div className="space-y-6">
              {details.map((d) => (
                <div key={d.title} className="flex gap-4">
                  <d.icon className="size-5 text-primary mt-1 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold">{d.title}</h3>
                    <a
                      href={d.href}
                      dir="ltr"
                      className="section-copy mt-2 block break-all hover:text-primary"
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {d.value}
                    </a>
                  </div>
                </div>
              ))}
              {address && (
                <div className="flex gap-4">
                  <MapPin className="size-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold">{t.contact.findUs}</h3>
                    <p className="section-copy mt-2">{address}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <Button variant="outline" asChild>
                <a href={settings.phoneHref}>
                  <Phone />
                  {t.common.call}
                </a>
              </Button>
              <Button asChild>
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  {t.common.whatsapp}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={settings.emailHref}>
                  <Mail />
                  {t.common.email}
                </a>
              </Button>
            </div>
            <div className="mt-9">
              <h3 className="text-sm font-bold mb-4">{t.contact.follow}</h3>
              <SocialLinks variant="outline" />
            </div>
          </aside>
        </div>
      </section>
      {/* The map appears only once a location is saved in Admin → Settings. */}
      {settings.mapQuery && (
        <section className="pb-20">
          <div className="site-container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <h2 className="section-title">{t.contact.findUs}</h2>
              <Button variant="link" asChild className="px-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.contact.openMap} <ArrowUpRight />
                </a>
              </Button>
            </div>
            <div className="video-frame" style={{ aspectRatio: "16 / 7" }}>
              <iframe
                title={t.contact.mapTitle}
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
