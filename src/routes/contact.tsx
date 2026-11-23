import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MessageCircle, ArrowUpRight, Phone, Mail, MapPin, Clock3 } from "lucide-react";
import { company, services } from "../../company-data";
import { PageHeading } from "@/components/site";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/contact";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact & Request a Quote",
      "Talk to Hangool about your next home, commercial development, or renovation project in Hargeisa, Somaliland.",
    ),
  component: Contact,
});
function Contact() {
  const [notice, setNotice] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const link = buildWhatsAppLink(company.whatsapp, {
      name: String(data.get("name")),
      phone: String(data.get("phone")),
      projectType: String(data.get("projectType")),
      message: String(data.get("message")),
    });
    if (!link) {
      setNotice("Our WhatsApp number is coming soon. Your message has not been sent.");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
    setNotice("Your inquiry is ready in WhatsApp. Send it there to start the conversation.");
  }
  function direct(channel: "phone" | "email" | "whatsapp") {
    const value = company[channel];
    if (value.includes("[")) {
      setNotice(
        `Our ${channel === "phone" ? "phone number" : channel === "email" ? "email address" : "WhatsApp number"} is coming soon.`,
      );
      return;
    }
    const link =
      channel === "whatsapp"
        ? buildWhatsAppLink(value)
        : `${channel === "phone" ? "tel" : "mailto"}:${value}`;
    if (link) window.location.href = link;
  }
  return (
    <>
      <PageHeading
        eyebrow="Let's talk"
        title="Your next chapter starts here."
        description="Tell us what you have in mind. A family home, a commercial space, a new beginning — we’re ready to listen."
      />
      <section className="section">
        <div className="site-container grid lg:grid-cols-[1.3fr_1fr] gap-14">
          <div>
            <h2 className="section-title">Request a quote.</h2>
            <p className="section-copy mt-3 mb-8">A few details about you and your project.</p>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="text-sm font-semibold">
                  Your name
                  <input
                    className="field"
                    name="name"
                    autoComplete="name"
                    placeholder="Full name"
                    required
                  />
                </label>
                <label className="text-sm font-semibold">
                  Phone number
                  <input
                    className="field"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Your phone number"
                    required
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold">
                Project type
                <select className="field" name="projectType" required defaultValue="">
                  <option value="" disabled>
                    Select a project type
                  </option>
                  {services.map((s) => (
                    <option key={s.title}>{s.title}</option>
                  ))}
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Tell us about your project
                <textarea
                  className="field min-h-36"
                  name="message"
                  placeholder="What would you like to build?"
                  required
                />
              </label>
              <Button variant="gold" size="lg" type="submit">
                <MessageCircle />
                Send via WhatsApp <ArrowUpRight />
              </Button>
              <p role="status" className="text-sm text-primary leading-6">
                {notice}
              </p>
            </form>
          </div>
          <aside>
            <h2 className="text-2xl font-bold mb-7">A conversation. A beginning.</h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Visit our office", value: company.address },
                { icon: Phone, title: "Call us", value: company.phone },
                { icon: Mail, title: "Email us", value: company.email },
                { icon: Clock3, title: "Office hours", value: company.hours },
              ].map((d) => (
                <div key={d.title} className="flex gap-4">
                  <d.icon className="size-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-sm font-bold">{d.title}</h3>
                    <p className="section-copy mt-2">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <Button variant="outline" onClick={() => direct("phone")}>
                <Phone />
                Call
              </Button>
              <Button onClick={() => direct("whatsapp")}>
                <MessageCircle />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={() => direct("email")}>
                <Mail />
                Email
              </Button>
            </div>
            <div className="map-placeholder mt-9 rounded-sm">
              <MapPin className="size-8 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-bold">Hargeisa, Somaliland</h3>
              <p className="text-xs text-muted-foreground mt-2">Office map coming soon</p>
              <Button variant="link" asChild className="mt-3">
                <a
                  href="https://www.google.com/maps/search/Hargeisa+Somaliland"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore Hargeisa <ArrowUpRight />
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
