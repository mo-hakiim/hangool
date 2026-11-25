import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "@/lib/contact";
describe("WhatsApp inquiries", () => {
  it("does not create an invalid link for missing contact details", () => {
    expect(buildWhatsAppLink("[WHATSAPP NUMBER]")).toBeNull();
  });
  it("prefills all four requested contact fields", () => {
    const link = buildWhatsAppLink("+252 63 1234567", {
      name: "Amina",
      phone: "0631112222",
      projectType: "Residential construction",
      message: "A two-storey home",
    });
    expect(link?.split("?")[0]).toBe("https://wa.me/252631234567");
    expect(decodeURIComponent(link ?? "")).toContain(
      "Name: Amina\nPhone: 0631112222\nProject: Residential construction\nMessage: A two-storey home",
    );
  });
});
describe("company contact details", () => {
  it("uses the real phone, WhatsApp and email links", async () => {
    const { company } = await import("../../company-data");
    expect(company.phoneHref).toBe("tel:+252636378888");
    expect(company.whatsappUrl).toBe("https://wa.me/252636378888");
    expect(company.emailHref).toBe("mailto:info@hangooldevelopment.com");
    expect(buildWhatsAppLink(company.whatsapp)?.split("?")[0]).toBe(company.whatsappUrl);
  });
  it("lists four social links, all real https URLs and no LinkedIn", async () => {
    const { company } = await import("../../company-data");
    expect(company.socials.map((s) => s.name)).toEqual([
      "Facebook",
      "TikTok",
      "Instagram",
      "YouTube",
    ]);
    for (const s of company.socials) expect(s.url).toMatch(/^https:\/\/www\./);
    expect(JSON.stringify(company)).not.toMatch(/linkedin/i);
  });
});
