import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { company, type Project } from "../../company-data";
import logo from "@/assets/hangool-logo.png";
export const navItems = [
  { title: "Home", to: "/" },
  { title: "About Us", to: "/about" },
  { title: "Services", to: "/services" },
  { title: "Projects", to: "/projects" },
  { title: "Media & Updates", to: "/media" },
  { title: "Contact", to: "/contact" },
] as const;
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const transparent = path === '/' && !scrolled && !open;
  return (
    <header className="site-header" data-transparent={transparent} data-home={path === '/'}>
      <motion.div className="header-glass" aria-hidden="true" animate={{ opacity: transparent ? 0 : 1 }} transition={{ duration: reduced ? 0 : .3 }} />
      <div className="site-container flex h-full items-center justify-between gap-6">
        <Link to="/" aria-label="Hangool home" onClick={() => setOpen(false)}>
          <img src={logo} alt="Hangool Construction & Real Estate" className="brand-image" />
        </Link>
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} data-active={path === n.to} className="nav-link">
              {n.title}
            </Link>
          ))}
        </nav>
        <Button variant="gold" asChild className="hidden lg:inline-flex h-11">
          <Link to="/contact">
            Request a Quote <ArrowUpRight />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <AnimatePresence>
      {open && (
        <motion.nav
          aria-label="Mobile navigation"
          className="mobile-menu lg:hidden border-b border-border bg-background px-6 py-6 flex flex-col gap-2"
          initial={reduced ? false : { opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -15 }}
          transition={{ duration: reduced ? 0 : .3 }}
        >
          {navItems.map((n) => (
            <motion.div key={n.to} initial={reduced ? false : { opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .3, delay: reduced ? 0 : navItems.indexOf(n) * .04 }}><Link
              to={n.to}
              key={n.to}
              onClick={() => setOpen(false)}
              className="nav-link"
              data-active={path === n.to}
            >
              {n.title}
            </Link></motion.div>
          ))}
          <Button variant="gold" asChild>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Request a Quote <ArrowUpRight />
            </Link>
          </Button>
        </motion.nav>
      )}
      </AnimatePresence>
    </header>
  );
}
export function SocialLinks() {
  const icons = [Facebook, Instagram, Music2, Youtube];
  return (
    <div className="flex flex-wrap gap-3">
      {company.socials.map((s, i) => {
        const Icon = icons[i];
        return (
          <Button key={s.name} variant="hero" size="icon" asChild>
            <a
              href={s.url.startsWith("https://") ? s.url : undefined}
              aria-label={`${s.name}${s.url.includes("[") ? " — link coming soon" : ""}`}
              title={s.url.includes("[") ? `${s.name} — link coming soon` : s.name}
              aria-disabled={s.url.includes("[")}
              target="_blank"
              rel="noreferrer"
            >
              {Icon && <Icon />}
            </a>
          </Button>
        );
      })}
    </div>
  );
}
export function SiteFooter() {
  return (
    <>
      <footer className="bg-deep-green text-primary-foreground">
        <div className="site-container grid gap-10 md:grid-cols-[2fr_1fr_1.5fr_1fr] py-14">
          <div>
            <img
              src={logo}
              alt="Hangool Construction & Real Estate"
              className="brand-image footer-logo"
            />
            <p className="mt-5 text-sm leading-7 opacity-65 max-w-xs">
              Rooted in heritage. Built for tomorrow.
              <br />
              Homes and developments made to last.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">Explore</h3>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              {navItems.slice(1).map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">Get in touch</h3>
            <div className="space-y-3 text-sm opacity-70">
              <p>{company.address}</p>
              <p>{company.phone}</p>
              <p>{company.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">Stay connected</h3>
            <SocialLinks />
          </div>
        </div>
        <div className="site-container border-t border-primary-foreground/15 py-5 flex flex-wrap justify-between gap-4 text-xs opacity-60">
          <span>
            © {new Date().getFullYear()} Hangool Construction & Real Estate. All rights reserved.
          </span>
          <span>Built with ambition. Grounded in integrity.</span>
        </div>
      </footer>
      <Button
        variant="default"
        size="icon"
        asChild
        className="floating-contact h-13 w-13 rounded-full"
      >
        <Link to="/contact" aria-label="Contact Hangool on WhatsApp" title="Let's talk on WhatsApp">
          <MessageCircle className="size-6" />
        </Link>
      </Button>
    </>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-heading">
      <div className="site-container">
        <div className="eyebrow text-secondary">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function CTA() {
  return (
    <section className="bg-primary text-primary-foreground py-14">
      <div className="site-container flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div className="space-y-3">
          <div className="eyebrow text-secondary">Let's build something lasting</div>
          <h2 className="text-2xl md:text-3xl font-bold">Have a project in mind? Let’s talk.</h2>
          <p className="text-sm opacity-75">
            Your ambition. Our craftsmanship. A better future, together.
          </p>
        </div>
        <Button variant="gold" size="lg" asChild>
          <Link to="/contact">
            <MessageCircle /> Talk to us on WhatsApp <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
export function ProjectCard({ project, onOpen }: { project: Project; onOpen?: () => void }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const content = (
    <>
      <div className="project-visual">
        <motion.img src={project.image} alt={project.name} className="project-photo" loading="lazy" animate={{ scale: hovered && !reduced ? 1.06 : 1 }} transition={{ duration: reduced ? 0 : .6 }} />
        <motion.div className="project-gradient" animate={{ opacity: hovered ? 1 : .82 }} transition={{ duration: reduced ? 0 : .35 }} />
      <motion.div className="project-caption flex justify-between items-start" animate={{ y: hovered && !reduced ? -8 : 0 }} transition={{ duration: reduced ? 0 : .35 }}>
        <div>
            <span className="text-secondary text-[10px] uppercase font-bold">
            {project.category}
          </span>
          <h3 className="text-base font-bold mt-2">{project.name}</h3>
          <p className="text-xs text-primary-foreground/75 flex gap-1 items-center mt-2">
            <MapPin className="size-3" />
            {project.location}
          </p>
        </div>
        <ArrowUpRight className="size-5 mt-6 text-secondary" />
      </motion.div></div>
    </>
  );
  return onOpen ? (
    <Button
      variant="ghost"
      className="project-card block h-auto p-0 text-left whitespace-normal hover:bg-transparent"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}
      aria-label={`View ${project.name}`}
    >
      {content}
    </Button>
  ) : (
    <Link to="/projects" className="project-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
      {content}
    </Link>
  );
}
export function TextLink({
  to,
  children,
}: {
  to: "/services" | "/projects" | "/about" | "/media";
  children: React.ReactNode;
}) {
  return (
    <Button variant="link" asChild className="px-0">
      <Link to={to}>
        {children}
        <ArrowRight />
      </Link>
    </Button>
  );
}
