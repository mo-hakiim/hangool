import { useEffect } from "react";

import { en } from "@/i18n/en";

export const SITE_NAME = "Hangool Construction & Real Estate";
export const SITE_URL = "https://hangooldevelopment.com";
/** Default link-preview image (1200×630) in public/. */
export const OG_IMAGE = "og-image.jpg";

type SeoKey = keyof typeof en.seo;

function absolute(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}

/**
 * Static head for a prerendered page (English, read by search engines and link
 * previews). `path` is the page's address without the base path, e.g. "/about".
 */
export function pageHead(key: SeoKey, path: string, opts: { noindex?: boolean } = {}) {
  const { title, description } = en.seo[key];
  const fullTitle = key === "home" ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;
  const url = absolute(path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: absolute(OG_IMAGE) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absolute(OG_IMAGE) },
      ...(opts.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Updates the title, description and Open Graph tags in the browser — for the
 * chosen language, and for detail pages once their item has loaded.
 * Pass `null` while there is nothing to show yet.
 */
export function usePageMeta(
  meta: { title: string; description: string; image?: string | null | undefined } | null,
  isHome = false,
) {
  const title = meta?.title;
  const description = meta?.description;
  const image = meta?.image;
  useEffect(() => {
    if (!title || description === undefined) return;
    const fullTitle = isHome ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    const desc = description.replace(/\s+/g, " ").trim().slice(0, 160);
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", absolute(image || OG_IMAGE));
    setMeta("name", "twitter:image", absolute(image || OG_IMAGE));
  }, [title, description, image, isHome]);
}
