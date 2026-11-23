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
