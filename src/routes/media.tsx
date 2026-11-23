import { createFileRoute } from "@tanstack/react-router";
import { updates } from "../../company-data";
import { CTA, PageHeading, SocialLinks } from "@/components/site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/media")({
  head: () =>
    pageHead(
      "Media & Updates",
      "Stories from the site, design details, and the latest updates from Hangool Construction & Real Estate.",
    ),
  component: Media,
});
function Media() {
  return (
    <>
      <PageHeading
        eyebrow="The latest from Hangool"
        title="Behind every build, a story."
        description="From ideas on paper to the details on site. A look at our work, our people, and the places we create."
      />
      <section className="section">
        <div className="site-container">
          <div className="grid md:grid-cols-3 gap-7">
            {updates.map((u) => (
              <article
                key={u.title}
                className="border border-border rounded-sm overflow-hidden bg-card"
              >
                <img
                  src={u.image}
                  alt={u.title}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-6">
                  <p className="text-xs text-muted-foreground">{u.date}</p>
                  <h2 className="text-lg font-bold mt-3">{u.title}</h2>
                  <p className="section-copy mt-3">{u.caption}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Sample updates · Official company stories coming soon.
          </p>
        </div>
      </section>
      <section className="bg-primary text-primary-foreground py-12">
        <div className="site-container flex flex-wrap items-center justify-between gap-7">
          <div>
            <h2 className="text-2xl font-bold">Stay close to what’s next.</h2>
            <p className="text-sm opacity-70 mt-3">
              Find Hangool on Facebook, Instagram, TikTok, and YouTube.
            </p>
          </div>
          <SocialLinks />
        </div>
      </section>
      <CTA />
    </>
  );
}
