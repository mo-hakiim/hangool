import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Inbox,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/data/live";
import { fill, useI18n } from "@/i18n";
import type { Dictionary } from "@/i18n/en";
import { LanguageSwitcher } from "@/components/language-switcher";
import logo from "@/assets/hangool-logo.png";

/* ---------------- Navigation ---------------- */

export type SitePath =
  | "/"
  | "/about"
  | "/team"
  | "/careers"
  | "/services"
  | "/construction"
  | "/real-estate"
  | "/projects"
  | "/gallery"
  | "/news"
  | "/contact"
  | "/quote";

type NavKey = keyof Dictionary["nav"];
type NavLeaf = { to: SitePath; label: NavKey };
type NavGroup = { label: NavKey; to?: SitePath; children?: NavLeaf[] };

export const navGroups: NavGroup[] = [
  { label: "home", to: "/" },
  {
    label: "about",
    children: [
      { to: "/about", label: "aboutUs" },
      { to: "/team", label: "team" },
      { to: "/careers", label: "careers" },
    ],
  },
  {
    label: "services",
    children: [
      { to: "/services", label: "ourServices" },
      { to: "/construction", label: "construction" },
      { to: "/real-estate", label: "realEstate" },
    ],
  },
  {
    label: "projects",
    children: [
      { to: "/projects", label: "ourProjects" },
      { to: "/gallery", label: "gallery" },
    ],
  },
  { label: "news", to: "/news" },
  { label: "contact", to: "/contact" },
];

/** Every public page, in footer order. */
export const footerLinks: NavLeaf[] = [
  { to: "/about", label: "aboutUs" },
  { to: "/services", label: "ourServices" },
  { to: "/construction", label: "construction" },
  { to: "/real-estate", label: "realEstate" },
  { to: "/projects", label: "ourProjects" },
  { to: "/gallery", label: "gallery" },
  { to: "/team", label: "team" },
  { to: "/news", label: "news" },
  { to: "/careers", label: "careers" },
  { to: "/contact", label: "contact" },
  { to: "/quote", label: "quote" },
];

// Detail pages count as part of their section for the active underline.
const sectionOf: Record<string, SitePath> = {
  "/project": "/projects",
  "/property": "/real-estate",
  "/news/post": "/news",
};

function useActivePath() {
  const path = useRouterState({ select: (s) => s.location.pathname }).replace(/\/+$/, "") || "/";
  return sectionOf[path] ?? path;
}

