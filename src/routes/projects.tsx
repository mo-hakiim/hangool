import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { images } from "../../company-data";
import { CTA, EmptyState, LoadingGrid, MediaCard, PageHeading } from "@/components/site";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { useProjects, type ProjectCategory, type ProjectStatus } from "@/data/live";
import { storageUrl } from "@/lib/supabase";

const STATUSES: ProjectStatus[] = ["completed", "ongoing", "upcoming"];
const CATEGORIES: ProjectCategory[] = [
  "residential",
  "commercial",
  "industrial",
  "road",
  "renovation",
  "other",
];

type Search = { status?: ProjectStatus | undefined; category?: ProjectCategory | undefined };

export const Route = createFileRoute("/projects")({
  head: () => pageHead("projects", "/projects"),
  validateSearch: (s: Record<string, unknown>): Search => ({
    status: STATUSES.includes(s["status"] as ProjectStatus)
      ? (s["status"] as ProjectStatus)
      : undefined,
    category: CATEGORIES.includes(s["category"] as ProjectCategory)
      ? (s["category"] as ProjectCategory)
      : undefined,
  }),
  component: Projects,
});

function Projects() {
  const { t } = useI18n();
  const loc = useLocalize();
  usePageMeta(t.seo.projects);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/projects" });
  const projects = useProjects();
  const set = (patch: Search) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });
  const results = projects.data.filter(
    (p) =>
      (!search.status || p.status === search.status) &&
      (!search.category || p.category === search.category),
  );
  const usedCategories = CATEGORIES.filter((c) => projects.data.some((p) => p.category === c));

  return (
    <>
      <PageHeading
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
      />
      <section className="section">
        <div className="site-container">
          {projects.loading ? (
            <LoadingGrid count={6} />
          ) : !projects.data.length ? (
            <EmptyState
              title={t.projects.emptyTitle}
              text={t.projects.emptyText}
              offline={projects.error}
            />
          ) : (
            <>
              <div className="space-y-4 mb-10">
                <div className="filter-bar" role="group" aria-label={t.projects.status}>
                  <Button
                    variant={!search.status ? "default" : "outline"}
                    aria-pressed={!search.status}
                    onClick={() => set({ status: undefined })}
                  >
                    {t.projects.allStatuses}
                  </Button>
                  {STATUSES.map((s) => (
                    <Button
                      key={s}
                      variant={search.status === s ? "default" : "outline"}
                      aria-pressed={search.status === s}
                      onClick={() => set({ status: s })}
                    >
                      {t.projects.statuses[s]}
                    </Button>
                  ))}
                </div>
                {usedCategories.length > 1 && (
                  <div className="filter-bar" role="group" aria-label={t.projects.category}>
                    <Button
                      size="sm"
                      variant={!search.category ? "secondary" : "ghost"}
                      aria-pressed={!search.category}
                      onClick={() => set({ category: undefined })}
                    >
                      {t.projects.allCategories}
                    </Button>
                    {usedCategories.map((c) => (
                      <Button
                        key={c}
                        size="sm"
                        variant={search.category === c ? "secondary" : "ghost"}
                        aria-pressed={search.category === c}
                        onClick={() => set({ category: c })}
                      >
                        {t.projects.categories[c]}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              {results.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
                  {results.map((p) => (
                    <MediaCard
                      key={p.id}
                      to="/project"
                      id={p.id}
                      image={p.images[0] ? storageUrl(p.images[0]) : images.construction}
                      title={loc(p.name, p.name_so)}
                      eyebrow={t.projects.categories[p.category]}
                      location={p.location}
                      badge={t.projects.statuses[p.status]}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-state section-copy">{t.projects.noResults}</p>
              )}
            </>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
