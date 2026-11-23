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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { company, services, projects, images } from "../../company-data";
import { CTA, ProjectCard, TextLink } from "@/components/site";
import { pageHead } from "@/lib/seo";
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter, HeroImage, ServiceMarquee } from '@/components/motion';
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Building Hargeisa’s Future",
      "Thoughtfully designed homes and commercial developments in Hargeisa, Somaliland. Discover Hangool construction, renovation, and project management.",
    ),
  component: Index,
});
function Index() {
  const reduced = useReducedMotion();
  const reveal = (delay: number) => ({ initial: reduced ? false as const : { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : delay } });
  const serviceIcons = [House, Building2, Paintbrush, ClipboardCheck];
  const reasons = [
    {
      icon: BadgeCheck,
      title: "Quality without compromise",
      text: "Reliable materials and care in every detail.",
    },
    {
      icon: Clock3,
      title: "Respect for your time",
      text: "Clear planning. Consistent communication.",
    },
    {
      icon: HardHat,
      title: "People who know their craft",
      text: "An experienced team with a shared ambition.",
    },
    {
      icon: ShieldCheck,
      title: "Safety comes first",
      text: "Responsible building, from the ground up.",
    },
  ];
  return (
    <>
      <section className="home-hero">
        <HeroImage
          src={images.residence}
          alt="Modern residence with open terraces, a landscaped garden, and warm evening lighting"
        />
        <div className="hero-scrim" />
        <div className="site-container hero-content">
          <motion.div {...reveal(.05)} className="eyebrow text-secondary">Rooted in heritage. Built for tomorrow.</motion.div>
          <h1 className="hero-title">
            <span className="hero-line"><motion.span {...reveal(.12)}>Building Hargeisa’s</motion.span></span>
            <span className="hero-line"><motion.span {...reveal(.24)}>future. <span className="text-secondary">Together.</span></motion.span></span>
          </h1>
          <motion.p {...reveal(.34)} className="hero-copy">
            Thoughtfully designed homes. Lasting developments.
            <br className="hidden md:block" /> Built with ambition, honesty, and care.
          </motion.p>
          <motion.div {...reveal(.42)} className="flex flex-wrap gap-4 mt-8">
            <Button variant="gold" size="lg" asChild>
              <Link to="/contact">
                Request a Quote <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/projects">
                View Our Projects <ArrowUpRight />
              </Link>
            </Button>
          </motion.div>
        </div>
        <div className="site-container hero-bottom">
          <span className="flex items-center gap-2">
            <MapPin className="size-3" />
            Hargeisa, Somaliland
          </span>
          <a href="#what-we-build" className="flex items-center gap-3">
            Discover Hangool <motion.span animate={reduced ? {} : { y: [0, 5, 0], opacity: [1, .4, 1] }} transition={{ duration: .75, repeat: Infinity, repeatDelay: 1 }}><ArrowDown className="size-3" /></motion.span>
          </a>
        </div>
      </section>
      <section className="stats-band" aria-label="Sample company statistics">
        <div className="site-container grid grid-cols-2 md:grid-cols-4">
          {company.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-number">
                <AnimatedCounter value={s.value} />
                <span className="text-secondary">+</span>
              </div>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <ServiceMarquee />
      <section className="section" id="what-we-build">
        <div className="site-container">
          <div className="flex flex-col md:flex-row justify-between gap-5 md:items-end mb-9">
            <div>
              <div className="eyebrow text-primary mb-4">What we build</div>
              <h2 className="section-title">Your vision. Our expertise.</h2>
              <p className="section-copy mt-4">
                From a family’s first home to a business’s next chapter,
                <br className="hidden md:block" /> we build spaces that move you forward.
              </p>
            </div>
            <TextLink to="/services">Explore all services</TextLink>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.slice(0, 4).map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <Link to="/services" key={s.title} className="service-card">
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
          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
            <div>
              <div className="eyebrow text-primary mb-4">Our work</div>
              <h2 className="section-title">Spaces with purpose.</h2>
            </div>
            <TextLink to="/projects">View all projects</TextLink>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard project={p} key={p.id} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Sample portfolio · Actual Hangool projects coming soon.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="site-container grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src={images.construction}
              alt="Architectural plans and materials prepared for a new building"
              className="w-full aspect-[5/4] object-cover rounded-sm"
              loading="lazy"
            />
          </div>
          <div>
            <div className="eyebrow text-primary mb-4">The Hangool difference</div>
            <h2 className="section-title">
              Strong foundations.
              <br />
              Stronger commitments.
            </h2>
            <p className="section-copy mt-4">
              A building is more than walls and a roof. It’s a promise to the people who will live,
              work, and grow inside it.
            </p>
            <div className="grid sm:grid-cols-2 gap-7 mt-8">
              {reasons.map((r) => (
                <div key={r.title}>
                  <r.icon className="size-6 text-primary mb-3" />
                  <h3 className="text-xs font-bold leading-5">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6 mt-2">{r.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <TextLink to="/about">Meet Hangool</TextLink>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
