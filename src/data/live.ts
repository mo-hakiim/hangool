// Live content from Supabase (read-only, public anon key).
//
// Pages are prerendered without database content. In the browser each hook loads
// the published rows; Row Level Security only ever returns published content to
// visitors. If Supabase is not configured or unreachable, hooks return an empty
// list with `error` set, and pages show their "coming soon" or offline state —
// the site never breaks.
import { useQuery } from "@tanstack/react-query";

import { company } from "../../company-data";
import { select, supabaseEnabled } from "@/lib/supabase";

/* ---------- Row shapes (see supabase/schema.sql) ---------- */

export type ProjectStatus = "completed" | "ongoing" | "upcoming";
export type ProjectCategory =
  "residential" | "commercial" | "industrial" | "road" | "renovation" | "other";

export type ProjectRow = {
  id: string;
  name: string;
  name_so: string | null;
  location: string | null;
  description: string | null;
  description_so: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  images: string[];
  video_urls: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type GalleryCategory =
  | "completed"
  | "ongoing"
  | "construction"
  | "realEstate"
  | "engineering"
  | "equipment"
  | "events"
  | "video";

export type GalleryItemRow = {
  id: string;
  category: GalleryCategory;
  media_type: "image" | "video";
  url: string;
  caption: string | null;
  caption_so: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type PropertyType = "apartment" | "villa" | "house" | "land" | "commercial" | "office";
export type Availability = "available" | "reserved" | "sold" | "rented" | "unavailable";

export type PropertyRow = {
  id: string;
  name: string;
  name_so: string | null;
  property_type: PropertyType;
  deal: "sale" | "rent";
  price: number | null;
  location: string;
  size_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  description_so: string | null;
  images: string[];
  availability: Availability;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  role_so: string | null;
  bio: string | null;
  bio_so: string | null;
  photo: string | null;
  published: boolean;
  sort_order: number;
};

export type BlogPostRow = {
  id: string;
  title: string;
  title_so: string | null;
  excerpt: string | null;
  excerpt_so: string | null;
  body: string | null;
  body_so: string | null;
  cover_image: string | null;
  published_at: string;
  published: boolean;
};

export type JobType = "full_time" | "part_time" | "contract" | "internship";

export type JobOpeningRow = {
  id: string;
  title: string;
  title_so: string | null;
  department: string | null;
  location: string | null;
  employment_type: JobType;
  description: string | null;
  description_so: string | null;
  deadline: string | null;
  published: boolean;
  created_at: string;
};

export type Stats = { years: number; projects: number; clients: number; professionals: number };

export type SettingsRow = {
  id: number;
  stats: Stats | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook: string | null;
  tiktok: string | null;
  instagram: string | null;
  youtube: string | null;
  address: string | null;
  address_so: string | null;
  map_query: string | null;
  notify_email?: string | null;
  updated_at: string;
};

/* ---------- Hooks ---------- */

type Result<T> = { data: T[]; loading: boolean; error: boolean };

const isServer = typeof window === "undefined";

export function useTable<T>(table: string, query: string): Result<T> {
  const q = useQuery({
    queryKey: ["public", table, query],
    queryFn: () => select<T>(table, query),
    enabled: supabaseEnabled && !isServer,
    staleTime: 60_000,
    retry: 1,
  });
  // Not set up yet: nothing to show, which pages present as "coming soon".
  if (!supabaseEnabled) return { data: [], loading: false, error: false };
  // While prerendering, and until the first answer, show the loading state
  // (never the "coming soon" state, which would flash before real items).
  return { data: q.data ?? [], loading: isServer || q.isPending, error: q.isError };
}

const PUBLISHED = "published=eq.true";

export const useProjects = () =>
  useTable<ProjectRow>("projects", `select=*&${PUBLISHED}&order=sort_order.asc,created_at.desc`);

export const useProject = (id: string) =>
  useTable<ProjectRow>("projects", `select=*&${PUBLISHED}&id=eq.${encodeURIComponent(id)}`);

export const useGallery = () =>
  useTable<GalleryItemRow>(
    "gallery_items",
    `select=*&${PUBLISHED}&order=sort_order.asc,created_at.desc`,
  );

export const useProperties = () =>
  useTable<PropertyRow>("properties", `select=*&${PUBLISHED}&order=featured.desc,created_at.desc`);

export const useProperty = (id: string) =>
  useTable<PropertyRow>("properties", `select=*&${PUBLISHED}&id=eq.${encodeURIComponent(id)}`);

export const useTeam = () =>
  useTable<TeamMemberRow>("team_members", `select=*&${PUBLISHED}&order=sort_order.asc,name.asc`);

export const usePosts = () =>
  useTable<BlogPostRow>(
    "blog_posts",
    `select=id,title,title_so,excerpt,excerpt_so,cover_image,published_at,published&${PUBLISHED}&order=published_at.desc`,
  );

export const usePost = (id: string) =>
  useTable<BlogPostRow>("blog_posts", `select=*&${PUBLISHED}&id=eq.${encodeURIComponent(id)}`);

export const useJobs = () =>
  useTable<JobOpeningRow>("job_openings", `select=*&${PUBLISHED}&order=created_at.desc`);

/* ---------- Site settings (contact details + confirmed stats) ---------- */

export type SiteSettings = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  emailHref: string;
  socials: { name: "Facebook" | "TikTok" | "Instagram" | "YouTube"; url: string }[];
  /** null until the owner confirms the figures in Admin → Settings. */
  stats: Stats | null;
  address: string | null;
  addressSo: string | null;
  /** null = no map shown. */
  mapQuery: string | null;
};

const digits = (s: string) => s.replace(/[^\d]/g, "");
const defaultSocial = (name: string) => company.socials.find((s) => s.name === name)?.url ?? "";

/** Merges the saved settings over the built-in defaults in company-data.ts. */
export function mergeSettings(row: SettingsRow | null | undefined): SiteSettings {
  const phone = row?.phone?.trim() || company.phone;
  const whatsapp = row?.whatsapp?.trim() || company.whatsapp;
  const email = row?.email?.trim() || company.email;
  const social = (name: "Facebook" | "TikTok" | "Instagram" | "YouTube", v?: string | null) => ({
    name,
    url: v?.trim() || defaultSocial(name),
  });
  const stats = row?.stats;
  return {
    phone,
    phoneHref: `tel:+${digits(phone)}`,
    whatsapp,
    whatsappUrl: `https://wa.me/${digits(whatsapp)}`,
    email,
    emailHref: `mailto:${email}`,
    socials: [
      social("Facebook", row?.facebook),
      social("TikTok", row?.tiktok),
      social("Instagram", row?.instagram),
      social("YouTube", row?.youtube),
    ].filter((s) => s.url.startsWith("https://")),
    stats:
      stats && [stats.years, stats.projects, stats.clients, stats.professionals].every((n) => n > 0)
        ? stats
        : null,
    address: row?.address?.trim() || null,
    addressSo: row?.address_so?.trim() || null,
    mapQuery: row?.map_query?.trim() || null,
  };
}

export function useSettings(): SiteSettings {
  const { data } = useTable<SettingsRow>("site_settings", "select=*&id=eq.1");
  return mergeSettings(data[0]);
}
