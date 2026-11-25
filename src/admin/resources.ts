// What each dashboard section edits. One generic editor (resource-page.tsx) renders
// the list and form from these definitions, so every section behaves the same way.
import { en } from "@/i18n/en";

export type FieldDef = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "images" // several photos (text[])
    | "image" // one photo
    | "urls" // links, one per line (text[])
    | "media"; // gallery: photo upload or video link, depending on media_type
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: [string, string][];
  /** Shown side by side with the next half field on wide screens. */
  half?: boolean;
  max?: number;
};

export type Resource = {
  table: string;
  title: string;
  singular: string;
  intro: string;
  /** PostgREST order clause. */
  order: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  listTitle: (r: Record<string, unknown>) => string;
  listMeta: (r: Record<string, unknown>) => string;
  thumb: (r: Record<string, unknown>) => string | null;
  /** Fields holding uploaded photos (deleted from storage with the row). */
  files: (r: Record<string, unknown>) => string[];
  publicPage?: (r: Record<string, unknown>) => string | null;
};

const pairs = (o: Record<string, string>): [string, string][] => Object.entries(o);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
const somali = (label: string): string =>
  `Optional. Shown when visitors choose Somali; leave empty to show the English ${label}.`;

const projectCategories = pairs(en.projects.categories);
const projectStatuses = pairs(en.projects.statuses);

