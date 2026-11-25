import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { CTA, EmptyState, LoadingGrid, PageHeading } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { useTeam } from "@/data/live";
import { storageUrl } from "@/lib/supabase";

export const Route = createFileRoute("/team")({
  head: () => pageHead("team", "/team"),
  component: Team,
});

function Team() {
  const { t } = useI18n();
  const loc = useLocalize();
  usePageMeta(t.seo.team);
  const team = useTeam();
  return (
    <>
      <PageHeading eyebrow={t.team.eyebrow} title={t.team.title} description={t.team.description} />
      <section className="section">
        <div className="site-container">
          {team.loading ? (
            <LoadingGrid count={3} />
          ) : team.data.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
              {team.data.map((m) => (
                <article key={m.id}>
                  {m.photo ? (
                    <img
                      src={storageUrl(m.photo)}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/4.4] object-cover rounded-sm bg-muted"
                    />
                  ) : (
                    <div className="bg-muted aspect-[4/4.4] rounded-sm flex items-center justify-center">
                      <UserRound className="size-20 text-primary/30" strokeWidth={1} />
                    </div>
                  )}
                  <h2 className="mt-5 font-bold">{m.name}</h2>
                  <p className="text-primary text-sm font-semibold mt-1">
                    {loc(m.role, m.role_so)}
                  </p>
                  {loc(m.bio, m.bio_so) && (
                    <p className="section-copy mt-3 prose-text">{loc(m.bio, m.bio_so)}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title={t.team.emptyTitle} text={t.team.emptyText} offline={team.error} />
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