function DesktopGroup({ group, transparent }: { group: NavGroup; transparent: boolean }) {
  const { t } = useI18n();
  const active = useActivePath();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const children = group.children ?? [];
  const isActive = children.some((c) => c.to === active);

  useEffect(() => setOpen(false), [active]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="nav-group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="nav-link flex items-center gap-1"
        data-active={isActive}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {t.nav[group.label]}
        <ChevronDown className="size-3.5 transition-transform" data-open={open} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-dropdown"
            data-transparent={transparent}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            {children.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                data-active={active === c.to}
                className="nav-dropdown-link"
              >
                {t.nav[c.label]}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const active = useActivePath();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => setOpen(false), [active]);
  const transparent = active === "/" && !scrolled && !open;
  return (
    <header className="site-header" data-transparent={transparent} data-home={active === "/"}>
      <motion.div
        className="header-glass"
        aria-hidden="true"
        animate={{ opacity: transparent ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      />
      <div className="site-container flex h-full items-center justify-between gap-6">
        <Link to="/" aria-label={t.nav.home_aria} onClick={() => setOpen(false)}>
          <img src={logo} alt="Hangool Construction & Real Estate" className="brand-image" />
        </Link>
        <nav aria-label={t.nav.mainNav} className="hidden xl:flex items-center gap-5 2xl:gap-6">
          {navGroups.map((g) =>
            g.children ? (
              <DesktopGroup key={g.label} group={g} transparent={transparent} />
            ) : (
              <Link key={g.label} to={g.to!} data-active={active === g.to} className="nav-link">
                {t.nav[g.label]}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden xl:flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="gold" asChild className="h-11">
            <Link to="/quote">
              {t.nav.quote} <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="flex xl:hidden items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label={t.nav.mobileNav}
            className="mobile-menu xl:hidden border-b border-border bg-background px-6 py-6 flex flex-col gap-1"
            initial={reduced ? false : { opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -15 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          >
            {navGroups.map((g) =>
              g.children ? (
                <div key={g.label} className="mobile-group">
                  <p className="mobile-group-title">{t.nav[g.label]}</p>
                  {g.children.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      onClick={() => setOpen(false)}
                      className="nav-link"
                      data-active={active === c.to}
                    >
                      {t.nav[c.label]}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={g.label}
                  to={g.to!}
                  onClick={() => setOpen(false)}
                  className="nav-link"
                  data-active={active === g.to}
                >
                  {t.nav[g.label]}
                </Link>
              ),
            )}
            <Button variant="gold" asChild className="mt-3">
              <Link to="/quote" onClick={() => setOpen(false)}>
                {t.nav.quote} <ArrowUpRight />
              </Link>
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- Social links ---------------- */

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.73 5.73 0 0 0-.77-.05 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
    </svg>
  );
}
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  TikTok: TikTokIcon,
  Instagram,
  YouTube: Youtube,
};
export function SocialLinks({ variant = "hero" }: { variant?: "hero" | "outline" }) {
  const { t } = useI18n();
  const settings = useSettings();
  return (
    <div className="flex flex-wrap gap-3">
      {settings.socials.map((s) => {
        const Icon = socialIcons[s.name];
        return (
          <Button key={s.name} variant={variant} size="icon" asChild>
            <a
              href={s.url}
              aria-label={fill(t.common.onSocial, { name: s.name })}
              title={s.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {Icon && <Icon />}
            </a>
          </Button>
        );
      })}
    </div>
  );
}

/* ---------------- Footer ---------------- */

export function SiteFooter() {
  const { t } = useI18n();
  const settings = useSettings();
  return (
    <>
      <footer className="bg-deep-green text-primary-foreground">
        <div className="site-container grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1.6fr_1.3fr_1fr] py-14">
          <div>
            <img
              src={logo}
              alt="Hangool Construction & Real Estate"
              className="brand-image footer-logo"
            />
            <p className="mt-5 text-sm leading-7 opacity-65 max-w-xs">{t.footer.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">{t.footer.explore}</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm opacity-70">
              {footerLinks.map((n) => (
                <Link key={n.to} to={n.to} className="hover:opacity-100">
                  {t.nav[n.label]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">{t.footer.getInTouch}</h3>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              <a href={settings.phoneHref} className="flex items-center gap-2 hover:opacity-100">
                <Phone className="size-4" /> <span dir="ltr">{settings.phone}</span>
              </a>
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-100"
              >
                <MessageCircle className="size-4" /> {t.common.whatsapp}
              </a>
              <a
                href={settings.emailHref}
                className="flex items-center gap-2 break-all hover:opacity-100"
              >
                <Mail className="size-4 shrink-0" /> {settings.email}
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-5">{t.footer.stayConnected}</h3>
            <SocialLinks />
          </div>
        </div>
        <div className="site-container border-t border-primary-foreground/15 py-5 flex flex-wrap justify-between gap-4 text-xs opacity-60">
          <span>
            © {new Date().getFullYear()} Hangool Construction & Real Estate. {t.footer.rights}
          </span>
          <span className="flex flex-wrap gap-4">
            <span>{t.footer.tagline}</span>
            <a
              href={`${import.meta.env.BASE_URL}admin`}
              rel="nofollow"
              className="underline-offset-4 hover:underline"
            >
              {t.footer.admin}
            </a>
          </span>
        </div>
      </footer>
      <Button
        variant="default"
        size="icon"
        asChild
        className="floating-contact h-13 w-13 rounded-full"
      >
        <a
          href={settings.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.common.chatWhatsApp}
          title={t.common.whatsappTitle}
        >
          <MessageCircle className="size-6" />
        </a>
      </Button>
    </>
  );
}

/* ---------------- Page building blocks ---------------- */

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
  const { t } = useI18n();
  const settings = useSettings();
  return (
    <section className="bg-primary text-primary-foreground py-14">
      <div className="site-container flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div className="space-y-3">
          <div className="eyebrow text-secondary">{t.cta.eyebrow}</div>
          <h2 className="text-2xl md:text-3xl font-bold">{t.cta.title}</h2>
          <p className="text-sm opacity-75">{t.cta.copy}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="gold" size="lg" asChild>
            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> {t.common.talkWhatsApp} <ArrowUpRight />
            </a>
          </Button>
          <Button variant="hero" size="lg" asChild>
            <Link to="/quote">
              {t.nav.quote} <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Shown where content is managed in the dashboard but nothing is published yet. */
export function EmptyState({
  title,
  text,
  offline = false,
  children,
}: {
  title: string;
  text: string;
  offline?: boolean;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const settings = useSettings();
  const Icon = offline ? WifiOff : Inbox;
  return (
    <div className="empty-state" role="status">
      <Icon className="size-8 text-primary/60" strokeWidth={1.5} />
      <h3 className="text-lg font-bold mt-4">{offline ? t.common.comingSoon : title}</h3>
      <p className="section-copy mt-2 max-w-md mx-auto">{offline ? t.common.offline : text}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {children ?? (
          <Button variant="outline" asChild>
            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> {t.common.whatsapp}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

/** Placeholder cards while live content loads. */
export function LoadingGrid({ count = 3, className = "" }: { count?: number; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-7 ${className}`} aria-busy="true">
      <span className="sr-only">{t.common.loading}</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton aspect-[4/4.2] rounded-sm" />
      ))}
    </div>
  );
}

/** Photo card used for projects and properties (same design as the original project card). */
export function MediaCard({
  image,
  title,
  eyebrow,
  location,
  to,
  id,
  badge,
}: {
  image: string;
  title: string;
  eyebrow: string;
  location?: string | null | undefined;
  to: "/project" | "/property";
  id: string;
  badge?: string | undefined;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      search={{ id }}
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="project-visual">
        <motion.img
          src={image}
          alt={title}
          className="project-photo"
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered && !reduced ? 1.06 : 1 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        />
        <motion.div
          className="project-gradient"
          animate={{ opacity: hovered ? 1 : 0.82 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
        />
        {badge && <span className="media-badge">{badge}</span>}
        <motion.div
          className="project-caption flex justify-between items-start"
          animate={{ y: hovered && !reduced ? -8 : 0 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
        >
          <div>
            <span className="text-secondary text-[10px] uppercase font-bold">{eyebrow}</span>
            <h3 className="text-base font-bold mt-2">{title}</h3>
            {location && (
              <p className="text-xs text-primary-foreground/75 flex gap-1 items-center mt-2">
                <MapPin className="size-3" />
                {location}
              </p>
            )}
          </div>
          <ArrowUpRight className="size-5 mt-6 text-secondary shrink-0" />
        </motion.div>
      </div>
    </Link>
  );
}

export function TextLink({ to, children }: { to: SitePath; children: ReactNode }) {
  return (
    <Button variant="link" asChild className="px-0">
      <Link to={to}>
        {children}
        <ArrowRight />
      </Link>
    </Button>
  );
}

/** Link to a ?id= detail page, honouring the deployment base path. */
export function detailHref(page: "project" | "property" | "news/post", id: string) {
  return `${import.meta.env.BASE_URL}${page}?id=${encodeURIComponent(id)}`;
}
