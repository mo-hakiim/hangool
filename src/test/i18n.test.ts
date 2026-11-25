import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { so } from "@/i18n/so";

type Node = string | Node[] | { [k: string]: Node };

/** Flattens a dictionary into "path" → string pairs, with array lengths recorded. */
function flatten(node: Node, path = "", out: Record<string, string> = {}) {
  if (typeof node === "string") out[path] = node;
  else if (Array.isArray(node)) {
    out[`${path}#length`] = String(node.length);
    node.forEach((n, i) => flatten(n, `${path}[${i}]`, out));
  } else for (const [k, v] of Object.entries(node)) flatten(v, path ? `${path}.${k}` : k, out);
  return out;
}

const flatEn = flatten(en as unknown as Node);
const flatSo = flatten(so as unknown as Node);
const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("translations", () => {
  it("Somali has exactly the same keys and list lengths as English", () => {
    expect(Object.keys(flatSo).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("no text is empty", () => {
    for (const [k, v] of Object.entries({ ...flatEn, ...flatSo })) expect(v.trim(), k).not.toBe("");
  });

  it("keeps the same {placeholders} in both languages", () => {
    for (const k of Object.keys(flatEn)) {
      expect(placeholders(flatSo[k] ?? ""), k).toBe(placeholders(flatEn[k] ?? ""));
    }
  });

  it("Somali is actually translated (not a copy of English)", () => {
    const same = Object.keys(flatEn).filter(
      (k) =>
        !k.endsWith("#length") && flatEn[k] === flatSo[k] && /[a-z]{4,}/i.test(flatEn[k] ?? ""),
    );
    // Brand names, prices and the like may legitimately match; real copy may not.
    const allowed = /WhatsApp|Hangool|USD|m²|\$|^[A-Z]{2}$/;
    expect(same.filter((k) => !allowed.test(flatEn[k] ?? ""))).toEqual([]);
  });
});
