import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MapPin, CalendarDays, Mail } from "lucide-react";
import { CTA, EmptyState, LoadingGrid, PageHeading } from "@/components/site";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { fill, useI18n, useLocalize } from "@/i18n";
import { useJobs, useSettings } from "@/data/live";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/careers")({
  head: () => pageHead("careers", "/careers"),
  component: Careers,
});

function Careers() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  const settings = useSettings();
  usePageMeta(t.seo.careers);
  const jobs = useJobs();
  const today = new Date().toISOString().slice(0, 10);
  // Jobs past their deadline are hidden automatically.
  const open = jobs.data.filter((j) => !j.deadline || j.deadline >= today);
  return (
    <>
      <PageHeading
        eyebrow={t.careers.eyebrow}
        title={t.careers.title}
        description={t.careers.description}
      />
      <section className="section">
        <div className="site-container">
          {jobs.loading ? (
            <LoadingGrid count={2} className="lg:grid-cols-2" />
          ) : open.length ? (
            <div className="grid gap-5">
              {open.map((j) => {
                const title = loc(j.title, j.title_so);
                return (
                  <article key={j.id} className="border border-border rounded-sm p-6 bg-card">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-5 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Briefcase className="size-4" /> {t.careers.types[j.employment_type]}
                            {j.department ? ` · ${j.department}` : ""}
                          </span>
                          {j.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-4" /> {j.location}
                            </span>
                          )}
                          {j.deadline && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="size-4" />
                              {fill(t.careers.deadline, { date: formatDate(j.deadline, lang) })}
                            </span>
                          )}
                        </p>
                      </div>
                      <Button asChild>
                        <a href={`${settings.emailHref}?subject=${encodeURIComponent(title)}`}>
                          <Mail /> {t.careers.applyEmail}
                        </a>
                      </Button>
                    </div>
                    {loc(j.description, j.description_so) && (
                      <p className="section-copy prose-text mt-4">
                        {loc(j.description, j.description_so)}
                      </p>
                    )}
                  </article>
                );
              })}
              <p className="section-copy">
                <strong>{t.careers.apply}:</strong>{" "}
                {fill(t.careers.applyText, { email: settings.email })}
              </p>
            </div>
          ) : (
            <EmptyState
              title={t.careers.emptyTitle}
              text={fill(t.careers.emptyText, { email: settings.email })}
              offline={jobs.error}
            >
              <Button variant="outline" asChild>
                <a href={settings.emailHref}>
                  <Mail /> {settings.email}
                </a>
              </Button>
            </EmptyState>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
