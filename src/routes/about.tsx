import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Compass,
  Target,
  Handshake,
  Hammer,
  Landmark,
  UserRound,
} from "lucide-react";
import { company, images } from "../../company-data";
import { CTA, PageHeading } from "@/components/site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "About Us",
      "Discover Hangool’s story, mission, and commitment to Somali heritage, integrity, and lasting craftsmanship.",
    ),
  component: About,
});
function About() {
  const icons = [Compass, Target, Handshake, Hammer, Landmark];
  return (
    <>
      <PageHeading
        eyebrow="Our story"
        title="Every goal needs a home."
        description="We build with ambition, honesty, and care — from the first plan to the final key."
      />
      <section className="section">
        <div className="site-container grid md:grid-cols-2 gap-12 items-center">
          <img
            src={images.residence}
            alt="A thoughtfully designed contemporary home"
            className="w-full aspect-[4/3] object-cover rounded-sm"
          />
          <div>
            <div className="eyebrow text-primary mb-4">About Hangool</div>
            <h2 className="section-title">
              Somali heritage.
              <br />
              Modern craftsmanship.
            </h2>
            <p className="section-copy mt-6">{company.story}</p>
            <p className="text-primary font-semibold mt-5 flex items-center gap-2">
              <ArrowUpRight className="size-4" />
              {company.location}
            </p>
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container grid md:grid-cols-2 gap-12">
          {[
            { title: "Our mission", text: company.mission },
            { title: "Our vision", text: company.vision },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="section-title">{s.title}</h2>
              <p className="section-copy mt-5">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">What guides us</div>
          <h2 className="section-title mb-8">Values that hold us together.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {company.values.map((v, i) => {
              const Icon = icons[i];
              return (
                <div className="service-card" key={v}>
                  {Icon && <Icon className="service-icon" />}
                  <h3 className="text-sm font-bold leading-6">{v}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">Our journey</div>
          <h2 className="section-title mb-10">An ambition that keeps growing.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {company.milestones.map((m) => (
              <div key={m.title} className="border-t-2 border-secondary pt-5">
                <p className="text-primary text-sm font-bold">{m.year}</p>
                <h3 className="font-bold mt-4">{m.title}</h3>
                <p className="section-copy mt-3">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">Our people</div>
          <h2 className="section-title mb-8">The team behind the promise.</h2>
          <div className="grid sm:grid-cols-3 gap-7">
            {company.team.map((t) => (
              <div key={t.role}>
                <div className="bg-muted aspect-[4/3] flex items-center justify-center">
                  <UserRound className="size-20 text-primary/30" strokeWidth={1} />
                </div>
                <h3 className="mt-5 font-bold text-sm">{t.name}</h3>
                <p className="text-muted-foreground text-sm mt-2">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
