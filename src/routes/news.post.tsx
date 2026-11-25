import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CTA } from "@/components/site";
import { DetailState } from "@/components/detail";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { usePost } from "@/data/live";
import { storageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/news/post")({
  head: () => pageHead("post", "/news/post"),
  validateSearch: (s: Record<string, unknown>): { id: string } => ({
    id: typeof s["id"] === "string" ? s["id"].slice(0, 64) : "",
  }),
  component: PostPage,
});

function PostPage() {
  const { t, lang } = useI18n();
  const loc = useLocalize();
  const { id } = Route.useSearch();
  const { data, loading, error } = usePost(id);
  const p = data[0];
  const title = p ? loc(p.title, p.title_so) : "";
  const body = p ? loc(p.body, p.body_so) : "";
  const excerpt = p ? loc(p.excerpt, p.excerpt_so) : "";
  usePageMeta(
    p
      ? {
          title,
          description: excerpt || body.slice(0, 160),
          image: p.cover_image ? storageUrl(p.cover_image) : null,
        }
      : t.seo.post,
  );

  return (
    <DetailState loading={loading} error={error} found={!!p} back="/news" backLabel={t.news.back}>
      {p && (
        <>
          <article className="section">
            <div className="site-container max-w-3xl">
              <Button variant="link" asChild className="px-0 mb-6">
                <Link to="/news">
                  <ArrowLeft /> {t.news.back}
                </Link>
              </Button>
              <p className="eyebrow text-primary">{formatDate(p.published_at, lang)}</p>
              <h1 className="section-title mt-4">{title}</h1>
              {excerpt && <p className="section-copy text-lg mt-4">{excerpt}</p>}
              {p.cover_image && (
                <img
                  src={storageUrl(p.cover_image)}
                  alt=""
                  decoding="async"
                  className="w-full aspect-[16/9] object-cover rounded-sm mt-8"
                />
              )}
              <div className="section-copy prose-text mt-8 text-base leading-8">{body}</div>
            </div>
          </article>
          <CTA />
        </>
      )}
    </DetailState>
  );
}
