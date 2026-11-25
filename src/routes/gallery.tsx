import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { bundledGallery } from "../../company-data";
import { CTA, LoadingGrid, PageHeading, SocialLinks } from "@/components/site";
import { Lightbox, VideoEmbed, type LightboxPhoto } from "@/components/lightbox";
import { Button } from "@/components/ui/button";
import { pageHead, usePageMeta } from "@/lib/seo";
import { useI18n, useLocalize } from "@/i18n";
import { useGallery, type GalleryCategory } from "@/data/live";
import { storageUrl } from "@/lib/supabase";

const CATEGORIES: GalleryCategory[] = [
  "completed",
  "ongoing",
  "construction",
  "realEstate",
  "engineering",
  "equipment",
  "events",
  "video",
];

export const Route = createFileRoute("/gallery")({
  head: () => pageHead("gallery", "/gallery"),
  validateSearch: (s: Record<string, unknown>): { category?: GalleryCategory | undefined } => ({
    category: CATEGORIES.includes(s["category"] as GalleryCategory)
      ? (s["category"] as GalleryCategory)
      : undefined,
  }),
  component: Gallery,
});

type Item = {
  key: string;
  category: GalleryCategory | null;
  type: "image" | "video";
  src: string;
  title: string;
  caption: string;
};

function Gallery() {
  const { t } = useI18n();
  const loc = useLocalize();
  usePageMeta(t.seo.gallery);
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/gallery" });
  const gallery = useGallery();
  const [open, setOpen] = useState<number | null>(null);

  // The built-in photos (former "Media & Updates") show until the admin publishes items.
  const live: Item[] = gallery.data.map((g) => ({
    key: g.id,
    category: g.category,
    type: g.media_type,
    src: g.media_type === "image" ? storageUrl(g.url) : g.url,
    title: loc(g.caption, g.caption_so) || t.gallery.categories[g.category],
    caption: loc(g.caption, g.caption_so),
  }));
  const items: Item[] = live.length
    ? live
    : bundledGallery.map((b) => ({
        key: b.key,
        category: null,
        type: "image" as const,
        src: b.image,
        title: t.gallery.bundled[b.key].title,
        caption: t.gallery.bundled[b.key].caption,
      }));
  const shown = category ? items.filter((i) => i.category === category) : items;
  const photos = shown.filter((i) => i.type === "image");
  const lightbox: LightboxPhoto[] = photos.map((p) => ({
    src: p.src,
    alt: p.title,
    caption: p.caption,
  }));
  const used = CATEGORIES.filter((c) => live.some((i) => i.category === c));

  return (
    <>
      <PageHeading
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        description={t.gallery.description}
      />
      <section className="section">
        <div className="site-container">
          {live.length > 0 && (
            <div className="filter-bar mb-10" role="group" aria-label={t.gallery.eyebrow}>
              <Button
                variant={!category ? "default" : "outline"}
                aria-pressed={!category}
                onClick={() => navigate({ search: {}, replace: true, resetScroll: false })}
              >
                {t.common.all}
              </Button>
              {used.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "outline"}
                  aria-pressed={category === c}
                  onClick={() =>
                    navigate({ search: { category: c }, replace: true, resetScroll: false })
                  }
                >
                  {t.gallery.categories[c]}
                </Button>
              ))}
            </div>
          )}
          {gallery.loading ? (
            <LoadingGrid count={6} />
          ) : shown.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {shown.map((item) =>
                item.type === "video" ? (
                  <figure key={item.key} className="space-y-3">
                    <VideoEmbed url={item.src} title={item.title} />
                    {item.caption && (
                      <figcaption className="text-sm text-muted-foreground flex items-center gap-2">
                        <PlayCircle className="size-4 text-primary" /> {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <figure key={item.key} className="space-y-3">
                    <button
                      type="button"
                      className="gallery-tile"
                      aria-label={`${t.gallery.openPhoto}: ${item.title}`}
                      onClick={() => setOpen(photos.indexOf(item))}
                    >
                      <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
                    </button>
                    {item.category === null ? (
                      <figcaption>
                        <h2 className="text-lg font-bold">{item.title}</h2>
                        <p className="section-copy mt-1">{item.caption}</p>
                      </figcaption>
                    ) : (
                      item.caption && (
                        <figcaption className="text-sm text-muted-foreground">
                          {item.caption}
                        </figcaption>
                      )
                    )}
                  </figure>
                ),
              )}
            </div>
          ) : (
            <p className="empty-state section-copy">{t.gallery.empty}</p>
          )}
        </div>
      </section>
      <Lightbox photos={lightbox} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      <section className="bg-primary text-primary-foreground py-12">
        <div className="site-container flex flex-wrap items-center justify-between gap-7">
          <div>
            <h2 className="text-2xl font-bold">{t.gallery.stayTitle}</h2>
            <p className="text-sm opacity-70 mt-3">{t.gallery.stayText}</p>
          </div>
          <SocialLinks />
        </div>
      </section>
      <CTA />
    </>
  );
}
