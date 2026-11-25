import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { en, type Dictionary } from "./en";
import { so } from "./so";

export type Lang = "en" | "so";
export const LANG_KEY = "hangool_lang";
export const dictionaries: Record<Lang, Dictionary> = { en, so };

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "so";
}

/** Replaces {key} placeholders in a dictionary string. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

type Ctx = { lang: Lang; t: Dictionary; setLang: (l: Lang) => void };
const LanguageContext = createContext<Ctx | null>(null);

function readSaved(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return isLang(v) ? v : "en";
  } catch {
    return "en";
  }
}

// Pages are prerendered in English. After loading, the browser switches to the
// language saved in localStorage, so the choice is kept while browsing.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(readSaved());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* private mode: the choice lasts for this page only */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}

/** Picks the Somali text of a database field when Somali is chosen and filled in. */
export function useLocalize() {
  const { lang } = useI18n();
  return useCallback(
    (enText: string | null | undefined, soText?: string | null) =>
      (lang === "so" && soText?.trim() ? soText : enText) ?? "",
    [lang],
  );
}
