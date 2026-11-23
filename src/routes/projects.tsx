import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, X } from "lucide-react";
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects, type Project } from "../../company-data";
import { CTA, PageHeading, ProjectCard } from "@/components/site";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/projects")({
  head: () =>
    pageHead(
      "Our Projects",
      "Explore residential, commercial, and renovation spaces in the Hangool portfolio.",
    ),
  component: Projects,
});
function Projects() {
  const [filter, setFilter] = useState("All Projects");
  const [selected, setSelected] = useState<Project | null>(null);
  const [photo, setPhoto] = useState(0);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <>
      <PageHeading
        eyebrow="Our portfolio"
        title="Spaces with purpose."
        description="Homes for families. Places for businesses. A lasting foundation for the next chapter."
      />
      <section className="section">
        <div className="site-container">
          <div className="flex flex-wrap gap-3 mb-9" aria-label="Project categories">
            {["All Projects", "Residential", "Commercial", "Renovation"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
            {projects
              .filter((p) => filter === "All Projects" || p.category === filter)
              .map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => {
                    setSelected(p);
                    setPhoto(0);
                    setOpen(true);
                  }}
                />
              ))}
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            Sample portfolio · Images and details will be replaced with actual Hangool projects.
          </p>
        </div>
      </section>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence onExitComplete={() => { if (!open) setSelected(null); }}>
        {open && <DialogPrimitive.Portal forceMount>
        <DialogPrimitive.Overlay forceMount asChild><motion.div className="fixed inset-0 z-50 bg-deep-green/80" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} /></DialogPrimitive.Overlay>
        <DialogPrimitive.Content forceMount asChild><motion.div className="project-dialog" initial={reduced ? false : { opacity: 0, scale: .96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : .97, y: reduced ? 0 : 12 }} transition={{ duration: reduced ? 0 : .35 }}>
          <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="absolute right-3 top-3" aria-label="Close"><X /></Button></DialogPrimitive.Close>
          {selected && (
            <>
              <DialogTitle className="pr-5 leading-7">{selected.name}</DialogTitle>
              <DialogDescription>{selected.category} · Sample project</DialogDescription>
              <img
                src={selected.gallery[photo]}
                alt={`${selected.name} — photo ${photo + 1}`}
                className="w-full aspect-[16/10] object-cover rounded-sm"
              />
              <div className="flex gap-3">
                {selected.gallery.map((img, i) => (
                  <Button
                    key={img}
                    variant={photo === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPhoto(i)}
                  >
                    Photo {i + 1}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {selected.location}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  {selected.year}
                </span>
              </div>
              <p className="text-sm leading-7">{selected.description}</p>
            </>
          )}
        </motion.div></DialogPrimitive.Content></DialogPrimitive.Portal>}
        </AnimatePresence>
      </DialogPrimitive.Root>
      <CTA />
    </>
  );
}
