import { createFileRoute } from "@tanstack/react-router";
import { MapPin, CalendarDays } from "lucide-react";
import { CTA, PageHeading } from "@/components/site";
import { DetailState, PhotoGallery } from "@/components/detail";
import { VideoEmbed } from "@/components/lightbox";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { useProject } from "@/data/live";
import { storageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/project")({
  head: () => pageHead("project", "/project"),
  validateSearch: (s: Record<string, unknown>): { id: string } => ({
    id: typeof s["id"] === "string" ? s["id"].slice(0, 64) : "",
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  const { id } = Route.useSearch();
  const { data, loading, error } = useProject(id);
  const p = data[0];
  const name = p ? loc(p.name, p.name_so) : "";
  const description = p ? loc(p.description, p.description_so) : "";
  usePageMeta(
    p
      ? {
          title: name,
          description: description || `${t.projects.categories[p.category]} · ${p.location ?? ""}`,
          image: p.images[0] ? storageUrl(p.images[0]) : null,
        }
      : t.seo.project,
  );

  return (
    <DetailState
      loading={loading}
      error={error}
      found={!!p}
      back="/projects"
      backLabel={t.projects.back}
    >
      {p && (
        <>
          <PageHeading
            eyebrow={`${t.projects.categories[p.category]} · ${t.projects.statuses[p.status]}`}
            title={name}
            description={p.location ?? ""}
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
                {p.video_urls.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-5">{t.projects.videos}</h2>
                    <div className="grid gap-5">
                      {p.video_urls.map((v) => (
                        <VideoEmbed key={v} url={v} title={name} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <aside className="min-w-0 space-y-6">
                <dl className="fact-list border border-border rounded-sm p-5">
                  {p.location && (
                    <div className="col-span-2">
                      <dt className="flex items-center gap-1">
                        <MapPin className="size-3" /> {t.search.location}
                      </dt>
                      <dd>{p.location}</dd>
                    </div>
                  )}
                  {p.start_date && (
                    <div>
                      <dt className="flex items-center gap-1">
                        <CalendarDays className="size-3" /> {t.projects.started}
                      </dt>
                      <dd>{formatDate(p.start_date, lang)}</dd>
                    </div>
                  )}
                  {p.end_date && (
                    <div>
                      <dt className="flex items-center gap-1">
                        <CalendarDays className="size-3" />{" "}
                        {p.status === "completed" ? t.projects.finished : t.projects.expected}
                      </dt>
                      <dd>{formatDate(p.end_date, lang)}</dd>
                    </div>
                  )}
                </dl>
                {description && <p className="section-copy prose-text">{description}</p>}
              </aside>
            </div>
          </section>
          <CTA />
        </>
      )}
    </DetailState>
  );
}
