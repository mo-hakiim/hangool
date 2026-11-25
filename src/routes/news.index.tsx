import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { images } from "../../company-data";
import { CTA, EmptyState, LoadingGrid, PageHeading, SocialLinks } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { usePosts } from "@/data/live";
import { storageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/news/")({
  head: () => pageHead("news", "/news"),
  component: News,
});

function News() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  usePageMeta(t.seo.news);
  const posts = usePosts();
  return (
    <>
      <PageHeading eyebrow={t.news.eyebrow} title={t.news.title} description={t.news.description} />
      <section className="section">
        <div className="site-container">
          {posts.loading ? (
            <LoadingGrid />
          ) : posts.data.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.data.map((p) => (
                <article
                  key={p.id}
                  className="border border-border rounded-sm overflow-hidden bg-card flex flex-col"
                >
                  <Link to="/news/post" search={{ id: p.id }} className="block">
                    <img
                      src={p.cover_image ? storageUrl(p.cover_image) : images.construction}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.published_at, lang)}
                    </p>
                    <h2 className="text-lg font-bold mt-3">
                      <Link to="/news/post" search={{ id: p.id }} className="hover:text-primary">
                        {loc(p.title, p.title_so)}
                      </Link>
                    </h2>
                    {loc(p.excerpt, p.excerpt_so) && (
                      <p className="section-copy mt-3">{loc(p.excerpt, p.excerpt_so)}</p>
                    )}
                    <Link
                      to="/news/post"
                      search={{ id: p.id }}
                      className="text-primary text-sm font-bold mt-auto pt-5 flex items-center gap-2"
                    >
                      {t.common.readMore} <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title={t.news.emptyTitle} text={t.news.emptyText} offline={posts.error}>
              <SocialLinks variant="outline" />
            </EmptyState>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
