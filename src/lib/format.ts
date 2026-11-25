import type { Lang } from "@/i18n";

const locale = (lang: Lang) => (lang === "so" ? "so-SO" : "en-US");

/** "$120,000" — prices are stored in US dollars. */
export function formatPrice(value: number, lang: Lang) {
  try {
    return new Intl.NumberFormat(locale(lang), {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString("en-US")}`;
  }
}

/** "12 March 2026" from a yyyy-mm-dd date. */
export function formatDate(value: string | null | undefined, lang: Lang) {
  if (!value) return "";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  try {
    return new Intl.DateTimeFormat(locale(lang), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/** YouTube video id from a watch, share, shorts or embed link; null for other sites. */
export function youtubeId(url: string) {
  const m = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

export function youtubeEmbed(url: string) {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
