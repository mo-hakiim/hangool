import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  House,
  Building2,
  Paintbrush,
  ClipboardCheck,
  ShieldCheck,
  Clock3,
  HardHat,
  BadgeCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { company, images } from "../../company-data";
import { CTA, EmptyState, LoadingGrid, MediaCard, TextLink } from "@/components/site";
import { pageHead, usePageMeta } from "@/lib/seo";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter, HeroImage, ServiceMarquee } from "@/components/motion";
import { useI18n, useLocalize } from "@/i18n";
import { useProjects, useSettings } from "@/data/live";
import { storageUrl } from "@/lib/supabase";

// Structured data so search engines can show the business name, contact and profiles.
const organization = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Hangool Construction & Real Estate",
  alternateName: "Hangool Development",
  url: "https://hangooldevelopment.com/",
  logo: "https://hangooldevelopment.com/apple-touch-icon.png",
  image: "https://hangooldevelopment.com/og-image.jpg",
  telephone: company.phone.replace(/\s+/g, ""),
  email: company.email,
  areaServed: "Somaliland",
  address: { "@type": "PostalAddress", addressLocality: "Hargeisa", addressCountry: "SO" },
  sameAs: company.socials.map((s) => s.url),
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead("home", "/"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(organization) }],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const loc = useLocalize();
  const settings = useSettings();
  const projects = useProjects();
  usePageMeta(t.seo.home, true);
  const reduced = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay },
  });
  const serviceIcons = [House, Building2, Paintbrush, ClipboardCheck];
  const reasonIcons = [BadgeCheck, Clock3, HardHat, ShieldCheck];
  const stats = settings.stats;

  return (
    <>
      <section className="home-hero">
        <HeroImage src={images.residence} small={images.residenceSmall} alt={t.home.heroAlt} />
        <div className="hero-scrim" />
        <div className="site-container hero-content">
          <motion.div {...reveal(0.05)} className="eyebrow text-secondary">
            {t.home.eyebrow}
          </motion.div>
          <h1 className="hero-title">
            <span className="hero-line">
              <motion.span {...reveal(0.12)}>{t.home.line1}</motion.span>
            </span>
            <span className="hero-line">
              <motion.span {...reveal(0.24)}>
                {t.home.line2} <span className="text-secondary">{t.home.line2accent}</span>
              </motion.span>
            </span>
          </h1>
          <motion.p {...reveal(0.34)} className="hero-copy">
            {t.home.copy1}
            <br className="hidden md:block" /> {t.home.copy2}
          </motion.p>
          <motion.div {...reveal(0.42)} className="flex flex-wrap gap-4 mt-8">
            <Button variant="gold" size="lg" asChild>
              <Link to="/quote">
                {t.nav.quote} <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/projects">
                {t.home.viewProjects} <ArrowUpRight />
              </Link>
            </Button>
          </motion.div>
        </div>
        <div className="site-container hero-bottom">
          <span className="flex items-center gap-2">
            <MapPin className="size-3" />
            {t.common.location}
          </span>
          <a href="#what-we-build" className="flex items-center gap-3">
            {t.home.discover}{" "}
            <motion.span
              animate={reduced ? {} : { y: [0, 5, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.75, repeat: Infinity, repeatDelay: 1 }}
            >
              <ArrowDown className="size-3" />
            </motion.span>
          </a>
        </div>
      </section>
      {/* Shown only after the owner confirms the figures in Admin → Settings. */}
      {stats && (
        <section className="stats-band" aria-label={t.home.statsLabel}>
          <div className="site-container grid grid-cols-2 md:grid-cols-4">
            {(["years", "projects", "clients", "professionals"] as const).map((k) => (
              <div className="stat" key={k}>
                <div className="stat-number">
                  <AnimatedCounter value={`${stats[k]}+`} />
                  <span className="text-secondary">+</span>
                </div>
                <p className="stat-label">{t.home.stats[k]}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <ServiceMarquee />
      <section className="section" id="what-we-build">
        <div className="site-container">
          <div className="flex flex-col md:flex-row justify-between gap-5 md:items-end mb-9">
            <div>
              <div className="eyebrow text-primary mb-4">{t.home.whatEyebrow}</div>
              <h2 className="section-title">{t.home.whatTitle}</h2>
              <p className="section-copy mt-4 max-w-xl">{t.home.whatCopy}</p>
            </div>
            <TextLink to="/services">{t.home.exploreServices}</TextLink>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.services.items.slice(0, 4).map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <Link to="/services" key={i} className="service-card">
                  {Icon && <Icon className="service-icon" />}
                  <h3 className="font-bold text-sm leading-6">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-6 mt-3 min-h-18">{s.short}</p>
                  <ArrowUpRight className="size-4 text-primary mt-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container">
          <div className="eyebrow text-primary mb-4">{t.home.deptEyebrow}</div>
          <h2 className="section-title mb-9">{t.home.deptTitle}</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {(
              [
                ["/construction", HardHat, t.services.construction],
                ["/real-estate", KeyRound, t.services.realEstate],
              ] as const
            ).map(([to, Icon, d]) => (
              <Link key={to} to={to} className="service-card bg-background">
                <Icon className="service-icon" />
                <h3 className="font-bold text-lg">{d.title}</h3>
                <p className="section-copy mt-3">{d.text}</p>
                <span className="text-primary text-sm font-bold mt-5 flex items-center gap-2">
                  {t.services.explore} <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
            <div>
              <div className="eyebrow text-primary mb-4">{t.home.workEyebrow}</div>
              <h2 className="section-title">{t.home.workTitle}</h2>
            </div>
            <TextLink to="/projects">{t.home.viewAllProjects}</TextLink>
          </div>
          {projects.loading ? (
            <LoadingGrid />
          ) : projects.data.length ? (
            <div className="grid md:grid-cols-3 gap-7">
              {projects.data.slice(0, 3).map((p) => (
                <MediaCard
                  key={p.id}
                  to="/project"
                  id={p.id}
                  image={p.images[0] ? storageUrl(p.images[0]) : images.construction}
                  title={loc(p.name, p.name_so)}
                  eyebrow={`${t.projects.categories[p.category]} · ${t.projects.statuses[p.status]}`}
                  location={p.location}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={t.projects.emptyTitle} text={t.projects.emptyText} />
          )}
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src={images.construction}
              alt={t.home.diffAlt}
              className="w-full aspect-[5/4] object-cover rounded-sm"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <div className="eyebrow text-primary mb-4">{t.home.diffEyebrow}</div>
            <h2 className="section-title">
              {t.home.diffTitle1}
              <br />
              {t.home.diffTitle2}
            </h2>
            <p className="section-copy mt-4">{t.home.diffCopy}</p>
            <div className="grid sm:grid-cols-2 gap-7 mt-8">
              {t.home.reasons.map((r, i) => {
                const Icon = reasonIcons[i] ?? BadgeCheck;
                return (
                  <div key={i}>
                    <Icon className="size-6 text-primary mb-3" />
                    <h3 className="text-xs font-bold leading-5">{r.title}</h3>
                    <p className="text-sm text-muted-foreground leading-6 mt-2">{r.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <TextLink to="/about">{t.home.meet}</TextLink>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
