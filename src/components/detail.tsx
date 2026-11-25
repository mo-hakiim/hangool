import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, type SitePath } from "@/components/site";
import { Lightbox, type LightboxPhoto } from "@/components/lightbox";
import { useI18n } from "@/i18n";

/** Loading / not-found / offline wrapper for the ?id= detail pages. */
export function DetailState({
  loading,
  error,
  found,
  back,
  backLabel,
  children,
}: {
  loading: boolean;
  error: boolean;
  found: boolean;
  back: SitePath;
  backLabel: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const backLink = (
    <Button variant="link" asChild className="px-0 mb-6">
      <Link to={back}>
        <ArrowLeft /> {backLabel}
      </Link>
    </Button>
  );
  if (loading) {
    return (
      <section className="section">
        <div className="site-container" aria-busy="true">
          <span className="sr-only">{t.common.loading}</span>
          <div className="skeleton h-8 w-2/3 max-w-lg rounded-sm" />
          <div className="skeleton aspect-[16/9] w-full mt-8 rounded-sm" />
        </div>
      </section>
    );
  }
  if (!found) {
    return (
      <section className="section">
        <div className="site-container">
          {backLink}
          <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} offline={error}>
            <Button asChild>
              <Link to={back}>{backLabel}</Link>
            </Button>
          </EmptyState>
        </div>
      </section>
    );
  }
  return <>{children}</>;
}

/** Main photo with thumbnails; click opens the lightbox. */
export function PhotoGallery({ photos }: { photos: LightboxPhoto[] }) {
  const { t } = useI18n();
  const [main, setMain] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  if (!photos.length) return null;
  const current = photos[Math.min(main, photos.length - 1)]!;
  return (
    <div>
      <button type="button" className="gallery-tile" onClick={() => setOpen(main)}>
        <img
          src={current.src}
          alt={current.alt}
          decoding="async"
          style={{ aspectRatio: "16 / 10" }}
        />
      </button>
      {photos.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
          {photos.map((p, i) => (
            <button
              key={p.src + i}
              type="button"
              className="gallery-tile"
              aria-label={t.common.photo.replace("{n}", String(i + 1))}
              aria-current={i === main}
              onClick={() => setMain(i)}
              style={{ outline: i === main ? "2px solid var(--secondary)" : undefined }}
            >
              <img src={p.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
