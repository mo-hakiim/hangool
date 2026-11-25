import { describe, expect, it } from "vitest";
import { company } from "../../company-data";
import { mergeSettings } from "@/data/live";
import { validate } from "@/components/inquiry-form";

describe("company contact details", () => {
  it("built-in defaults are the real phone, WhatsApp and email", () => {
    const s = mergeSettings(null);
    expect(s.phoneHref).toBe("tel:+252636378888");
    expect(s.whatsappUrl).toBe("https://wa.me/252636378888");
    expect(s.emailHref).toBe("mailto:info@hangooldevelopment.com");
    expect(s.socials.map((x) => x.name)).toEqual(["Facebook", "TikTok", "Instagram", "YouTube"]);
    expect(JSON.stringify(company)).not.toMatch(/linkedin/i);
  });

  it("settings saved in the dashboard override the defaults", () => {
    const s = mergeSettings({
      id: 1,
      stats: null,
      phone: "+252 63 1112223",
      whatsapp: null,
      email: "",
      facebook: null,
      tiktok: null,
      instagram: null,
      youtube: "https://www.youtube.com/@other",
      address: null,
      address_so: null,
      map_query: " ",
      updated_at: "",
    });
    expect(s.phoneHref).toBe("tel:+252631112223");
    expect(s.whatsappUrl).toBe("https://wa.me/252636378888");
    expect(s.email).toBe(company.email);
    expect(s.socials.find((x) => x.name === "YouTube")?.url).toBe("https://www.youtube.com/@other");
    expect(s.mapQuery).toBeNull();
  });

  it("stats stay hidden until all four figures are confirmed", () => {
    expect(mergeSettings(null).stats).toBeNull();
    const base = {
      id: 1,
      phone: null,
      whatsapp: null,
      email: null,
      facebook: null,
      tiktok: null,
      instagram: null,
      youtube: null,
      address: null,
      address_so: null,
      map_query: null,
      updated_at: "",
    };
    expect(
      mergeSettings({ ...base, stats: { years: 10, projects: 0, clients: 100, professionals: 30 } })
        .stats,
    ).toBeNull();
    expect(
      mergeSettings({
        ...base,
        stats: { years: 10, projects: 50, clients: 100, professionals: 30 },
      }).stats?.projects,
    ).toBe(50);
  });
});

describe("form validation", () => {
  it("requires name, phone and message", () => {
    expect(validate("contact", {})).toEqual({
      name: "required",
      phone: "required",
      message: "required",
    });
  });
  it("accepts local and international Somaliland numbers", () => {
    for (const phone of ["063 1234567", "+252 63 6378888", "(063) 123-4567"])
      expect(validate("contact", { name: "A", phone, message: "Hi" })).toEqual({});
  });
  it("rejects bad phone numbers and emails", () => {
    expect(validate("contact", { name: "A", phone: "call me", message: "x" })["phone"]).toBe(
      "invalidPhone",
    );
    expect(validate("contact", { name: "A", phone: "123", message: "x" })["phone"]).toBe(
      "invalidPhone",
    );
    expect(
      validate("contact", { name: "A", phone: "0631234567", message: "x", email: "nope" })["email"],
    ).toBe("invalidEmail");
  });
  it("quote needs a service type; viewing doesn't need a message", () => {
    expect(
      validate("quote", { name: "A", phone: "0631234567", message: "x" })["service_type"],
    ).toBe("required");
    expect(validate("viewing", { name: "A", phone: "0631234567" })).toEqual({});
  });
});
describe("company-data.ts built-in contact details", () => {
  it("uses the real phone, WhatsApp and email links", async () => {
    const { company } = await import("../../company-data");
    expect(company.phoneHref).toBe("tel:+252636378888");
    expect(company.whatsappUrl).toBe("https://wa.me/252636378888");
    expect(company.emailHref).toBe("mailto:info@hangooldevelopment.com");
    expect(mergeSettings(null).whatsappUrl).toBe(company.whatsappUrl);
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
