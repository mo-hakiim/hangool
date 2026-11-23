import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { services } from "../../company-data";
import { CTA, PageHeading } from "@/components/site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Our Services",
      "Residential construction, commercial buildings, renovation, project management, and building materials in Hargeisa.",
    ),
  component: Services,
});
function Services() {
  return (
    <>
      <PageHeading
        eyebrow="Our expertise"
        title="Built around your ambition."
        description="A complete approach to construction — thoughtful planning, reliable delivery, and care in every finish."
      />
      <div className="site-container">
        {services.map((s, i) => (
          <section
            key={s.title}
            className="section border-b border-border grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <img
              src={s.image}
              alt={s.title}
              loading="lazy"
              className={`w-full aspect-[4/3] object-cover rounded-sm ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <div className="eyebrow text-primary mb-4">0{i + 1} / Our services</div>
              <h2 className="section-title">{s.title}</h2>
              <p className="section-copy mt-5">
                {s.short} We work closely with you to understand your goals, agree a clear plan, and
                deliver with care.
              </p>
              <ul className="space-y-4 mt-7">
                {s.includes.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
      <CTA />
    </>
  );
}