export const resources: Record<string, Resource> = {
  projects: {
    table: "projects",
    title: "Projects",
    singular: "project",
    intro: "Completed, ongoing and upcoming projects shown on Our Projects and the home page.",
    order: "sort_order.asc,created_at.desc",
    defaults: {
      category: "residential",
      status: "completed",
      images: [],
      video_urls: [],
      published: false,
      sort_order: 0,
    },
    fields: [
      { name: "name", label: "Project name", type: "text", required: true, max: 200 },
      {
        name: "name_so",
        label: "Project name (Somali)",
        type: "text",
        hint: somali("name"),
        max: 200,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: projectCategories,
        half: true,
      },
      { name: "status", label: "Status", type: "select", options: projectStatuses, half: true },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g. Jigjiga Yar, Hargeisa",
        max: 200,
      },
      { name: "start_date", label: "Start date", type: "date", half: true },
      { name: "end_date", label: "End date (or expected)", type: "date", half: true },
      { name: "description", label: "Description", type: "textarea", max: 10000 },
      {
        name: "description_so",
        label: "Description (Somali)",
        type: "textarea",
        hint: somali("description"),
        max: 10000,
      },
      {
        name: "images",
        label: "Photos",
        type: "images",
        hint: "The first photo is the cover. Photos are resized automatically.",
      },
      {
        name: "video_urls",
        label: "Video links",
        type: "urls",
        hint: "One link per line. YouTube links play on the page; other links open in a new tab.",
      },
      {
        name: "sort_order",
        label: "Order",
        type: "number",
        hint: "Lower numbers show first.",
        half: true,
      },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) => str(r["name"]),
    listMeta: (r) =>
      [
        en.projects.categories[r["category"] as keyof typeof en.projects.categories],
        en.projects.statuses[r["status"] as keyof typeof en.projects.statuses],
        str(r["location"]),
      ]
        .filter(Boolean)
        .join(" · "),
    thumb: (r) => arr(r["images"])[0] ?? null,
    files: (r) => arr(r["images"]),
    publicPage: (r) => `project?id=${String(r["id"])}`,
  },
  properties: {
    table: "properties",
    title: "Properties",
    singular: "property",
    intro:
      "Homes, land and commercial spaces for sale or rent, shown on the Real Estate page with search.",
    order: "created_at.desc",
    defaults: {
      property_type: "house",
      deal: "sale",
      availability: "available",
      images: [],
      featured: false,
      published: false,
    },
    fields: [
      {
        name: "name",
        label: "Property name",
        type: "text",
        required: true,
        placeholder: "e.g. 4-bedroom villa in Jigjiga Yar",
        max: 200,
      },
      {
        name: "name_so",
        label: "Property name (Somali)",
        type: "text",
        hint: somali("name"),
        max: 200,
      },
      {
        name: "property_type",
        label: "Type",
        type: "select",
        options: pairs(en.property.types),
        half: true,
      },
      {
        name: "deal",
        label: "For sale or rent",
        type: "select",
        options: pairs(en.property.deal),
        half: true,
      },
      {
        name: "price",
        label: "Price (USD)",
        type: "number",
        hint: "For rent: price per month. Leave empty to show “Price on request”.",
        half: true,
      },
      {
        name: "availability",
        label: "Availability",
        type: "select",
        options: pairs(en.property.availability),
        half: true,
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        required: true,
        hint: "Use the same spelling for the same area — it becomes a search option.",
        max: 200,
      },
      { name: "size_sqm", label: "Size (m²)", type: "number", half: true },
      { name: "bedrooms", label: "Bedrooms", type: "number", half: true },
      { name: "bathrooms", label: "Bathrooms", type: "number", half: true },
      { name: "description", label: "Description", type: "textarea", max: 10000 },
      {
        name: "description_so",
        label: "Description (Somali)",
        type: "textarea",
        hint: somali("description"),
        max: 10000,
      },
      { name: "images", label: "Photos", type: "images", hint: "The first photo is the cover." },
      { name: "featured", label: "Featured (shown first)", type: "checkbox" },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) => str(r["name"]),
    listMeta: (r) =>
      [
        en.property.types[r["property_type"] as keyof typeof en.property.types],
        en.property.deal[r["deal"] as keyof typeof en.property.deal],
        r["price"] != null ? `$${Number(r["price"]).toLocaleString("en-US")}` : "Price on request",
        en.property.availability[r["availability"] as keyof typeof en.property.availability],
        str(r["location"]),
      ].join(" · "),
    thumb: (r) => arr(r["images"])[0] ?? null,
    files: (r) => arr(r["images"]),
    publicPage: (r) => `property?id=${String(r["id"])}`,
  },
  gallery: {
    table: "gallery_items",
    title: "Gallery",
    singular: "gallery item",
    intro: "Photos and videos for the Gallery page, filtered by category.",
    order: "sort_order.asc,created_at.desc",
    defaults: { category: "completed", media_type: "image", published: true, sort_order: 0 },
    fields: [
      {
        name: "category",
        label: "Category",
        type: "select",
        options: pairs(en.gallery.categories),
      },
      {
        name: "media_type",
        label: "Type",
        type: "select",
        options: [
          ["image", "Photo"],
          ["video", "Video link"],
        ],
      },
      { name: "url", label: "Photo or video", type: "media", required: true },
      { name: "caption", label: "Caption", type: "text", max: 300 },
      {
        name: "caption_so",
        label: "Caption (Somali)",
        type: "text",
        hint: somali("caption"),
        max: 300,
      },
      {
        name: "sort_order",
        label: "Order",
        type: "number",
        hint: "Lower numbers show first.",
        half: true,
      },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) =>
      str(r["caption"]) ||
      en.gallery.categories[r["category"] as keyof typeof en.gallery.categories],
    listMeta: (r) =>
      `${en.gallery.categories[r["category"] as keyof typeof en.gallery.categories]} · ${r["media_type"] === "video" ? "Video" : "Photo"}`,
    thumb: (r) => (r["media_type"] === "image" ? str(r["url"]) : null),
    files: (r) => (r["media_type"] === "image" ? [str(r["url"])] : []),
  },
  team: {
    table: "team_members",
    title: "Team",
    singular: "team member",
    intro: "People shown on the Our Team page.",
    order: "sort_order.asc,name.asc",
    defaults: { published: false, sort_order: 0 },
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, max: 160 },
      {
        name: "role",
        label: "Job title",
        type: "text",
        required: true,
        placeholder: "e.g. Lead Engineer",
        half: true,
        max: 160,
      },
      { name: "role_so", label: "Job title (Somali)", type: "text", half: true, max: 160 },
      { name: "photo", label: "Photo", type: "image" },
      { name: "bio", label: "Short bio", type: "textarea", max: 3000 },
      {
        name: "bio_so",
        label: "Short bio (Somali)",
        type: "textarea",
        hint: somali("bio"),
        max: 3000,
      },
      {
        name: "sort_order",
        label: "Order",
        type: "number",
        hint: "Lower numbers show first.",
        half: true,
      },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) => str(r["name"]),
    listMeta: (r) => str(r["role"]),
    thumb: (r) => str(r["photo"]) || null,
    files: (r) => [str(r["photo"])],
  },
  news: {
    table: "blog_posts",
    title: "News & Blog",
    singular: "article",
    intro: "Articles for the News & Blog page.",
    order: "published_at.desc,created_at.desc",
    defaults: { published: false, published_at: new Date().toISOString().slice(0, 10) },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 250 },
      { name: "title_so", label: "Title (Somali)", type: "text", hint: somali("title"), max: 250 },
      { name: "published_at", label: "Date", type: "date", required: true, half: true },
      { name: "cover_image", label: "Cover photo", type: "image" },
      {
        name: "excerpt",
        label: "Summary",
        type: "textarea",
        hint: "One or two sentences shown on the list and in link previews.",
        max: 600,
      },
      { name: "excerpt_so", label: "Summary (Somali)", type: "textarea", max: 600 },
      {
        name: "body",
        label: "Article text",
        type: "textarea",
        hint: "Leave a blank line between paragraphs.",
        max: 50000,
      },
      {
        name: "body_so",
        label: "Article text (Somali)",
        type: "textarea",
        hint: somali("article text"),
        max: 50000,
      },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) => str(r["title"]),
    listMeta: (r) => str(r["published_at"]),
    thumb: (r) => str(r["cover_image"]) || null,
    files: (r) => [str(r["cover_image"])],
    publicPage: (r) => `news/post?id=${String(r["id"])}`,
  },
  careers: {
    table: "job_openings",
    title: "Careers",
    singular: "job opening",
    intro:
      "Open positions for the Careers page. Jobs disappear automatically after their deadline.",
    order: "created_at.desc",
    defaults: { employment_type: "full_time", published: false },
    fields: [
      { name: "title", label: "Job title", type: "text", required: true, max: 200 },
      {
        name: "title_so",
        label: "Job title (Somali)",
        type: "text",
        hint: somali("title"),
        max: 200,
      },
      {
        name: "employment_type",
        label: "Type",
        type: "select",
        options: pairs(en.careers.types),
        half: true,
      },
      {
        name: "department",
        label: "Department",
        type: "text",
        placeholder: "e.g. Construction",
        half: true,
        max: 120,
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g. Hargeisa",
        half: true,
        max: 160,
      },
      { name: "deadline", label: "Application deadline", type: "date", half: true },
      { name: "description", label: "Description and requirements", type: "textarea", max: 10000 },
      {
        name: "description_so",
        label: "Description (Somali)",
        type: "textarea",
        hint: somali("description"),
        max: 10000,
      },
      { name: "published", label: "Published (visible on the website)", type: "checkbox" },
    ],
    listTitle: (r) => str(r["title"]),
    listMeta: (r) =>
      [
        en.careers.types[r["employment_type"] as keyof typeof en.careers.types],
        str(r["location"]),
        r["deadline"] ? `until ${str(r["deadline"])}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    thumb: () => null,
    files: () => [],
  },
};
