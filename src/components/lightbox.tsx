import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { youtubeEmbed } from "@/lib/format";

export type LightboxPhoto = { src: string; alt: string; caption?: string | null | undefined };

/** Full-screen photo viewer with previous/next (buttons, arrow keys). */
export function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const open = index !== null && photos.length > 0;
  const photo = open ? photos[index] : undefined;
  const go = (d: number) => index !== null && onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && photo && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-deep-green/90"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content forceMount asChild aria-describedby={undefined}>
              <motion.div
                className="lightbox"
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <DialogPrimitive.Title className="sr-only">{photo.alt}</DialogPrimitive.Title>
                <img src={photo.src} alt={photo.alt} className="lightbox-img" />
                {(photo.caption || photos.length > 1) && (
                  <p className="lightbox-caption">
                    {photo.caption}
                    {photos.length > 1 && (
                      <span className="opacity-60 ml-3">
                        {index! + 1} / {photos.length}
                      </span>
                    )}
                  </p>
                )}
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="hero"
                    size="icon"
                    className="lightbox-close"
                    aria-label={t.common.close}
                  >
                    <X />
                  </Button>
                </DialogPrimitive.Close>
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="hero"
                      size="icon"
                      className="lightbox-prev"
                      aria-label={t.common.previous}
                      onClick={() => go(-1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="hero"
                      size="icon"
                      className="lightbox-next"
                      aria-label={t.common.next}
                      onClick={() => go(1)}
                    >
                      <ChevronRight />
                    </Button>
                  </>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/** Responsive video player for YouTube links; other links open in a new tab. */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const { t } = useI18n();
  const embed = youtubeEmbed(url);
  if (embed) {
    return (
      <div className="video-frame">
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="video-link">
      ▶ {t.projects.watchVideo}
    </a>
  );
}
