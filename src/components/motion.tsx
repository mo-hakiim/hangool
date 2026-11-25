import { useEffect, useRef, type ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/i18n';

export function MotionShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRouterState({ select: s => s.location.pathname });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    const controls: Array<{ stop: () => void }> = [];
    const main = element.querySelector('main');
    if (main) controls.push(animate(main, { opacity: [0, 1] }, { duration: .35 }));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        controls.push(animate(entry.target, { opacity: [0, 1], y: [24, 0] }, { duration: .6, ease: [.22, 1, .36, 1] }));
        const items = entry.target.querySelectorAll('.grid > *, .service-card, article');
        items.forEach((item, i) => {
          controls.push(animate(item, { opacity: [0, 1], y: [18, 0] }, { duration: .5, delay: Math.min(i * .055, .22), ease: [.22, 1, .36, 1] }));
        });
      });
    }, { threshold: .06 });
    element.querySelectorAll('section:not(.home-hero)').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); controls.forEach(c => c.stop()); };
  }, [path, reduced]);
  return <><motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduced ? 0 : scrollYProgress }} /><div ref={root}>{children}</div><ButtonMotion /></>;
}

// Delegated events cover Buttons using asChild without wrappers that alter layout.
function ButtonMotion() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const active = new Map<HTMLElement, { stop: () => void }>();
    const find = (event: Event) => event.target instanceof Element ? event.target.closest<HTMLElement>('[data-motion-button]') : null;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const target = find(event);
      if (!target || target.matches(':disabled, [aria-disabled="true"]') || target.classList.contains('project-card')) return;
      const rect = target.getBoundingClientRect();
      active.get(target)?.stop();
      active.set(target, animate(target, { x: (event.clientX - rect.left - rect.width / 2) * .07, y: (event.clientY - rect.top - rect.height / 2) * .1 }, { duration: .2 }));
    };
    const reset = (event: Event) => {
      const target = find(event);
      if (!target) return;
      if (event instanceof PointerEvent && event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
      active.get(target)?.stop();
      active.set(target, animate(target, { x: 0, y: 0, scale: 1 }, { duration: .25 }));
    };
    const press = (event: Event) => {
      const target = find(event);
      if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
      active.get(target)?.stop();
      active.set(target, animate(target, { scale: .97 }, { duration: .12 }));
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerout', reset);
    document.addEventListener('pointerdown', press);
    document.addEventListener('pointerup', reset);
    document.addEventListener('pointercancel', reset);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', reset);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', reset);
      document.removeEventListener('pointercancel', reset);
      active.forEach(c => c.stop());
    };
  }, [reduced]);
  return null;
}

export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: .8 });
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduced) return;
    const target = Number.parseInt(value, 10);
    if (!Number.isFinite(target)) return;
    const controls = animate(0, target, { duration: .75, ease: 'easeOut', onUpdate: n => { node.textContent = String(Math.round(n)); } });
    return () => { controls.stop(); node.textContent = String(target); };
  }, [inView, reduced, value]);
  return <span ref={ref}>{value.replace('+', '')}</span>;
}

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 900], [1.03, 1.1]);
  const y = useTransform(scrollY, [0, 900], [0, 55]);
  return <motion.img src={src} alt={alt} className="hero-photo" fetchPriority="high" style={reduced ? {} : { scale, y }} />;
}
export function ServiceMarquee() {
  const { t } = useI18n();
  const services = t.construction.items;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return <div ref={ref} className="service-marquee" aria-label={t.construction.listTitle}><motion.div className="marquee-track" animate={!reduced && inView ? { x: ['0%', '-50%'] } : { x: '0%' }} transition={!reduced && inView ? { duration: 26, repeat: Infinity, ease: 'linear' } : { duration: 0 }}>{[0,1].map(copy => <div key={copy} className="marquee-group" aria-hidden={copy === 1}>{services.map(s => <span key={s.title}>{s.title}<span className="marquee-dot" /></span>)}</div>)}</motion.div></div>;
}
